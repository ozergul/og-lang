
// Runtime kütüphanesi
const _runtime = {
    checkType: function(value, type) {
        switch(type) {
            case 'number':
                if (typeof value !== 'number') throw new TypeError(`Expected number, got ${typeof value}`);
                break;
            case 'string':
                if (typeof value !== 'string') throw new TypeError(`Expected string, got ${typeof value}`);
                break;
        }
        return value;
    }
};

class Calculator {
  constructor() {
    this.result = 0;
  }

  add(x) {
    _runtime.checkType(x, "number");
    this.result = (this.result + x);
    return this.result;
  }

  subtract(x) {
    _runtime.checkType(x, "number");
    this.result = (this.result - x);
    return this.result;
  }

  multiply(x) {
    _runtime.checkType(x, "number");
    this.result = (this.result * x);
    return this.result;
  }

  divide(x) {
    _runtime.checkType(x, "number");
    this.result = (this.result / x);
    return this.result;
  }

  static pi() {
    return 3.14159;
  }

}


function main() {
  let calc = new Calculator();
  let result = calc.add(10);
  result = calc.add(5);
  result = calc.multiply(2);
  result = calc.divide(3);
  result = calc.subtract(4);
  let pi = Calculator.pi();
  return result;
}


export { main };
