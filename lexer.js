export { Lexer, TokenType, Token };

// tokenTypes.js
const TokenType = {
  // Keywords
  LET: "LET",
  MUT: "MUT",
  FN: "FN",
  RETURN: "RETURN",
  IF: "IF",
  ELSE: "ELSE",
  WHILE: "WHILE",
  FOR: "FOR",
  IN: "IN",
  WHEN: "WHEN",
  MATCH: "MATCH",
  TRUE: "TRUE",
  FALSE: "FALSE",
  NIL: "NIL",

  // Operators
  PLUS: "PLUS", // +
  MINUS: "MINUS", // -
  MULTIPLY: "MULTIPLY", // *
  DIVIDE: "DIVIDE", // /
  ASSIGN: "ASSIGN", // =
  EQUALS: "EQUALS", // ==
  GREATER: "GREATER", // >
  GREATER_EQUAL: "GREATER_EQUAL", // >=
  LESS: "LESS", // <
  LESS_EQUAL: "LESS_EQUAL", // <=
  AND: "AND", // &&
  OR: "OR", // ||
  BANG: "BANG", // !
  BANG_EQUAL: "BANG_EQUAL", // !=
  ARROW: "ARROW", // ->

  // Delimiters
  LPAREN: "LPAREN", // (
  RPAREN: "RPAREN", // )
  LBRACE: "LBRACE", // {
  RBRACE: "RBRACE", // }
  LBRACKET: "LBRACKET", // [
  RBRACKET: "RBRACKET", // ]
  COLON: "COLON", // :
  SEMICOLON: "SEMICOLON", // ;
  COMMA: "COMMA", // ,
  DOT: "DOT", // .

  // Literals and others
  IDENTIFIER: "IDENTIFIER",
  NUMBER: "NUMBER",
  STRING: "STRING",
  EOF: "EOF",

  // Class-related tokens
  CLASS: "CLASS",
  NEW: "NEW",
  THIS: "THIS",
  STATIC: "STATIC",
};

// token.js
class Token {
  constructor(type, value, line, column) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
  }
}

// lexer.js
class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.line = 1;
    this.column = 1;
    this.currentChar = this.input[this.position];

    this.keywords = {
      let: TokenType.LET,
      mut: TokenType.MUT,
      fn: TokenType.FN,
      return: TokenType.RETURN,
      if: TokenType.IF,
      else: TokenType.ELSE,
      when: TokenType.WHEN,
      for: TokenType.FOR,
      in: TokenType.IN,
      while: TokenType.WHILE,
      match: TokenType.MATCH,
      "class": TokenType.CLASS,
      "new": TokenType.NEW,
      "this": TokenType.THIS,
      "static": TokenType.STATIC,
      "true": TokenType.TRUE,
      "false": TokenType.FALSE,
      "nil": TokenType.NIL
    };
  }

  error() {
    throw new Error(`Lexer error at line ${this.line}, column ${this.column}`);
  }

  advance() {
    this.position++;
    if (this.position > this.input.length - 1) {
      this.currentChar = null;
    } else {
      this.currentChar = this.input[this.position];
      this.column++;
    }
  }

  skipWhitespace() {
    while (this.currentChar && /\s/.test(this.currentChar)) {
      if (this.currentChar === "\n") {
        this.line++;
        this.column = 1;
      }
      this.advance();
    }
  }

  skipComment() {
    while (this.currentChar && this.currentChar !== '\n') {
      this.advance();
    }
  }

  number() {
    let result = "";
    while (this.currentChar && /\d/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    if (this.currentChar === ".") {
      result += this.currentChar;
      this.advance();
      while (this.currentChar && /\d/.test(this.currentChar)) {
        result += this.currentChar;
        this.advance();
      }
    }
    return new Token(
      TokenType.NUMBER,
      parseFloat(result),
      this.line,
      this.column
    );
  }

  identifier() {
    let result = "";
    while (this.currentChar && /[a-zA-Z0-9_]/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }

    const tokenType = this.keywords[result] || TokenType.IDENTIFIER;
    return new Token(tokenType, result, this.line, this.column);
  }

  string() {
    let result = "";
    const quote = this.currentChar;
    this.advance();

    while (this.currentChar && this.currentChar !== quote) {
      if (this.currentChar === "\\") {
        this.advance();
        switch (this.currentChar) {
          case "n":
            result += "\n";
            break;
          case "t":
            result += "\t";
            break;
          case "r":
            result += "\r";
            break;
          default:
            result += this.currentChar;
        }
      } else {
        result += this.currentChar;
      }
      this.advance();
    }

    if (!this.currentChar) {
      this.error();
    }

    this.advance();
    return new Token(TokenType.STRING, result, this.line, this.column);
  }

  getNextToken() {
    while (this.currentChar !== null) {
      // Skip whitespace
      if (/\s/.test(this.currentChar)) {
        this.skipWhitespace();
        continue;
      }

      // Skip comments
      if (this.currentChar === '/' && this.input[this.position + 1] === '/') {
        this.skipComment();
        continue;
      }

      // Numbers
      if (/\d/.test(this.currentChar)) {
        return this.number();
      }

      // Identifiers and keywords
      if (/[a-zA-Z_]/.test(this.currentChar)) {
        return this.identifier();
      }

      // Strings
      if (this.currentChar === '"' || this.currentChar === "'") {
        return this.string();
      }

      // Operators and delimiters
      switch (this.currentChar) {
        case "+":
          this.advance();
          return new Token(TokenType.PLUS, "+", this.line, this.column);

        case "-":
          this.advance();
          if (this.currentChar === ">") {
            this.advance();
            return new Token(TokenType.ARROW, "->", this.line, this.column);
          }
          return new Token(TokenType.MINUS, "-", this.line, this.column);

        case "*":
          this.advance();
          return new Token(TokenType.MULTIPLY, "*", this.line, this.column);

        case "/":
          this.advance();
          return new Token(TokenType.DIVIDE, "/", this.line, this.column);

        case "=":
          this.advance();
          if (this.currentChar === "=") {
            this.advance();
            return new Token(TokenType.EQUALS, "==", this.line, this.column);
          }
          return new Token(TokenType.ASSIGN, "=", this.line, this.column);

        case "!":
          this.advance();
          if (this.currentChar === "=") {
            this.advance();
            return new Token(TokenType.BANG_EQUAL, "!=", this.line, this.column);
          }
          return new Token(TokenType.BANG, "!", this.line, this.column);

        case "<":
          this.advance();
          if (this.currentChar === "=") {
            this.advance();
            return new Token(TokenType.LESS_EQUAL, "<=", this.line, this.column);
          }
          return new Token(TokenType.LESS, "<", this.line, this.column);

        case ">":
          this.advance();
          if (this.currentChar === "=") {
            this.advance();
            return new Token(TokenType.GREATER_EQUAL, ">=", this.line, this.column);
          }
          return new Token(TokenType.GREATER, ">", this.line, this.column);

        case "&":
          this.advance();
          if (this.currentChar === "&") {
            this.advance();
            return new Token(TokenType.AND, "&&", this.line, this.column);
          }
          this.error();

        case "|":
          this.advance();
          if (this.currentChar === "|") {
            this.advance();
            return new Token(TokenType.OR, "||", this.line, this.column);
          }
          this.error();

        case "(":
          this.advance();
          return new Token(TokenType.LPAREN, "(", this.line, this.column);

        case ")":
          this.advance();
          return new Token(TokenType.RPAREN, ")", this.line, this.column);

        case "{":
          this.advance();
          return new Token(TokenType.LBRACE, "{", this.line, this.column);

        case "}":
          this.advance();
          return new Token(TokenType.RBRACE, "}", this.line, this.column);

        case "[":
          this.advance();
          return new Token(TokenType.LBRACKET, "[", this.line, this.column);

        case "]":
          this.advance();
          return new Token(TokenType.RBRACKET, "]", this.line, this.column);

        case ":":
          this.advance();
          return new Token(TokenType.COLON, ":", this.line, this.column);

        case ";":
          this.advance();
          return new Token(TokenType.SEMICOLON, ";", this.line, this.column);

        case ",":
          this.advance();
          return new Token(TokenType.COMMA, ",", this.line, this.column);

        case ".":
          this.advance();
          return new Token(TokenType.DOT, ".", this.line, this.column);

        default:
          this.error();
      }
    }

    return new Token(TokenType.EOF, null, this.line, this.column);
  }
}
