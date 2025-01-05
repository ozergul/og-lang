import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Lexer, TokenType } from '../../lexer.js';
import { Parser } from '../../parser.js';
import { generateCode } from '../../codeGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EXAMPLES_DIR = path.join(__dirname, '../../examples');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Get list of examples
app.get('/api/examples', async (req, res) => {
    try {
        const files = await fs.readdir(EXAMPLES_DIR);
        const examples = files
            .filter(file => file.endsWith('.oglang'))
            .map(file => ({
                name: file,
                path: `/api/examples/${file}`
            }));
        res.json(examples);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get specific example content
app.get('/api/examples/:filename', async (req, res) => {
    try {
        const filePath = path.join(EXAMPLES_DIR, req.params.filename);
        if (!filePath.endsWith('.oglang')) {
            throw new Error('Invalid file type');
        }
        const content = await fs.readFile(filePath, 'utf-8');
        res.json({ content });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Compilation endpoint
app.post('/api/compile', async (req, res) => {
    try {
        const { code } = req.body;
        
        // Create lexer and analyze
        const lexer = new Lexer(code);
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