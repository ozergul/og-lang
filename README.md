# OgLang Programlama Dili

OgLang, basit ve öğrenmesi kolay bir programlama dilidir. Statik tip sistemine sahip ve modern programlama dillerinin temel özelliklerini içerir.

## Özellikler

- Statik tip sistemi
- Fonksiyon tanımlamaları
- Değişken tanımlamaları (değişebilir ve değişmez)
- Koşullu ifadeler (if-else)
- Döngüler (while)
- Temel veri tipleri (number, string)
- Fonksiyon çağrıları
- Aritmetik işlemler
- Karşılaştırma işlemleri

## Sözdizimi

### Fonksiyon Tanımlama

```oglang
fn fonksiyon_adi(parametre: tip) -> donus_tipi {
    // fonksiyon gövdesi
}
```

Örnek:
```oglang
fn factorial(n: number) -> number {
    if (n > 1) {
        n * factorial(n - 1)
    } else {
        1
    }
}
```

### Değişken Tanımlama

Değişmez (immutable) değişken:
```oglang
let x = 5
```

Değişebilir (mutable) değişken:
```oglang
mut y = 10
```

Tip belirterek:
```oglang
let x: number = 5
mut y: string = "merhaba"
```

### Koşullu İfadeler

```oglang
if (kosul) {
    // doğru ise çalışacak kod
} else {
    // yanlış ise çalışacak kod
}
```

### Döngüler

While döngüsü:
```oglang
while (kosul) {
    // döngü gövdesi
}
```

### Aritmetik İşlemler

- Toplama: `+`
- Çıkarma: `-`
- Çarpma: `*`
- Bölme: `/`

### Karşılaştırma İşlemleri

- Eşitlik: `==`
- Eşit değil: `!=`
- Büyüktür: `>`
- Küçüktür: `<`
- Büyük eşit: `>=`
- Küçük eşit: `<=`

## Örnek Program

```oglang
fn factorial(n: number) -> number {
    if (n > 1) {
        n * factorial(n - 1)
    } else {
        1
    }
}

fn main() -> number {
    let x = factorial(5)
    return x
}
```

## Dosya Uzantısı

OgLang programları `.oglang` uzantısı ile kaydedilir. Örneğin: `program.oglang`

## Çalıştırma

Programınızı çalıştırmak için:

```bash
pnpm run run-test-file
```

## Kısıtlamalar

- Şu an için sadece number ve string veri tipleri desteklenmektedir
- Fonksiyonlar asenkron olarak çalışır
- Her programda bir main fonksiyonu olmalıdır 