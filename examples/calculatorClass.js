
// Runtime library
const _runtime = {
    checkType: function(value, type) {
        switch(type) {
            case 'number':
                if (typeof value !== 'number') throw new TypeError(`Expected number, got ${typeof value}`);
                break;
            case 'string':
                if (typeof value !== 'string') throw new TypeError(`Expected string, got ${typeof value}`);
                break;
            case 'array':
                if (!Array.isArray(value)) throw new TypeError(`Expected array, got ${typeof value}`);
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
    return this.result;
  }

  subtract(x) {
    _runtime.checkType(x, "number");
    return this.result;
  }

  multiply(x) {
    _runtime.checkType(x, "number");
    return this.result;
  }

  divide(x) {
    _runtime.checkType(x, "number");
    return this.result;
  }

  static pi() {
    return _runtime.checkType(3.14159, "number");
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
  return _runtime.checkType(result, "number");
}


export { main };
