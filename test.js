
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

async function factorial(n) {
  _runtime.checkType(n, "number");
  if ((n > 1)) {
    return (n * await factorial((n - 1)))
  } else {
    return 1
  }
}
async function fibonacci(n) {
  _runtime.checkType(n, "number");
  if ((n <= 1)) {
    return n
  } else {
    return (await fibonacci((n - 1)) + await fibonacci((n - 2)))
  }
}
async function power(base, exp) {
  _runtime.checkType(base, "number");
  _runtime.checkType(exp, "number");
  if ((exp == 0)) {
    return 1
  } else {
    return (base * await power(base, (exp - 1)))
  }
}
async function greet(name) {
  _runtime.checkType(name, "string");
  return (("Merhaba, " + name) + "!")
}
async function calculate(a, b, op) {
  _runtime.checkType(a, "number");
  _runtime.checkType(b, "number");
  _runtime.checkType(op, "string");
  if ((op == "+")) {
    return (a + b)
  } else {
    if ((op == "-")) {
      return (a - b)
    } else {
      if ((op == "*")) {
        return (a * b)
      } else {
        if ((op == "/")) {
          return (a / b)
        } else {
          return 0
        }
      }
    }
  }
}
async function main() {
  const name = "OgLang"
  const greeting = await greet(name)
  const fact5 = await factorial(5)
  const fib6 = await fibonacci(6)
  const pow2_3 = await power(2, 3)
  const sum = await calculate(10, 5, "+")
  const diff = await calculate(10, 5, "-")
  const prod = await calculate(10, 5, "*")
  const quot = await calculate(10, 5, "/")
  const result = ((((((fact5 + fib6) + pow2_3) + sum) + diff) + prod) + quot)
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
