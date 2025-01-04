
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
        }
        return value;
    }
};

class Fibonacci {
  constructor() {
  }

  recursive(n) {
    _runtime.checkType(n, "number");
    if ((n <= 1)) {
  return n;
}
    return (this.recursive((n - 1)) + this.recursive((n - 2)));
  }

  iterative(n) {
    _runtime.checkType(n, "number");
    if ((n <= 1)) {
  return n;
}
    let prev = 0;
    let current = 1;
    let i = 2;
    while ((i <= n)) {
  let next = (prev + current);
  prev = current;
  current = next;
  i = (i + 1);
}
    return current;
  }

}

function main() {
  let fib = new Fibonacci();
  let i = 0;
  while ((i < 10)) {
  let recursive = fib.recursive(i);
  let iterative = fib.iterative(i);
  i = (i + 1);
}
  return fib.iterative(10);
}


export { main };
