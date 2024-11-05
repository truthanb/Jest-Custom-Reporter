function sum(a, b) {
    let c = a + b;
    if (c < 0)
        return 0;
    return c;
  }
module.exports = sum;