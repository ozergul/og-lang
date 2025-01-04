
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

  async add(x) {
    _runtime.checkType(x, "number");
    this.result = (this.result + x)
    return this.result
  }
  async subtract(x) {
    _runtime.checkType(x, "number");
    this.result = (this.result - x)
    return this.result
  }
  async multiply(x) {
    _runtime.checkType(x, "number");
    this.result = (this.result * x)
    return this.result
  }
  async divide(x) {
    _runtime.checkType(x, "number");
    this.result = (this.result / x)
    return this.result
  }
  static async pi() {
    return 3.14159
  }
}
async function main() {
  let calc = new Calculator()
  let result = await calc.add(10)
  result = await calc.multiply(2)
  result = await calc.subtract(5)
  result = await calc.divide(3)
  let pi = await Calculator.pi()
  return result
}

// Programı çalıştır
(async () => {
    try {
        const result = await main();
        console.log('Sonuç:', result);
        return result;
    } catch (error) {
        console.error('Hata:', error);
        throw error;
    }
})();
