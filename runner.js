// runner.js
import fs from 'fs/promises';
import url from 'url';
import { TokenType , Lexer} from './lexer.js';
import { Parser } from './parser.js';
import { generateCode } from './codeGenerator.js';

async function runFile(filePath) {
  try {
    // 1. Kaynak kodu oku
    const sourceCode = await fs.readFile(filePath, 'utf8');
    console.log("Kaynak kod:");
    console.log(sourceCode);
    console.log("-----------------\n");

    // 2. Lexical analiz
    console.log("1. Lexical Analiz başlıyor...");
    const lexer = new Lexer(sourceCode);
    const tokens = [];
    let token;
    do {
      token = lexer.getNextToken();
      tokens.push(token);
    } while (token.type !== TokenType.EOF);

    console.log("Token'lar:");
    tokens.forEach(t => console.log(`${t.type}: ${t.value} (satır: ${t.line}, sütun: ${t.column})`));
    console.log();

    // 3. Parsing
    console.log("2. Parsing başlıyor...");
    const parser = new Parser(tokens);
    const ast = parser.parse();
    console.log("AST yapısı:");
    console.log(JSON.stringify(ast, null, 2));
    console.log();

    // 4. JavaScript kodu üret
    console.log("3. JavaScript kodu üretiliyor...");
    const jsCode = generateCode(ast);
    console.log("\nÜretilen JavaScript kodu:");
    console.log("------------------------");
    console.log(jsCode);
    console.log("------------------------\n");

    // 5. JavaScript dosyasını kaydet
    const jsFilePath = filePath.replace('.oglang', '.js');
    await fs.writeFile(jsFilePath, jsCode);
    console.log(`JavaScript kodu '${jsFilePath}' dosyasına kaydedildi.\n`);

    // 6. JavaScript kodunu çalıştır
    console.log("4. Kod çalıştırılıyor...");
    const module = await import(url.pathToFileURL(jsFilePath));
    if (typeof module.main === 'function') {
      const result = module.main();
      console.log("Sonuç:", result);
    }

  } catch (error) {
    console.error("Hata:", error);
    console.error("\nStack trace:", error);
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Lütfen bir .oglang dosyası belirtin.');
    process.exit(1);
  }

  try {
    await runFile(args[0]);
  } catch (error) {
    process.exit(1);
  }
}

main();
