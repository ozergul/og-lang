# OgLang - A Statically Typed Programming Language

OgLang is a statically typed programming language that compiles to JavaScript. It features a simple and expressive syntax with strong type checking.

## Features

- Static type checking
- Classes and object-oriented programming
- Functions with type annotations
- String manipulation utilities
- Mathematical operations
- Array operations
- Control flow statements (if, while)
- Runtime type checking

## Project Structure

```
.
├── examples/              # Example OgLang programs
│   ├── calculatorClass.oglang
│   ├── stringUtils.oglang
│   ├── functions.oglang
│   ├── arrayOperations.oglang
│   ├── mathOperations.oglang
│   └── textProcessing.oglang
├── src/                  # Source code
│   ├── lexer.js         # Lexical analyzer
│   ├── parser.js        # Parser
│   ├── ast.js           # Abstract Syntax Tree definitions
│   └── codeGenerator.js # JavaScript code generator
├── runner.js            # Program runner
├── Makefile            # Build and run scripts
└── package.json        # Project configuration
```

## Installation

```bash
# Clone the repository
git clone https://github.com/ozergul/oglang.git
cd oglang

# Install dependencies
pnpm install
```

## Usage

You can run the example programs using the following commands:

```bash
# Run all examples
pnpm run run-examples

# Run specific examples
pnpm run run-calculator
pnpm run run-string-utils
pnpm run run-functions
pnpm run run-array-operations
pnpm run run-math-operations
pnpm run run-text-processing

# Clean generated files
pnpm run clean
```

## Example Programs

### Calculator Class
```oglang
class Calculator {
    fn add(a: number, b: number) -> number {
        return a + b;
    }
}
```

### String Utils
```oglang
class StringUtils {
    fn concat(str1: string, str2: string) -> string {
        return str1 + str2;
    }
}
```

### Math Operations
```oglang
class MathUtils {
    fn isPrime(n: number) -> number {
        if (n <= 1) {
            return 0;  // false
        }
        return 1;  // true
    }
}
```

## Development

The compilation process consists of the following steps:

1. **Lexical Analysis**: Converts source code into tokens
2. **Parsing**: Creates an Abstract Syntax Tree (AST)
3. **Code Generation**: Generates JavaScript code from the AST
4. **Execution**: Runs the generated JavaScript code

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 