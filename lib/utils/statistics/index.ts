"use strict";

// import addon from './build/Release/module';

/*
const value = 8;    

const multiplyBy2 = function(v){
	return v*2;
};

const run = 100;

console.time('multiplyBy2');
for(var i = run; i >= 0; i -= 1){
	// Whatever is timed goes between the two "console.time"
	const d0 = multiplyBy2(value);
	// console.log(`${value} times 2 equals`, d0);
}
console.timeEnd('multiplyBy2');


console.time('multiplyBy2C');
for(var i = run; i >= 0; i -= 1){
	// Whatever is timed goes between the two "console.time"
	const d1 = addon.my_function(value);
	// console.log(`${value} times 2 equals`, d1);
}
console.timeEnd('multiplyBy2C');
*/

// Data integrity. ----------------------------------------------------------------------
const verifyArray = function (data: any) {
  if (typeof data === "object") {
    if (data.length) {
      return data;
    } else {
      return "Parameter is an object, not an array.";
    }
  } else {
    return "Parameter is not an array.";
  }
};

/*
 * Basic arithmetic functions.
 * @param {number} n - Number.
 * @returns {array} - Divisibility integer.
 */
const divisibility = function (n: number) {
  const elts: any[] = [];
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) {
      elts.push(i);
    }
  }
  return elts;
};

/*
 * Basic arithmetic functions.
 * @param {array} elts - Data array
 * @param {jump} j - Jump
 * @returns {array} - Jumped array.
 */
const jumpTbl = (elts: [] = [], j: number) => {
  const e: [] = [];
  for (let i = j; i < elts.length; i += j) {
    e.push(elts[i]);
  }
  return e;
};

/*
 * Sum.
 * @param {array} elts - Total numbers.
 * @returns {number} - Summation.
 */
const sum = (elts: any[] = []) =>
  elts.reduce((acc: number, val: number) => acc + val);

/*
 * Mean.
 * @param {array} elts - Total numbers.
 * @returns {number} - Mean/everage
 */
const mean = (elts: any[] = []) => sum(elts) / elts.length;

/*
 * Variance.
 */
const variance = (elts: [] = []) => {
  const u: number = mean(elts);
  return mean(elts.map((val: number) => Math.pow(val - u, 2)));
};

/*
 * Population standard deviation.
 * @returns {array} - elts Elements
 */
const stdP = (elts: [] = []) => Math.sqrt(variance(elts));

/*
 * Sample standard deviation.
 * @returns {number} - Covariance.
 */
const stdS = function (elts: any[] = []) {
  const u: number = mean(elts);
  const tbl: any[] = elts.map((val: number) => Math.pow(val - u, 2));
  return Math.sqrt(sum(tbl) / (elts.length - 1));
};

/*
 * Coefficient of variation (shows the extent of variability in relation to the mean).
 * @params {number} - Standard deviation.
 * @params {number} - Mean.
 * @returns {number} - Coefficient of variation.
 */
const cov = (std: number, m: number) => {
  return (std / m) * 100;
};

/*
 * Covarianve.
 * @param {array} elts - Total numbers.
 * @returns {number} - Covariance.
 */
const covariance = function (elts: any[] = [[], []]) {
  const u0: number = mean(elts[0]),
    u1: number = mean(elts[1]);
  const tbl: any[] = elts[0].map((val: number, idx: number) => {
    return (val - u0) * (elts[1][idx] - u1);
  });
  return sum(tbl) / (tbl.length - 1);
};

/*
 * Z-score
 * @param {array} elts - Total data point.
 * @param {number} m - Mean.
 * @param {array} std - Standar deviation.
 * @returns {number} - z scores.
 */
const zScore = (elts: [] = [], m: number, std: number) => {
  return elts.map((val) => (val - m) / std);
};

/*
 * Least square.
 * @param {array} xElts - x points.
 * @param {array} yElts - y points.
 * @returns {object} - Returns line parameters.
 */
const leastSquare = function (xElts: [], yElts: []) {
  const lr: any = {};
  const dXY: any[] = [],
    dX2: any[] = [];
  const mX: number = mean(xElts),
    mY: number = mean(yElts);

  const dX: number[] = xElts.map((x: number) => x - mX);
  const dY: number[] = yElts.map((y: number) => y - mY);

  dX.map((s: number, idx: number) => {
    dXY.push(dX[idx] * dY[idx]);
    dX2.push(Math.pow(s, 2));
  });

  const m: number = sum(dXY) / sum(dX2);

  return {
    // 'x' : xElts,
    // 'y' : yElts,
    // 'mX' : mX,
    // 'mY' : mY,
    // 'dX' : dX,
    // 'dY' : dY,
    // 'dXY' : dXY,
    // 'dX2' : dX2,
    m: m,
    b: mY - m * mX,
  };
};

/*
 * Normal data distribution.
 * @param {array} elts - Total data point.
 * @param {number} m - Mean.
 * @param {array} std - Standar deviation.
 * @returns {number} - z scores.
 */
// const normalDataDistribution = function(elts: [] = [], m: number){
// 	return elts.map((val: number) => {
// 		return (((val - m)/std));
// 	})
// };

/*
 * Correlation coefficient population.
 */
const ccP = function (elts: [] = []) {};

/*
 * Correlation coefficient sample.
 */
const ccS = function (elts: [] = []) {};

/*
 * Intersection of two straight lines
 * @param {number} m0 - Slope y0.
 * @param {number} b0 - B0 y-intercept.
 * @param {number} m1 - Slope y2.
 * @param {number} b1 - B1 y-intercept.
 */
const lineIntersect = function (
  m0: number,
  b0: number,
  m1: number,
  b1: number,
) {
  if (m0 === m1) {
    return false;
  } else {
    const x = (b1 - b0) / (m0 - m1);
    const y = m0 * x + b0;
    return { x: x, y: y };
  }
};

/*
* Multiply by 2 c language.
* @param {array} elts - Total numbers.
* @param {number} run - Number of run.
* @returns {number} - Sum of multiplied values.
const multiplyBy2c = function(elts, run){
	console.time('multiplyBy2c');
	var v = 0;
	for(var i = run; i >= 0; i -= 1){
		v += addon.my_function(elts);
	}
	return v;
	console.timeEnd('multiplyBy2c');
};
*/

/*
 * Multiply by 2 javascript language.
 * @param {array} elts - Total numbers.
 * @param {number} run - Number of run.
 * @returns {number} - Sum of multiplied values.
 */
const multiplyBy2js = function (value: number, run: number) {
  console.time("multiplyBy2js");
  let v = 0;
  for (let i = run; i >= 0; i -= 1) {
    v += value * 2;
  }
  return v;
  console.timeEnd("multiplyBy2js");
};

/**
 *  @fileoverview Pearson correlation score algorithm.
 *  @author matt.west@kojilabs.com (Matt West)
 *  @license Copyright 2013 Matt West.
 *  Licensed under MIT (http://opensource.org/licenses/MIT).
 */

/**
 *  Calculate the person correlation score between two items in a dataset.
 *
 *  @param  {object}  prefs The dataset containing data about both items that
 *                    are being compared.
 *  @param  {string}  p1 Item one for comparison.
 *  @param  {string}  p2 Item two for comparison.
 *  @return {float}  The pearson correlation score.
 */
const pearsonCorrelation = (x: any, y: any) => {
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0,
    sumY2 = 0;

  const minLength = (x.length = y.length = Math.min(x.length, y.length)),
    reduce = (xi: number, idx: number) => {
      const yi = y[idx];
      sumX += xi;
      sumY += yi;
      sumXY += xi * yi;
      sumX2 += xi * xi;
      sumY2 += yi * yi;
    };
  x.forEach(reduce);
  return (
    (minLength * sumXY - sumX * sumY) /
    Math.sqrt(
      (minLength * sumX2 - sumX * sumX) * (minLength * sumY2 - sumY * sumY),
    )
  );
};

export default {
  pearsonCorrelation,
  divisibility,
  jumpTbl,
  sum,
  mean,
  variance,
  stdP,
  stdS,
  cov,
  covariance,
  zScore,
  leastSquare,
  // normalDataDistribution,
  ccP,
  ccS,
  lineIntersect,
  // multiplyBy2c,
  multiplyBy2js,
};
