
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

class ArrayUtils {
  constructor() {
  }

  sum(arr) {
    _runtime.checkType(arr, "string");
    let total = 0;
    let i = 0;
    while ((i < arr.length)) {
  let char = arr[i];
  if (((char >= "0") && (char <= "9"))) {
  total = (total + 1);
}
  i = (i + 1);
}
    return total;
  }

  findMax(str) {
    _runtime.checkType(str, "string");
    let max = 0;
    let current = 0;
    let i = 0;
    while ((i < str.length)) {
  let char = str[i];
  if (((char >= "0") && (char <= "9"))) {
  if (((char - "0") > max)) {
  max = (char - "0");
}
}
  i = (i + 1);
}
    return max;
  }

  countOccurrences(str, target) {
    _runtime.checkType(str, "string");
    _runtime.checkType(target, "string");
    let count = 0;
    let i = 0;
    while ((i < str.length)) {
  if ((str[i] == target)) {
  count = (count + 1);
}
  i = (i + 1);
}
    return count;
  }

}

function main() {
  let utils = new ArrayUtils();
  let numbers = "12345";
  let text = "hello world";
  let sum = utils.sum(numbers);
  let max = utils.findMax(numbers);
  let occurrences = utils.countOccurrences(text, "l");
  return max;
}


export { main };
