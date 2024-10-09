"use strict";

// External libraries dependencies.
// @ts-ignore
import bodyParser from "koa-bodyparser";
import compression from "koa-compress";
import { chromium } from "playwright";
import { exec } from "child_process";
import jwt from "jsonwebtoken";
import Router from "koa-router";
import helmet from "koa-helmet";
import cors from "@koa/cors";
import moment from "moment";
import axios from "axios";
import path from "path";
import Koa from "koa";
import fs from "fs";
import os from "os";

// Internal libraries dependencies.
import PostgresUtil from "./classes/PostgresUtil";
import SSEChannel from "./classes/SSEChannel";
import middlewares from "./middlewares";
import Stack from "./classes/Stack";
import stats from "./statistics";

import config from "./../config";

// Set private/public keys.
const privateKey = fs.readFileSync(
  path.join(__dirname, "/../../private/keys/crypolio.key"),
  "utf8",
);
const publicKey = fs.readFileSync(
  path.join(__dirname, "/../../private/keys/crypolio.key.pub"),
  "utf8",
);

const pg = new PostgresUtil();

const index: any = {};

/*
 * Get Postgres Database
 * @returns {Object} Return new postgres db connection.
 */
const query = async (sql: string, args: any) => {
  try {
    log.info(sql);
    return await pg.query(sql, args);
  } catch (e) {
    console.error(e);
  }
};
index["query"] = query;

/*
 * Fix single quote.
 * @params {s} string - Single quoted string.
 * @returns {string} Return parsed string for database insertion.
 */
const fixSingleQuote = (s: string) => {
  return pg.fixSingleQuote(s);
};
index["fixSingleQuote"] = fixSingleQuote;

/*
 * Get health
 */
const getHealth = () => {
  const app: any = config.app;
  const { env, id, service, version } = app;
  return {
    id,
    service,
    version,
    mode: env,
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  };
};
index["getHealth"] = getHealth;

/*
 * Process.
 */
const parallelProcess = async (arrayOfPromises: []) => {
  console.log(
    `=====================================================`,
    arrayOfPromises.length,
  );
  console.time(`process`);
  const responses = await Promise.all(arrayOfPromises);
  console.log(responses);
  for (const r of responses) {
  }
  console.timeEnd(`process`);
  console.log(`=====================================================`);
  return responses;
};
index["parallelProcess"] = parallelProcess;

/*
 * Timeout.
 */
const timeout = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
index["timeout"] = timeout;

/*
 * Sleep
 */
const sleep = async (fn: any, ...args: any[]) => {
  await timeout(3000);
  return fn(...args);
};
index["sleep"] = sleep;

/*
 * Remove space from begining and back of a string.
 * @param {string} val - String value
 * @returns {string} Returns parse string.
 */
const removeUnusedSpaces = (txt: string) => {
  return txt.toString().replace(/^\s+|\s+$/g, "");
};
index["removeUnusedSpaces"] = removeUnusedSpaces;

/**
 * Get the user IP throught the webkitRTCPeerConnection
 * @param onNewIP {Function} listener function to expose the IP locally
 * @return undefined
 */
const getPrivateIp = (type = "ipv4", device = false, alias = false) => {
  // Set network interface(s).
  const ifaces: any = os.networkInterfaces();

  const res: string[] = [];

  Object.keys(ifaces).map((ifname) => {
    let a = 0;

    ifaces[ifname].map((iface: any) => {
      // Evaluate if user want ip v6 or ipv4.
      if (type.includes("6")) {
        // Skip over internal (i.e. ::1) and non-ipv6 addresses
        if ("IPv6" !== iface.family || iface.internal !== false) return;
      } else {
        // Skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        if ("IPv4" !== iface.family || iface.internal !== false) return;
      }

      // Evaluate.
      res.push(
        a >= 1
          ? // this single interface has multiple ipv4/ipv6 addresses.
            `${device ? `${ifname} :` : ""}` +
              `${alias ? a : ""}` +
              `${iface.address}`
          : // this interface has only one ipv4/ipv6 adress.
            `${device ? `${ifname} :` : ""}` + `${iface.address}`,
      );
      ++a;
    });
  });
  return res;
};
index["getPrivateIp"] = getPrivateIp;

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
index["getRandomInt"] = getRandomInt;

const userAgent = [
  // Chrome web browser.
  [
    {
      os: "Windows",
      browser: "chrome",
      version: "62.0.3202.9",
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; WOW64) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) " +
        "Chrome/62.0.3202.9 Safari/537.36",
    },
    {
      os: "Linux",
      browser: "chrome",
      version: "61.0.3163.100",
      userAgent:
        "Mozilla/5.0 (X11; Linux x86_64) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) " +
        "Chrome/61.0.3163.100 Safari/537.36",
    },
    {
      os: "Machintosh",
      browser: "chrome",
      version: "62.0.3202.75",
      userAgent:
        "Mozilla/5.0 " +
        "(Macintosh; Intel Mac OS X 10_12_6) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) " +
        "Chrome/62.0.3202.75 Safari/537.36",
    },
  ],
  // Opera web browser.
  [
    {
      os: "Windows",
      browser: "opera",
      version: "61.0.3163.100",
      userAgent:
        "Mozilla/5.0 " +
        "(Windows NT 10.0; Win64; x64) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) " +
        "Chrome/61.0.3163.100 " +
        "Safari/537.36 OPR/48.0.2685.52",
    },
    {
      os: "Linux",
      browser: "opera",
      version: "61.0.3163.49",
      userAgent:
        "Mozilla/5.0 (X11; Linux x86_64) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) " +
        "Chrome/61.0.3163.49 " +
        "Safari/537.36 OPR/48.0.2685.7",
    },
    {
      os: "Machintosh",
      browser: "opera",
      version: "60.0.3112.78",
      userAgent:
        "Mozilla/5.0 " +
        "(Macintosh; Intel Mac OS X 10_12_6) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) " +
        "Chrome/60.0.3112.78 " +
        "Safari/537.36 OPR/47.0.2631.55",
    },
  ],
  // Firefox web browser.
  [
    {
      os: "Windows",
      browser: "firefox",
      version: "56.0",
      userAgent:
        "Mozilla/5.0 " +
        "(Windows NT 10.0; WOW64; rv:56.0) " +
        "Gecko/20100101 Firefox/56.0",
    },
    {
      os: "Linux",
      browser: "firefox",
      version: "31.0",
      userAgent:
        "Mozilla/5.0 " +
        "(X11; Linux i586; rv:31.0) " +
        "Gecko/20100101 Firefox/31.0",
    },
    {
      os: "Machintosh",
      browser: "firefox",
      version: "56.0",
      userAgent:
        "Mozilla/5.0 " +
        "(Macintosh; Intel Mac OS X 10.12; rv:56.0) " +
        "Gecko/20100101 Firefox/56.0",
    },
  ],
];
index["userAgent"] = userAgent;

/*
 * Request async.
 * @param {string} url - URL.
 * @returns {object} Returns url response.
 */
const request = async (
  method: string,
  url = "",
  data: string | null = null,
  ua: string | null = null,
  token = null,
) => {
  try {
    // const config = {
    // 	url,
    // 	method,
    // 	...(data) && (data),
    // 	headers : {
    // 		'User-Agent' : (
    // 			(ua && ua.length) ? (
    // 				ua
    // 			) : (
    // 				userAgent[getRandomInt(0, 2)][getRandomInt(0, 2)]['userAgent']
    // 			)
    // 		),
    // 		...(token && token.length) && ({
    // 			common : {
    // 				authorization : `Bearer ${token}`
    // 			}
    // 		})
    // 	}
    // };
    // const res = await axios(config);
    const methodCall: any = (<any>axios)[method];
    const res: any = await methodCall(url, data);
    return {
      stat: true,
      data: res.data,
    };
  } catch (e) {
    return {
      stat: false,
      data: {},
    };
  }
};
index["request"] = request;

/**
 * Get HTTP.
 */
const getHTTP = async (url: string | null) => {
  let res = null;
  if (url) {
    res = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.9 Safari/537.36",
      },
    });
  }
  return res ? res.data : null;
};
index["getHTTP"] = getHTTP;

/*
 * Split array into chunk(s).
 * @params {array} a - Array.
 * @params {number} n - Number of chunk(s).
 * @params {boolean} balanced - Balanced chunks.
 * @return {array} Returns csv document array.
 */
const chunkify = (a: [], n: number, balanced: boolean) => {
  if (n < 2) {
    return [a];
  }

  let len = a.length,
    out = [],
    i = 0,
    size;

  if (len % n === 0) {
    size = Math.floor(len / n);
    while (i < len) {
      out.push(a.slice(i, (i += size)));
    }
  } else if (balanced) {
    while (i < len) {
      size = Math.ceil((len - i) / n--);
      out.push(a.slice(i, (i += size)));
    }
  } else {
    n--;
    size = Math.floor(len / n);
    if (len % size === 0) {
      size--;
    }
    while (i < size * n) {
      out.push(a.slice(i, (i += size)));
    }
    out.push(a.slice(size * n));
  }
  return out;
};
index["chunkify"] = chunkify;

/*
 * Flatten an n-dimensional array.
 * @param {array} arr - Input array.
 * @param {array} res - Result array.
 * @returns {array} Returns flatten array.
 */
const flatten = (arr: [], res: [] = []) => {
  for (let i = 0, length = arr.length; i < length; i += 1) {
    const val = arr[i];
    if (Array.isArray(val)) {
      flatten(val, res);
    } else {
      res.push(val);
    }
  }
  return res;
};
index["flatten"] = flatten;

/*
 * Merge 2 array.
 * @param {array} a1 - First array.
 * @param {array} a2 - Second array.
 * @returns {array} Returns merged array.
 */
const mergeARR = (a1: [], a2: []) => {
  return a1.concat(a2);
};
index["mergeARR"] = mergeARR;

/*
 * Clean array remove empty elements from an array.
 * @param {array} arr - Array.
 * @returns {array} Returns clean array.
 */
const cleanArray = (array: []) => {
  const tmpArr: any[] = [];
  for (const i of array) {
    i && tmpArr.push(i); // copy each non-empty value to the 'temp' array
  }
  return tmpArr;
};
index["cleanArray"] = cleanArray;

/*
 * Merge 2 objects.
 * @param {object} o1 - First object.
 * @param {object} o2 - Second object.
 * @returns {object} Returns merged object.
 */
const mergeOBJ = (o1: any, o2: any) => {
  return Object.assign({}, o1, o2);
};
index["mergeOBJ"] = mergeOBJ;

/*
 * Verify if string is valid email.
 * @param {object} email - Email address string.
 * @returns {boolean} Returns state.
 */
const isEmail = (email: string) => {
  const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return reg.test(String(email).toLowerCase());
};
index["isEmail"] = isEmail;

/*
 * Set minor precision according to affix.
 * @params {number} qty - Amount/price.
 * @params {boolean} affix - Appending to db or not ?
 * @params {boolean} minorCx - minor currency.
 * @params {number}  precision - Currency precision.
 * @returns {number} Returns formatted value.
 */
const setMinorPrecision = (
  qty: number,
  affix = true,
  minorCx = 100000000,
  precision = 8,
) => {
  !qty && null;
  const t: number = affix ? Number(qty) * minorCx : Number(qty) / minorCx;
  const a: any = Number(t.toFixed(precision).replace(/\.?0+$/, ""));
  return affix ? parseInt(a) : a;
};
index["setMinorPrecision"] = setMinorPrecision;

/*
 * Get dates.
 */
const getDates = (startD: number, stopD: number) => {
  const dateArray = [];
  let currentDate: any = moment(startD);
  const stopDate: any = moment(stopD);
  while (currentDate <= stopDate) {
    dateArray.push(moment(currentDate).format("YYYY-MM-DD"));
    currentDate = moment(currentDate).add(1, "days");
  }
  return dateArray;
};
index["getDates"] = getDates;

/*
 * Get current server time.
 * @returns {number} Returns UTC server time.
 */
const getCurrentTime = () => {
  const today = new Date();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return time;
};
index["getCurrentTime"] = getCurrentTime;

/*
 * Get datetiem in epoch format.
 * @returns {number} Returns epoch datetime.
 */
const getEpochDatetime = (datetime: number | null = null, ms = false) => {
  const d = ms ? 1 : 1000;
  if (datetime) {
    return Math.floor(new Date(datetime).getTime() / d);
  }
  return Math.floor(new Date().getTime() / d);
};
index["getEpochDatetime"] = getEpochDatetime;

/*
 * Get current server epoch date.
 * @param {number} t - Time.
 * @returns {number} Returns UTC server epoch date.
 */
const epochDate = (t: number) => {
  return moment(t, "DD-MM-YYYY").unix();
  // return moment(t, 'DD-MM-YYYY').unix()*(1000 - 1);
};
index["epochDate"] = epochDate;

/*
 * Clean data to human format.
 * @param {number} t - Time.
 * @returns {number} Returns UTC server epoch date.
 */
const cleanDate = (t: number, format = "dddd, MMMM Do, YYYY h:mm:ss A") => {
  return moment.unix(t).format(format);
};
index["cleanDate"] = cleanDate;

/*
 * Get unique.
 * @param {array} elts - Data array.
 * @param {number} index - Index.
 * @param {object} self - Self.
 * @returns {array} Returns unique elt array.
 */
const unique = (elts: [], index: number, self: any) => {
  return self.indexOf(elts) === index;
};
index["unique"] = unique;

/*
 * Generate id.
 * @param {number} l - Length.
 * @returns {number} Returns id.
 */
const generateId = (l: number) => {
  l = typeof l !== "undefined" ? l : 6;
  let id = "";
  for (let i = 0; i < l; i += 1) {
    id += Math.floor(Math.random() * 9) + 1;
  }
  return id;
};
index["generateId"] = generateId;

/*
 * Generate password.
 * @param {number} l - Length.
 * @returns {string} Returns password.
 */
const generatePassword = (l: number) => {
  l = typeof l !== "undefined" ? l : 8;
  let code = "",
    chars =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".split("");
  const charsLen = chars.length;
  for (let i = 0; i < l; i += 1) {
    code += chars[~~(Math.random() * charsLen)];
  }
  return code;
};
index["generatePassword"] = generatePassword;

/*
 * Generate unique identifier v4.
 * @returns {string} Returns unique v4 identifier.
 */
const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
index["uuidv4"] = uuidv4;

/*
 * Generate unique mongo identifier.
 * @returns {string} Returns unique mongo identifier.
 */
const mongoObjectId = () => {
  const timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
  return (
    timestamp +
    "xxxxxxxxxxxxxxxx"
      .replace(/[x]/g, () => {
        return ((Math.random() * 16) | 0).toString(16);
      })
      .toLowerCase()
  );
};
index["mongoObjectId"] = mongoObjectId;

/*
 * Generate hash.
 * @param {number} l - Length.
 * @returns {string} Returns hash.
 */
const generateHash = (l: number) => {
  l = typeof l !== "undefined" ? l : 15;
  const hash = [],
    charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  while (--l) {
    hash.push(charSet.charAt(Math.floor(Math.random() * charSet.length)));
  }
  return hash.join("");
};
index["generateHash"] = generateHash;

/*
 * Sign JWT.
 * @param {object} payload - Data payload.
 * @returns {object} Returns JWT string.
 */
const signJWT = (payload: any) => {
  const app: any = config.app;
  const options: any = {
    issuer: app.name,
    subject: `info@${app.clientHost}`,
    audience: `https://www.${app.clientHost}`,
    expiresIn: app.jwt.expiry,
    algorithm: app.jwt.algo,
  };
  return jwt.sign(payload, privateKey, options);
};
index["signJWT"] = signJWT;

/*
 * Verify JWT.
 * @param {string} token - JWT sting.
 * @returns {boolean} Returns status.
 */
const verifyJWT = (token: string) => {
  try {
    const app: any = config.app;
    const options = {
      issuer: app.name,
      subject: `info@${app.clientHost}`,
      audience: `https://www.${app.clientHost}`,
      expiresIn: app.jwt.expiry,
      algorithm: app.jwt.algo,
    };
    return jwt.verify(token, publicKey, options);
  } catch (err) {
    return false;
  }
};
index["verifyJWT"] = verifyJWT;

/*
 * Decode JWT.
 * @param {string} token - JWT sting.
 * @returns {object} Returns decoded JWT.
 */
const decodeJWT = (token: string) => {
  return jwt.decode(token, { complete: true });
};
index["decodeJWT"] = decodeJWT;

/*
 * Capitalize string.
 * @param {string} s - Text.
 * @returns {string} Returns capitalized string.
 */
const capitalizeString = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};
index["capitalizeString"] = capitalizeString;

/*
 * Console server start msg.
 */
const startServerMsg = (configuration: any) => {
  const { env, id, name, service, version, host, port } = configuration.app;
  const [ip]: any[] = getPrivateIp("ipv4");
  console.log(
    ` Started ${name} ${service} microservice ${uuidv4()} in ` +
      `${(env || "").includes("dev") ? "development" : "production"} mode on ` +
      `${ip ? ip : "localhost"} port ${port}; Core v.${version} ` +
      `Press Ctrl-C to terminate apps.\n`,
  );
};
index["startServerMsg"] = startServerMsg;

/*
 * Display credit.
 */
const credit = () => {
  console.log(
    "\x1b[36m%s\x1b[0m",
    "\n" +
      ` ██╗     ███████╗ █████╗ ██████╗ ███████╗ █████╗ ███████╗██╗   ██╗ ██████╗ ███████╗███╗   ██╗ \n` +
      ` ██║     ██╔════╝██╔══██╗██╔══██╗██╔════╝██╔══██╗██╔════╝╚██╗ ██╔╝██╔════╝ ██╔════╝████╗  ██║ \n` +
      ` ██║     █████╗  ███████║██║  ██║█████╗  ███████║███████╗ ╚████╔╝ ██║  ███╗█████╗  ██╔██╗ ██║ \n` +
      ` ██║     ██╔══╝  ██╔══██║██║  ██║██╔══╝  ██╔══██║╚════██║  ╚██╔╝  ██║   ██║██╔══╝  ██║╚██╗██║ \n` +
      ` ███████╗███████╗██║  ██║██████╔╝███████╗██║  ██║███████║   ██║   ╚██████╔╝███████╗██║ ╚████║ \n` +
      ` ╚══════╝╚══════╝╚═╝  ╚═╝╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝   ╚═╝    ╚═════╝ ╚══════╝╚═╝  ╚═══╝ `,
  );
};
index["credit"] = credit;

/*
 * TODO : Add slack api channel support.
 */
const log = {
  info: (...args: any[]) => {
    if (config.app.env !== "production") {
      console.log(...args);
    }
  },
  warning: (...args: any[]) => {
    if (config.app.env !== "production") {
      console.warn(...args);
    }
  },
  success: (...args: any[]) => {
    if (config.app.env !== "production") {
      console.log(...args);
      // TODO : Register success console.
    }
  },
  error: (...args: any[]) => {
    if (config.app.env !== "production") {
      console.error(...args);
      // TODO : Register error console.
    }
  },
};
index["log"] = log;

index["compression"] = compression;
index["middlewares"] = middlewares;
index["SSEChannel"] = SSEChannel;
index["bodyParser"] = bodyParser;
index["chromium"] = chromium;
index["helmet"] = helmet;
index["moment"] = moment;
index["Router"] = Router;
index["axios"] = axios;
index["Stack"] = Stack;
index["stats"] = stats;
index["path"] = path;
index["cors"] = cors;
index["Koa"] = Koa;
index["fs"] = fs;
index["pg"] = pg;

export default index;
