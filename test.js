
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
async function main() {
  const x = await factorial(5)
  return x
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
