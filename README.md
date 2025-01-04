# Özer Programlama Dili

Özer, basit ve öğrenmesi kolay bir programlama dilidir. Statik tip sistemine sahip ve modern programlama dillerinin temel özelliklerini içerir.

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

```ozer
fn fonksiyon_adi(parametre: tip) -> donus_tipi {
    // fonksiyon gövdesi
}
```

Örnek:
```ozer
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
```ozer
let x = 5
```

Değişebilir (mutable) değişken:
```ozer
mut y = 10
```

Tip belirterek:
```ozer
let x: number = 5
mut y: string = "merhaba"
```

### Koşullu İfadeler

```ozer
if (kosul) {
    // doğru ise çalışacak kod
} else {
    // yanlış ise çalışacak kod
}
```

### Döngüler

While döngüsü:
```ozer
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

```ozer
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

## Çalıştırma

Programınızı çalıştırmak için:

```bash
pnpm run run-test-file
```

## Kısıtlamalar

- Şu an için sadece number ve string veri tipleri desteklenmektedir
- Fonksiyonlar asenkron olarak çalışır
- Her programda bir main fonksiyonu olmalıdır 