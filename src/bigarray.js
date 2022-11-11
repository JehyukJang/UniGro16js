const SUBARRAY_SIZE = 0x40000;

const BigArrayHandler = {
  get: function(obj, prop) {
    if (!isNaN(prop)) {
      return obj.getElement(prop);
    } else return obj[prop];
  },
  set: function(obj, prop, value) {
    if (!isNaN(prop)) {
      return obj.setElement(prop, value);
    } else {
      obj[prop] = value;
      return true;
    }
  },
};

class _BigArray {
  constructor(initSize) {
    this.length = initSize || 0;
    this.arr = new Array(SUBARRAY_SIZE);

    for (let i=0; i<initSize; i+=SUBARRAY_SIZE) {
      this.arr[i/SUBARRAY_SIZE] = new Array(
          Math.min(SUBARRAY_SIZE, initSize - i),
      );
    }
    return this;
  }
  push() {
    for (let i=0; i<arguments.length; i++) {
      this.setElement(this.length, arguments[i]);
    }
  }

  slice(f, t) {
    const arr = new Array(t-f);
    for (let i=f; i< t; i++) arr[i-f] = this.getElement(i);
    return arr;
  }
  getElement(idx) {
    idx = parseInt(idx);
    const idx1 = Math.floor(idx / SUBARRAY_SIZE);
    const idx2 = idx % SUBARRAY_SIZE;
    return this.arr[idx1] ? this.arr[idx1][idx2] : undefined;
  }
  setElement(idx, value) {
    idx = parseInt(idx);
    const idx1 = Math.floor(idx / SUBARRAY_SIZE);
    if (!this.arr[idx1]) {
      this.arr[idx1] = new Array(SUBARRAY_SIZE);
    }
    const idx2 = idx % SUBARRAY_SIZE;
    this.arr[idx1][idx2] = value;
    if (idx >= this.length) this.length = idx+1;
    return true;
  }
  getKeys() {
    const newA = new BigArray();
    for (let i=0; i<this.arr.length; i++) {
      if (this.arr[i]) {
        for (let j=0; j<this.arr[i].length; j++) {
          if (typeof this.arr[i][j] !== 'undefined') {
            newA.push(i*SUBARRAY_SIZE+j);
          }
        }
      }
    }
    return newA;
  }
}

class BigArray {
  constructor( initSize ) {
    const obj = new _BigArray(initSize);
    const extObj = new Proxy(obj, BigArrayHandler);
    return extObj;
  }
}

export default BigArray;
