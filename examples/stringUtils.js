
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

class StringUtils {
  constructor() {
  }

  concat(str1, str2) {
    _runtime.checkType(str1, "string");
    _runtime.checkType(str2, "string");
    return _runtime.checkType((str1 + str2), "string");
  }

  repeat(str, count) {
    _runtime.checkType(str, "string");
    _runtime.checkType(count, "number");
    let result = "";
    let i = 0;
    while ((i < count)) {
  result = (result + str);
  i = (i + 1);
}
    return _runtime.checkType(result, "string");
  }

  countDigits(str) {
    _runtime.checkType(str, "string");
    let count = 0;
    let i = 0;
    while ((i < str.length)) {
  let char = str[i];
  if (((char >= "0") && (char <= "9"))) {
  count = (count + 1);
}
  i = (i + 1);
}
    return _runtime.checkType(count, "number");
  }

}

function main() {
  let utils = new StringUtils();
  let combined = utils.concat("Hello, ", "World!");
  let repeated = utils.repeat("Ha", 3);
  let digitCount = utils.countDigits("abc123def456");
  return _runtime.checkType(digitCount, "number");
}


export { main };
