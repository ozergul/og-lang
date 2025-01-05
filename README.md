# OgLang - A Modern Statically Typed Programming Language

![OG Lang Playground](/screenshots/ss1.png)

OgLang is a statically typed programming language that compiles to JavaScript. It features a simple and expressive syntax with strong type checking, making it ideal for building robust applications.

## Online Playground

Try OgLang directly in your browser using our modern playground:

- **Modern UI** with Tailwind CSS and DaisyUI
- **Real-time compilation** and output
- **Built-in examples** to explore language features
- **Syntax highlighting** with CodeMirror editor
- **Dark theme** for better coding experience
- **Full-width layout** for maximum coding space
- **Responsive design** for various screen sizes

To run the playground locally:

```bash
# Install and start the playground
pnpm run playground
```

## Features

- **Static Type System**
  - Built-in types: `number`, `string`, `boolean`
  - Type inference
  - Runtime type checking
- **Object-Oriented Programming**
  - Classes and inheritance
  - Instance methods
  - Static methods
  - Constructor support
- **Modern Syntax**
  - Function type annotations
  - String interpolation
  - Array operations
  - Method chaining
- **Control Flow**
  - If-else statements
  - While loops
  - Return statements
- **Standard Library**
  - String utilities
  - Math operations
  - Array manipulations
  - Text processing

## Installation

```bash
# Clone the repository
git clone https://github.com/ozergul/oglang.git
cd oglang

# Install dependencies
pnpm install

# Run examples
pnpm run run-examples
```

## Language Examples

### 1. String Operations
```oglang
class StringUtils {
    fn concat(str1: string, str2: string) -> string {
        return str1 + str2;
    }

    fn repeat(str: string, count: number) -> string {
        let result: string = "";
        let i: number = 0;
        
        while (i < count) {
            result = result + str;
            i = i + 1;
        }
        
        return result;
    }

    fn countDigits(str: string) -> number {
        let count: number = 0;
        let i: number = 0;
        
        while (i < str.length) {
            let char = str[i];
            if (char >= "0" && char <= "9") {
                count = count + 1;
            }
            i = i + 1;
        }
        
        return count;
    }
}
```

### 2. Mathematical Operations
```oglang
class MathUtils {
    fn isPrime(n: number) -> number {
        if (n <= 1) {
            return 0;  // false
        }
        
        let i: number = 2;
        while (i * i <= n) {
            if (n - (n / i) * i == 0) {
                return 0;  // false
            }
            i = i + 1;
        }
        
        return 1;  // true
    }
    
    fn fibonacci(n: number) -> number {
        if (n <= 1) {
            return n;
        }
        
        let prev: number = 0;
        let current: number = 1;
        let i: number = 2;
        
        while (i <= n) {
            let next = current + prev;
            prev = current;
            current = next;
            i = i + 1;
        }
        
        return current;
    }
    
    fn gcd(a: number, b: number) -> number {
        while (b != 0) {
            let temp = b;
            b = a - (a / b) * b;  // modulo operation
            a = temp;
        }
        return a;
    }
}
```

## Project Structure

```
oglang/
├── examples/                # Example OgLang programs
│   ├── calculatorClass.oglang   # Basic calculator operations
│   ├── stringUtils.oglang      # String manipulation utilities
│   ├── mathOperations.oglang   # Mathematical operations
│   ├── arrayOperations.oglang  # Array manipulation examples
│   └── textProcessing.oglang   # Text processing utilities
├── playground/             # Online playground
│   ├── public/            # Static files
│   │   └── index.html     # Playground UI
│   ├── src/              # Server code
│   │   └── server.js     # Express server
│   └── package.json      # Playground dependencies
├── src/                    # Compiler source code
│   ├── lexer.js           # Tokenization of source code
│   ├── parser.js          # AST generation
│   ├── ast.js             # Abstract Syntax Tree definitions
│   └── codeGenerator.js   # JavaScript code generation
├── screenshots/           # Project screenshots
├── runner.js              # Program execution engine
├── Makefile              # Build and run scripts
└── package.json          # Project configuration
```

## Running Examples

```bash
# Run all examples
pnpm run run-examples

# Run specific examples
pnpm run run-calculator     # Basic calculator
pnpm run run-string-utils   # String utilities
pnpm run run-math          # Math operations
pnpm run run-arrays        # Array operations
pnpm run run-text          # Text processing

# Clean generated files
pnpm run clean
```

## Development

### Compilation Process

1. **Lexical Analysis** (`lexer.js`)
   - Converts source code into tokens
   - Handles keywords, operators, and literals
   - Manages source locations for error reporting

2. **Parsing** (`parser.js`)
   - Creates Abstract Syntax Tree (AST)
   - Performs syntax validation
   - Handles operator precedence

3. **Code Generation** (`codeGenerator.js`)
   - Generates JavaScript code from AST
   - Implements runtime type checking
   - Handles class and method generation

4. **Execution** (`runner.js`)
   - Runs the generated JavaScript code
   - Provides runtime environment
   - Handles program output

### Adding New Features

1. Add token types in `lexer.js`
2. Implement parsing rules in `parser.js`
3. Add AST node types in `ast.js`
4. Implement code generation in `codeGenerator.js`
5. Add examples in `examples/` directory

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by modern programming languages like TypeScript and Rust
- Built with love for static typing and clean syntax
- Special thanks to all contributors 