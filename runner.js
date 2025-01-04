// runner.js
import fs from "fs";
import { Lexer } from "./lexer.js";
import { Parser } from "./parser.js";
import { CodeGenerator } from "./codeGenerator.js";

async function runFile(filename) {
  try {
    // Dosyayı oku
    const sourceCode = fs.readFileSync(filename, "utf8");
    console.log("Kaynak kod:");
    console.log(sourceCode);
    console.log("-----------------");

    // 1. Lexical Analiz
    console.log("\n1. Lexical Analiz başlıyor...");
    const lexer = new Lexer(sourceCode);
    const tokens = lexer.tokenize();
    console.log("Token'lar:");
    tokens.forEach((token) => {
      console.log(
        `${token.type}: ${token.value} (satır: ${token.line}, sütun: ${token.column})`
      );
    });

    // 2. Parsing
    console.log("\n2. Parsing başlıyor...");
    const parser = new Parser(tokens);
    const ast = parser.parse();
    console.log("\nAST yapısı:");
    console.log(JSON.stringify(ast, null, 2));

    // 3. Code Generation
    console.log("\n3. JavaScript kodu üretiliyor...");
    const generator = new CodeGenerator(ast);
    const jsCode = generator.generateCode();

    // JavaScript kodunu göster ve kaydet
    console.log("\nÜretilen JavaScript kodu:");
    console.log("------------------------");
    console.log(jsCode);
    console.log("------------------------");

    const outputFile = filename.replace(/\.[^.]+$/, ".js");
    fs.writeFileSync(outputFile, jsCode);
    console.log(`\nJavaScript kodu '${outputFile}' dosyasına kaydedildi.`);

    // 4. Kodu çalıştır
    console.log("\n4. Kod çalıştırılıyor...");

    // Global context'te eval
    const context = {};
    const evalInContext = `
            (async function() {
                try {
                    ${jsCode}
                } catch (error) {
                    console.error('Çalışma zamanı hatası:', error);
                }
            })();
        `;

    const result = await eval(evalInContext);
    console.log("Sonuç:", result);
  } catch (error) {
    console.error("\nHata:", error);
    if (error.stack) {
      console.error("\nStack trace:", error.stack);
    }
  }
}

// Ana fonksiyon
async function main() {
  const sourceFile = process.argv[2] || "test.oglang";
  if (!sourceFile) {
    console.error("Lütfen bir dosya adı belirtin!");
    console.log("Kullanım: node runner.js <dosya_adı>");
    process.exit(1);
  }

  await runFile(sourceFile);
}

// Programı çalıştır
main().catch((error) => {
  console.error("Program hatası:", error);
  process.exit(1);
});
