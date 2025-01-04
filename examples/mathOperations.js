
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

class MathUtils {
  constructor() {
  }

  isPrime(n) {
    _runtime.checkType(n, "number");
    if ((n <= 1)) {
  return 0;
}
    let i = 2;
    while (((i * i) <= n)) {
  if (((n - ((n / i) * i)) == 0)) {
  return 0;
}
  i = (i + 1);
}
    return 1;
  }

  fibonacci(n) {
    _runtime.checkType(n, "number");
    if ((n <= 1)) {
  return n;
}
    let prev = 0;
    let current = 1;
    let i = 2;
    while ((i <= n)) {
  let next = (current + prev);
  prev = current;
  current = next;
  i = (i + 1);
}
    return current;
  }

  gcd(a, b) {
    _runtime.checkType(a, "number");
    _runtime.checkType(b, "number");
    while ((b != 0)) {
  let temp = b;
  b = (a - ((a / b) * b));
  a = temp;
}
    return a;
  }

}

function main() {
  let math = new MathUtils();
  let prime = math.isPrime(17);
  let fib6 = math.fibonacci(6);
  let gcd_result = math.gcd(48, 18);
  return fib6;
}


export { main };
