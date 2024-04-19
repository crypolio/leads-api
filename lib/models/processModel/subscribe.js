const { chromium } = require('playwright');
const axios = require('axios');

const utils = require('@utils');

const delayTime = 1000 * 60;

const emailFilter = [
	'.webp', '@wix.com',
	'@sentry-next.wixpress.com', 
	'.png', '.jpg', '.jpeg', '.svg', 
	'sentry.io', '@sentry.wixpress.com', 
];

const parseString = (val = '') => val.replaceAll('', '').replaceAll('', '');

const fetchEmails = async (url = '') => {
	try {
		const { data = '' } = await axios({
			url, method: 'get', timeout: delayTime,
			signal: AbortSignal.timeout(delayTime),
		});

		if (!data) return;

		const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

		let emailMatches = data.match(emailRegex);

		if (emailMatches) {
			emailMatches = emailMatches.filter((email) => 
				!emailFilter.some((filterItem) => 
					email.includes(filterItem)
				)
			);
		}

		return emailMatches ? Array.from(new Set(emailMatches)) : [];
	} catch (error) {
		if (error.name === 'TimeoutError') {
			console.warn(`Timeout when accessing: ${url}`);
			return [];
		} else {
			return [];
		}
	}
}

const scrapeEmails = async (taskId = '', allRows = []) => {
	await utils.query(
		'UPDATE tasks SET status = 3 WHERE id = ?', 
		[ taskId ]
	);

	for (let r = 0; r < allRows.length; r += 1) {
		const { id = '', website = '' } = allRows[r];
		if (website && website?.length) {
			console.log(`Scraping: ${website}`);
			const emails = await fetchEmails(website);
			if (emails && emails.length) {
				await Promise.all(emails.map((email) => (
					utils.query(
						`INSERT INTO lead_emails (` +
							`lead_id, task_id, email` +
						`) VALUES (?, ?, ?)`,
						[ id, taskId, email ]
					)
				)));
			}
		}
	}

	return true;
};

const scrappe = async () => {
	let taskId = null;

	try {
		const [ taskData ] = await utils.query(
			'SELECT * FROM tasks WHERE status = 0 LIMIT 1', 
		);

		if (!taskData) return;

		taskId = taskData?.id;

		await utils.query(
			'UPDATE tasks SET status = 2 WHERE id = ?', 
			[ taskId ]
		);

		const googleUrl = taskData?.www;

		console.time("Execution Time");

		const browser = await chromium.launch({
			headless: true
		});

		const page = await browser.newPage();

		await page.goto(googleUrl, { timeout: 0 });
		await page.waitForSelector('[jstcache="3"]');

		const scrollable = await page.$(
			'xpath=/html/body/div[2]/div[3]/div[8]/div[9]/div/div/div[1]/div[2]/div/div[1]/div/div/div[1]/div[1]'
		);

		if (!scrollable) {
			console.log('Scrollable element not found.');
			await browser.close();
			return;
		}

		let endOfList = false;

		while (!endOfList) {
			await scrollable.evaluate(node => node.scrollBy(0, 50000));
			endOfList = await page.evaluate(() => (
				document.body.innerText.includes("You've reached the end of the list")
			));
		}

		const urls = await page.$$eval('a', links => links.map(link => link.href).filter(href => 
			href.startsWith('https://www.google.com/maps/place/')
		));

		const scrapePageData = async (url) => {
			const newPage = await browser.newPage();

			await newPage.goto(url, { timeout: 0 });
			await newPage.waitForSelector('[jstcache="3"]');

			const nameElement = await newPage.$(
				'xpath=/html/body/div[2]/div[3]/div[8]/div[9]/div/div/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div[1]/div[1]/h1'
			);

			const name = nameElement ? await newPage.evaluate(element => element.textContent, nameElement) : '';

			const ratingElement = await newPage.$(
				'xpath=/html/body/div[2]/div[3]/div[8]/div[9]/div/div/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div[1]/div[2]/div/div[1]/div[2]/span[1]/span[1]'
			);

			let rating = ratingElement ? await newPage.evaluate(element => element.textContent, ratingElement) : '';
			rating = Number(rating);

			const reviewsElement = await newPage.$(
				'xpath=/html/body/div[2]/div[3]/div[8]/div[9]/div/div/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div[1]/div[2]/div/div[1]/div[2]/span[2]/span/span'
			);

			let reviews = reviewsElement ? await newPage.evaluate(element => element.textContent, reviewsElement) : '';
			reviews = Number(reviews.replace(/\(|\)/g, ''));

			const categoryElement = await newPage.$(
				'xpath=/html/body/div[2]/div[3]/div[8]/div[9]/div/div/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div[1]/div[2]/div/div[2]/span/span/button'
			);

			let category = categoryElement ? await newPage.evaluate(element => element.textContent, categoryElement) : '';

			const addressElement = await newPage.$('button[data-tooltip="Copy address"]');

			let address = addressElement ? await newPage.evaluate(element => element.textContent, addressElement) : '';
			address = `${parseString(address)}`;

			const websiteElement = await newPage.$('a[data-tooltip="Open website"]') || await newPage.$('a[data-tooltip="Open menu link"]');

			let website = websiteElement ? await newPage.evaluate(element => element.getAttribute('href'), websiteElement) : '';
			// website = `${website}`;

			const phoneElement = await newPage.$('button[data-tooltip="Copy phone number"]');

			let phone = phoneElement ? await newPage.evaluate(element => element.textContent, phoneElement) : '';
			phone = `${parseString(phone)}`;

			await newPage.close();

			return {
				id: utils.uuidv4(),
				name,
				rating,
				reviews,
				category,
				address,
				website,
				phone,
				url
			};
		};

		const batchSize = 5;
		const results = [];

		for (let i = 0; i < urls.length; i += batchSize) {
			const batchUrls = urls.slice(i, i + batchSize);
			const batchResults = await Promise.all(batchUrls.map(url => scrapePageData(url)));
			results.push(...batchResults);
			console.log(`Batch ${i/batchSize+1} completed.`);
		}

		for (const [ index, result ] of results.entries()) {
			await utils.query(
				'INSERT INTO leads (' +
					'id, task_id, name, rating, ' +
					'reviews, category, address, ' +
					'phone, www' +
				') VALUES (' +
					'?, ?, ?, ?, ?, ?, ?, ?, ?' +
				')',
				[
					result.id, 		// id
					taskId, 		// task_id
					result.name, 		// name
					result.rating, 		// rating
					result.reviews, 	// reviews
					result.category, 	// category
					result.address, 	// address
					result.phone, 		// phone
					result.website, 	// website
				]
			);
		}

		await utils.query(
			'UPDATE tasks SET status = 1 WHERE id = ?', 
			[ taskId ]
		);

		await browser.close();

		await scrapeEmails(taskId, results);

		await utils.query(
			'UPDATE tasks SET status = 1 WHERE id = ?', 
			[ taskId ]
		);

		return {
			id: taskId,
			results
		}

		console.timeEnd("Execution Time");
	} catch (error) {
		console.error('Something bad happens', error);

		await utils.query(
			'UPDATE tasks SET status = 3 WHERE id = ?', 
			[ taskId ]
		);

		return false;
	}
};

const subscribe = async () => {
	await scrappe();
	await utils.delay(5000);
	subscribe();
}

module.exports = subscribe;
