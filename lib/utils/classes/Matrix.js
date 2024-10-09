'use strict';

class Matrix {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.data = [];
    // Initialize.
    this.init();
  }

  static fromArray(arr) {
    // TODO: Refactor for n dimensions.
    var m = new Matrix(arr.length, 1);
    for (var i = 0; i < arr.length; i += 1) {
      m.data[i][0] = arr[i];
    }
    return m;
  }

  static multiply(m, n) {
    if (n instanceof Matrix && m instanceof Matrix) {
      if (m.cols !== n.rows) {
        console.error('Non matching matrices dimensions.');
        return undefined;
      }
      // Set new matrix.
      var res = new Matrix(m.rows, n.cols);
      for (var i = 0; i < res.rows; i += 1) {
        for (var j = 0; j < res.cols; j += 1) {
          var sum = 0;
          for (var k = 0; k < m.cols; k += 1) {
            sum += m.data[i][k] * n.data[k][j];
          }
          res.data[i][j] = sum;
        }
      }
      return res;
    }
    return undefined;
  }

  static subtract(m, n) {
    if (m instanceof Matrix && n instanceof Matrix) {
      if (m.rows != n.rows || m.cols != n.cols) {
        console.error('Non matching matrices dimensions.');
        return undefined;
      }
      var res = new Matrix(m.rows, m.cols);
      // Element wise.
      for (var i = 0; i < res.rows; i += 1) {
        for (var j = 0; j < res.cols; j += 1) {
          res.data[i][j] = m.data[i][j] - n.data[i][j];
        }
      }
      return res;
    }
    return undefined;
  }

  static transpose(m) {
    if (m instanceof Matrix) {
      // Set new matrix.
      var res = new Matrix(m.cols, m.rows);
      for (var i = 0; i < m.rows; i += 1) {
        for (var j = 0; j < m.cols; j += 1) {
          res.data[j][i] = m.data[i][j];
        }
      }
      return res;
    }
    return undefined;
  }

  static map(m, fn) {
    if (m instanceof Matrix) {
      if (typeof fn == 'function') {
        var res = new Matrix(m.rows, m.cols);
        for (var i = 0; i < m.rows; i += 1) {
          for (var j = 0; j < m.cols; j += 1) {
            res.data[i][j] = fn(m.data[i][j], i, j);
          }
        }
        return res;
      } else {
        console.error('Non valid function.');
        return undefined;
      }
    }
    return undefined;
  }

  init() {
    for (var i = 0; i < this.rows; i += 1) {
      this.data[i] = [];
      for (var j = 0; j < this.cols; j += 1) {
        this.data[i][j] = 0;
      }
    }
    return this.data;
  }

  toArray() {
    let arr = [];
    for (var i = 0; i < this.rows; i += 1) {
      for (var j = 0; j < this.cols; j += 1) {
        arr.push(this.data[i][j]);
      }
    }
    return arr;
  }

  randomize() {
    for (var i = 0; i < this.rows; i += 1) {
      for (var j = 0; j < this.cols; j += 1) {
        this.data[i][j] = Math.random() * 2 - 1;
      }
    }
  }

  add(n) {
    if (n instanceof Matrix) {
      // Element wise.
      for (var i = 0; i < this.rows; i += 1) {
        for (var j = 0; j < this.cols; j += 1) {
          this.data[i][j] += n.data[i][j];
        }
      }
    } else {
      // Scalar.
      for (var i = 0; i < this.rows; i += 1) {
        for (var j = 0; j < this.cols; j += 1) {
          this.data[i][j] += n;
        }
      }
    }
  }

  multiply(n) {
    if (n instanceof Matrix) {
      if (this.rows !== n.rows || this.cols !== n.cols) {
        console.log('Columns and Rows of A must match Columns and Rows of B.');
        return;
      }

      // hadamard product
      return this.map((e, i, j) => e * n.data[i][j]);
    } else {
      // Scalar product
      return this.map((e) => e * n);
    }
  }

  print() {
    console.table(this.data);
  }

  map(fn) {
    if (typeof fn == 'function') {
      for (var i = 0; i < this.rows; i += 1) {
        for (var j = 0; j < this.cols; j += 1) {
          this.data[i][j] = fn(this.data[i][j], i, j);
        }
      }
      return this;
    } else {
      console.error('Non valid function.');
      return undefined;
    }
  }
}

export default Matrix;
