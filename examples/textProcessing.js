
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

class TextProcessor {
  constructor() {
  }

  countWords(text) {
    _runtime.checkType(text, "string");
    let count = 1;
    let i = 0;
    while ((i < text.length)) {
  if ((text[i] == " ")) {
  count = (count + 1);
}
  i = (i + 1);
}
    return count;
  }

  countVowels(text) {
    _runtime.checkType(text, "string");
    let count = 0;
    let i = 0;
    while ((i < text.length)) {
  let char = text[i];
  if ((((((char == "a") || (char == "e")) || (char == "i")) || (char == "o")) || (char == "u"))) {
  count = (count + 1);
}
  i = (i + 1);
}
    return count;
  }

  reverse(text) {
    _runtime.checkType(text, "string");
    let result = "";
    let i = text.length;
    while ((i > 0)) {
  i = (i - 1);
  result = (result + text[i]);
}
    return result;
  }

}

function main() {
  let processor = new TextProcessor();
  let text = "hello world";
  let wordCount = processor.countWords(text);
  let vowelCount = processor.countVowels(text);
  let reversed = processor.reverse(text);
  return wordCount;
}


export { main };
