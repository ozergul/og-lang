// runner.js
import fs from 'fs/promises';
import url from 'url';
import { TokenType , Lexer} from './lexer.js';
import { Parser } from './parser.js';
import { generateCode } from './codeGenerator.js';

async function runFile(filePath) {
  try {
    // 1. Read source code
    const sourceCode = await fs.readFile(filePath, 'utf8');
    console.log("Source code:");
    console.log(sourceCode);
    console.log("-----------------\n");

    // 2. Lexical analysis
    console.log("1. Starting Lexical Analysis...");
    const lexer = new Lexer(sourceCode);
    const tokens = [];
    let token;
    do {
      token = lexer.getNextToken();
      tokens.push(token);
    } while (token.type !== TokenType.EOF);

    console.log("Tokens:");
    tokens.forEach(t => console.log(`${t.type}: ${t.value} (line: ${t.line}, column: ${t.column})`));
    console.log();

    // 3. Parsing
    console.log("2. Starting Parsing...");
    const parser = new Parser(tokens);
    const ast = parser.parse();
    console.log("AST structure:");
    console.log(JSON.stringify(ast, null, 2));
    console.log();

    // 4. Generate JavaScript code
    console.log("3. Generating JavaScript code...");
    const jsCode = generateCode(ast);
    console.log("\nGenerated JavaScript code:");
    console.log("------------------------");
    console.log(jsCode);
    console.log("------------------------\n");

    // 5. Save JavaScript file
    const jsFilePath = filePath.replace('.oglang', '.js');
    await fs.writeFile(jsFilePath, jsCode);
    console.log(`JavaScript code saved to '${jsFilePath}'\n`);

    // 6. Run JavaScript code
    console.log("4. Running code...");
    const module = await import(url.pathToFileURL(jsFilePath));
    if (typeof module.main === 'function') {
      const result = module.main();
      console.log("Result:", result);
    }

  } catch (error) {
    console.error("Error:", error);
    console.error("\nStack trace:", error);
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Please specify a .oglang file.');
    process.exit(1);
  }

  try {
    await runFile(args[0]);
  } catch (error) {
    process.exit(1);
  }
}

main();
