"use strict";

// External libraries dependencies.
// @ts-ignore
import bodyParser from "koa-bodyparser";
import compression from "koa-compress";
import { chromium } from "playwright";
import { exec } from "child_process";
import Router from "koa-router";
import helmet from "koa-helmet";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import cors from "@koa/cors";
import moment from "moment";
import axios from "axios";
import path from "path";
import Koa from "koa";
import fs from "fs";
import os from "os";

// Internal libraries dependencies.
import config from "./../config";
import PostgresUtil from "./classes/PostgresUtil";

// Set private/public keys.
const privateKey = fs.readFileSync(
  path.join(__dirname, '/../../private/keys/shiphub.key'),
  'utf8',
);

const publicKey = fs.readFileSync(
  path.join(__dirname, '/../../private/keys/shiphub.key.pub'),
  'utf8',
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

const delay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));
index["delay"] = delay;

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
    timestamp: Date.now()
  };
};
index["getHealth"] = getHealth;

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
index['signJWT'] = signJWT;

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
index['verifyJWT'] = verifyJWT;

/*
 * Timeout.
 */
const timeout = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
index["timeout"] = timeout;

/**
 * Get the user IP throught the webkitRTCPeerConnection
 * @param onNewIP {Function} listener function to expose the IP locally
 * @return undefined
 */
const getPrivateIp = (type = "ipv4", device = false, alias = false) => {
  // Set network interface(s).
  const ifaces: any = os.networkInterfaces();

  const res: string[] = [];

  Object.keys(ifaces).map(ifname => {
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
          `${device ? `${ifname} :` : ""}` + `${iface.address}`
      );
      ++a;
    });
  });
  return res;
};
index["getPrivateIp"] = getPrivateIp;

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
        "Chrome/62.0.3202.9 Safari/537.36"
    },
    {
      os: "Linux",
      browser: "chrome",
      version: "61.0.3163.100",
      userAgent:
        "Mozilla/5.0 (X11; Linux x86_64) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) " +
        "Chrome/61.0.3163.100 Safari/537.36"
    },
    {
      os: "Machintosh",
      browser: "chrome",
      version: "62.0.3202.75",
      userAgent:
        "Mozilla/5.0 " +
        "(Macintosh; Intel Mac OS X 10_12_6) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) " +
        "Chrome/62.0.3202.75 Safari/537.36"
    }
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
        "Safari/537.36 OPR/48.0.2685.52"
    },
    {
      os: "Linux",
      browser: "opera",
      version: "61.0.3163.49",
      userAgent:
        "Mozilla/5.0 (X11; Linux x86_64) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) " +
        "Chrome/61.0.3163.49 " +
        "Safari/537.36 OPR/48.0.2685.7"
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
        "Safari/537.36 OPR/47.0.2631.55"
    }
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
        "Gecko/20100101 Firefox/56.0"
    },
    {
      os: "Linux",
      browser: "firefox",
      version: "31.0",
      userAgent:
        "Mozilla/5.0 " +
        "(X11; Linux i586; rv:31.0) " +
        "Gecko/20100101 Firefox/31.0"
    },
    {
      os: "Machintosh",
      browser: "firefox",
      version: "56.0",
      userAgent:
        "Mozilla/5.0 " +
        "(Macintosh; Intel Mac OS X 10.12; rv:56.0) " +
        "Gecko/20100101 Firefox/56.0"
    }
  ]
];
index["userAgent"] = userAgent;

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
 * Generate unique identifier v4.
 * @returns {string} Returns unique v4 identifier.
 */
const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
index["uuidv4"] = uuidv4;

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
 * Console server start msg.
 */
const startServerMsg = (configuration: any) => {
  const { env, id, name, service, version, host, port } = configuration.app;
  const [ip]: any[] = getPrivateIp("ipv4");
  console.log(
    ` Started ${name} ${service} microservice ${uuidv4()} in ` +
    `${(env || "").includes("dev") ? "development" : "production"} mode on ` +
    `${ip ? ip : "localhost"} port ${port}; Core v.${version} ` +
    `Press Ctrl-C to terminate apps.\n`
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
    " ███████╗██╗  ██╗██╗██████╗ ██╗  ██╗██╗   ██╗██████╗  \n" +
    " ██╔════╝██║  ██║██║██╔══██╗██║  ██║██║   ██║██╔══██╗ \n" +
    " ███████╗███████║██║██████╔╝███████║██║   ██║██████╔╝ \n" +
    " ╚════██║██╔══██║██║██╔═══╝ ██╔══██║██║   ██║██╔══██╗ \n" +
    " ███████║██║  ██║██║██║     ██║  ██║╚██████╔╝██████╔╝ \n" +
    " ╚══════╝╚═╝  ╚═╝╚═╝╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═════╝  "
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
  }
};
index["log"] = log;

index["compression"] = compression;
index["bodyParser"] = bodyParser;
index["chromium"] = chromium;
index["helmet"] = helmet;
index["moment"] = moment;
index["Router"] = Router;
index["bcrypt"] = bcrypt;
index["axios"] = axios;
index["path"] = path;
index["cors"] = cors;
index["Koa"] = Koa;
index["fs"] = fs;
index["pg"] = pg;

export default index;
