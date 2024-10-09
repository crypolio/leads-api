'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
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
var verifyArray = function (data) {
  if (typeof data === 'object') {
    if (data.length) {
      return data;
    } else {
      return 'Parameter is an object, not an array.';
    }
  } else {
    return 'Parameter is not an array.';
  }
};
/*
 * Basic arithmetic functions.
 * @param {number} n - Number.
 * @returns {array} - Divisibility integer.
 */
var divisibility = function (n) {
  var elts = [];
  for (var i = 1; i <= n; i++) {
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
var jumpTbl = function (elts, j) {
  if (elts === void 0) {
    elts = [];
  }
  var e = [];
  for (var i = j; i < elts.length; i += j) {
    e.push(elts[i]);
  }
  return e;
};
/*
 * Sum.
 * @param {array} elts - Total numbers.
 * @returns {number} - Summation.
 */
var sum = function (elts) {
  if (elts === void 0) {
    elts = [];
  }
  return elts.reduce(function (acc, val) {
    return acc + val;
  });
};
/*
 * Mean.
 * @param {array} elts - Total numbers.
 * @returns {number} - Mean/everage
 */
var mean = function (elts) {
  if (elts === void 0) {
    elts = [];
  }
  return sum(elts) / elts.length;
};
/*
 * Variance.
 */
var variance = function (elts) {
  if (elts === void 0) {
    elts = [];
  }
  var u = mean(elts);
  return mean(
    elts.map(function (val) {
      return Math.pow(val - u, 2);
    }),
  );
};
/*
 * Population standard deviation.
 * @returns {array} - elts Elements
 */
var stdP = function (elts) {
  if (elts === void 0) {
    elts = [];
  }
  return Math.sqrt(variance(elts));
};
/*
 * Sample standard deviation.
 * @returns {number} - Covariance.
 */
var stdS = function (elts) {
  if (elts === void 0) {
    elts = [];
  }
  var u = mean(elts);
  var tbl = elts.map(function (val) {
    return Math.pow(val - u, 2);
  });
  return Math.sqrt(sum(tbl) / (elts.length - 1));
};
/*
 * Coefficient of variation (shows the extent of variability in relation to the mean).
 * @params {number} - Standard deviation.
 * @params {number} - Mean.
 * @returns {number} - Coefficient of variation.
 */
var cov = function (std, m) {
  return (std / m) * 100;
};
/*
 * Covarianve.
 * @param {array} elts - Total numbers.
 * @returns {number} - Covariance.
 */
var covariance = function (elts) {
  if (elts === void 0) {
    elts = [[], []];
  }
  var u0 = mean(elts[0]),
    u1 = mean(elts[1]);
  var tbl = elts[0].map(function (val, idx) {
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
var zScore = function (elts, m, std) {
  if (elts === void 0) {
    elts = [];
  }
  return elts.map(function (val) {
    return (val - m) / std;
  });
};
/*
 * Least square.
 * @param {array} xElts - x points.
 * @param {array} yElts - y points.
 * @returns {object} - Returns line parameters.
 */
var leastSquare = function (xElts, yElts) {
  var lr = {};
  var dXY = [],
    dX2 = [];
  var mX = mean(xElts),
    mY = mean(yElts);
  var dX = xElts.map(function (x) {
    return x - mX;
  });
  var dY = yElts.map(function (y) {
    return y - mY;
  });
  dX.map(function (s, idx) {
    dXY.push(dX[idx] * dY[idx]);
    dX2.push(Math.pow(s, 2));
  });
  var m = sum(dXY) / sum(dX2);
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
var ccP = function (elts) {
  if (elts === void 0) {
    elts = [];
  }
};
/*
 * Correlation coefficient sample.
 */
var ccS = function (elts) {
  if (elts === void 0) {
    elts = [];
  }
};
/*
 * Intersection of two straight lines
 * @param {number} m0 - Slope y0.
 * @param {number} b0 - B0 y-intercept.
 * @param {number} m1 - Slope y2.
 * @param {number} b1 - B1 y-intercept.
 */
var lineIntersect = function (m0, b0, m1, b1) {
  if (m0 === m1) {
    return false;
  } else {
    var x = (b1 - b0) / (m0 - m1);
    var y = m0 * x + b0;
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
var multiplyBy2js = function (value, run) {
  console.time('multiplyBy2js');
  var v = 0;
  for (var i = run; i >= 0; i -= 1) {
    v += value * 2;
  }
  return v;
  console.timeEnd('multiplyBy2js');
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
var pearsonCorrelation = function (x, y) {
  var sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0,
    sumY2 = 0;
  var minLength = (x.length = y.length = Math.min(x.length, y.length)),
    reduce = function (xi, idx) {
      var yi = y[idx];
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
exports.default = {
  pearsonCorrelation: pearsonCorrelation,
  divisibility: divisibility,
  jumpTbl: jumpTbl,
  sum: sum,
  mean: mean,
  variance: variance,
  stdP: stdP,
  stdS: stdS,
  cov: cov,
  covariance: covariance,
  zScore: zScore,
  leastSquare: leastSquare,
  // normalDataDistribution,
  ccP: ccP,
  ccS: ccS,
  lineIntersect: lineIntersect,
  // multiplyBy2c,
  multiplyBy2js: multiplyBy2js,
};
