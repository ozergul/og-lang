import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import { Lexer, TokenType, Token } from './lexer.js';
import { Parser } from './parser.js';
import { generateCode } from './codeGenerator.js';

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from current directory
app.use(express.static('.'));

async function compileCode(sourceCode) {
    // Create lexer and analyze
    const lexer = new Lexer(sourceCode);
    const tokens = [];
    let token;
    do {
        token = lexer.getNextToken();
        tokens.push(token);
    } while (token.type !== TokenType.EOF);
    
    // Create parser and generate AST
    const parser = new Parser(tokens);
    const ast = parser.parse();
    
    // Generate JavaScript code
    const jsCode = generateCode(ast);
    
    return {
        tokens,
        ast,
        jsCode
    };
}

// Compilation endpoint
app.post('/compile', async (req, res) => {
    try {
        const { code } = req.body;
        
        const { tokens, ast, jsCode } = await compileCode(code);
        
        res.json({
            success: true,
            compiledCode: jsCode,
            tokens,
            ast
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
            stack: error.stack
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 