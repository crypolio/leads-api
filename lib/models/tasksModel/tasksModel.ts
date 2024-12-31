// @ts-nocheck

'use strict';

// import { log } from './../../utils';

// Set setting & processes utilities.
// let SU = new SettingsUtil; 

const tasks = ({}) => {

	// constructor(options){

	// 	this.options = Object.assign({}, {
	// 		emailInterval : Number(options.emailInterval) || SU.getEmailProcessInterval();
	// 	}, options);

	// 	this.isInit;
	// 	this.processes = {};

	// };

	/*
	* Initialize processes.
	*/
	const init = async () => {
		// try{
			if(typeof(this.isInit) === 'undefined'){
				// Exec mail process.
				this.execMailProcess();
				this.processes.mail   = setInterval(this.execMailProcess, this.options.emailInterval);
				
			}
		// }catch(e){
		// 	throw new Error('while initializing processes.');
		// }
	};

	/*
	* Stop exec processes.
	* @params {String} name - Process name.
	*/
	const stop = async (name = undefined) => {
		// try{
			if(typeof(this.isInit) === 'undefined'){
				if(typeof(name) !== 'undefined'){
					clearInterval(this?.processes[name]);
				}else{
					Object.keys(this?.processes).map((pName) => (
						clearInterval(this?.processes[pName])
					));
				}
				return 0;
			}
		// }catch(e){
		// 	throw new Error('while stoping processes.');
		// }
	};
	
	/*
	* Execute mail process.
	*/
	const execMailProcess = async () => {
		// try{
			// log.info('Executing mail process...', this?.options);
			// // await new (require('./Mailing'))({}).mailEmails();
			// return true;
		// }catch(e){
		// 	throw new Error('while executing mail process.');
		// }
	};

};

export default tasks;
