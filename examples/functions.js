
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

function add(x, y) {
  _runtime.checkType(x, "number");
  _runtime.checkType(y, "number");
  return (x + y);
}

function multiply(x, y) {
  _runtime.checkType(x, "number");
  _runtime.checkType(y, "number");
  return (x * y);
}

function square(x) {
  _runtime.checkType(x, "number");
  return multiply(x, x);
}

function factorial(n) {
  _runtime.checkType(n, "number");
  if ((n <= 1)) {
  return 1;
}
  return (n * factorial((n - 1)));
}

function greet(name) {
  _runtime.checkType(name, "string");
  return (("Merhaba, " + name) + "!");
}

function repeatString(str, times) {
  _runtime.checkType(str, "string");
  _runtime.checkType(times, "number");
  let result = "";
  let i = 0;
  while ((i < times)) {
  result = (result + str);
  i = (i + 1);
}
  return result;
}

function formatNumber(num, prefix) {
  _runtime.checkType(num, "number");
  _runtime.checkType(prefix, "string");
  return ((prefix + " ") + num);
}

function main() {
  let sum = add(5, 3);
  let product = multiply(4, 6);
  let squared = square(5);
  let fact5 = factorial(5);
  let greeting = greet("Özer");
  let repeated = repeatString("Ha", 3);
  let formatted = formatNumber(42, "Sayı:");
  return fact5;
}


export { main };
