import { TokenType } from "./lexer.js";

import {
  AST,
  Program,
  FunctionDeclaration,
  VariableDeclaration,
  BlockStatement,
  IfStatement,
  WhileStatement,
  ForStatement,
  ReturnStatement,
  ExpressionStatement,
  BinaryOperation,
  UnaryOperation,
  LogicalOperation,
  AssignmentExpression,
  CallExpression,
  GroupingExpression,
  Identifier,
  NumberLiteral,
  StringLiteral,
  BooleanLiteral,
  NullLiteral,
  TypeAnnotation,
  ArrayExpression,
  ObjectExpression,
  PropertyExpression,
  ClassDeclaration,
  MethodDeclaration,
  PropertyDeclaration,
  ThisExpression,
  NewExpression,
} from "./ast.js";

export class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }

  // Temel yardımcı metodlar
  peek() {
    return this.tokens[this.current];
  }

  peekNext() {
    return this.tokens[this.current + 1];
  }

  previous() {
    return this.tokens[this.current - 1];
  }

  consume() {
    return this.tokens[this.current++];
  }

  match(type) {
    if (this.peek().type === type) {
      return this.consume();
    }
    return null;
  }

  check(type) {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  expect(type, message) {
    const token = this.peek();
    if (token.type === type) {
      return this.consume();
    }
    throw new Error(`${message} at line ${token.line}, column ${token.column}`);
  }

  isAtEnd() {
    return this.peek().type === TokenType.EOF;
  }

  // Program = Declaration*
  parse() {
    const declarations = [];
    while (!this.isAtEnd()) {
      try {
        const decl = this.parseDeclaration();
        if (decl) {
          declarations.push(decl);
        }
      } catch (error) {
        console.error(error);
        this.synchronize();
      }
    }
    return new Program(declarations);
  }

  // Hata kurtarma
  synchronize() {
    this.consume();

    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.SEMICOLON) return;

      switch (this.peek().type) {
        case TokenType.FN:
        case TokenType.LET:
        case TokenType.MUT:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.RETURN:
          return;
      }

      this.consume();
    }
  }

  // Declaration = FunctionDecl | VariableDecl | Statement
  parseDeclaration() {
    console.log("parseDeclaration - Current token:", this.peek().type);

    if (this.match(TokenType.CLASS)) {
      return this.parseClassDeclaration();
    }
    if (this.match(TokenType.FN)) {
      return this.parseFunctionDeclaration();
    }
    if (this.match(TokenType.LET) || this.match(TokenType.MUT)) {
      const mutable = this.previous().type === TokenType.MUT;
      const varDecl = this.parseVariableDeclaration(mutable);
      console.log("Created VariableDeclaration:", varDecl);
      return varDecl;
    }
    return this.parseStatement();
  }

  // FunctionDecl = "fn" IDENTIFIER "(" Parameters? ")" "->" Type Block
  parseFunctionDeclaration() {
    const name = this.expect(TokenType.IDENTIFIER, "Expected function name").value;
    this.expect(TokenType.LPAREN, 'Expected "(" after function name');

    const params = [];
    if (!this.match(TokenType.RPAREN)) {
      do {
        const paramName = this.expect(TokenType.IDENTIFIER, "Expected parameter name").value;
        this.expect(TokenType.COLON, 'Expected ":" after parameter name');
        const paramType = this.expect(TokenType.IDENTIFIER, "Expected parameter type").value;
        params.push({ name: paramName, type: paramType });
      } while (this.match(TokenType.COMMA));

      this.expect(TokenType.RPAREN, 'Expected ")" after parameters');
    }

    this.expect(TokenType.ARROW, 'Expected "->" after parameters');
    const returnType = this.expect(TokenType.IDENTIFIER, "Expected return type").value;

    this.expect(TokenType.LBRACE, 'Expected "{" before function body');
    const body = this.parseBlock();

    return new FunctionDeclaration(name, params, returnType, body);
  }

  // VariableDecl = ("let" | "mut") IDENTIFIER (":" Type)? "=" Expression
  parseVariableDeclaration(mutable = false) {
    console.log("parseVariableDeclaration - Starting");

    const name = this.expect(
      TokenType.IDENTIFIER,
      "Expected variable name"
    ).value;
    console.log("parseVariableDeclaration - Got name:", name);

    let type = null;
    if (this.match(TokenType.COLON)) {
      type = this.expect(
        TokenType.IDENTIFIER,
        "Expected type annotation"
      ).value;
      console.log("parseVariableDeclaration - Got type:", type);
    }

    this.expect(TokenType.ASSIGN, 'Expected "=" after variable name');
    const init = this.parseExpression();
    console.log("parseVariableDeclaration - Got init:", init);

    this.expect(TokenType.SEMICOLON, 'Expected ";" after variable declaration');

    const varDecl = new VariableDeclaration(name, type, mutable, init);
    console.log("parseVariableDeclaration - Created node:", varDecl);
    return varDecl;
  }

  // Statement = ExprStmt | BlockStmt | IfStmt | WhileStmt | ReturnStmt
  parseStatement() {
    if (this.match(TokenType.IF)) {
      return this.parseIfStatement();
    }
    if (this.match(TokenType.WHILE)) {
      return this.parseWhileStatement();
    }
    if (this.match(TokenType.RETURN)) {
      return this.parseReturnStatement();
    }
    if (this.match(TokenType.LBRACE)) {
      const statements = this.parseBlock();
      return new BlockStatement(statements);
    }
    if (this.match(TokenType.LET) || this.match(TokenType.MUT)) {
      const mutable = this.previous().type === TokenType.MUT;
      return this.parseVariableDeclaration(mutable);
    }

    return this.parseExpressionStatement();
  }

  parseExpressionStatement() {
    const expr = this.parseExpression();
    this.expect(TokenType.SEMICOLON, 'Expected ";" after expression statement');
    return new ExpressionStatement(expr);
  }

  // Block = "{" Declaration* "}"
  parseBlock() {
    console.log("parseBlock - Starting");
    const statements = [];

    while (!this.isAtEnd() && !this.match(TokenType.RBRACE)) {
      const stmt = this.parseDeclaration();
      if (stmt) {
        console.log("parseBlock - Got statement:", stmt);
        statements.push(stmt);
      }
    }

    if (this.previous().type !== TokenType.RBRACE) {
      throw new Error('Expected "}" after block');
    }

    console.log("parseBlock - All statements:", statements);
    return statements;
  }

  // IfStmt = "if" Expression Block ("else" Block)?
  parseIfStatement() {
    this.expect(TokenType.LPAREN, 'Expected "(" after if');
    const condition = this.parseExpression();
    this.expect(TokenType.RPAREN, 'Expected ")" after if condition');

    this.expect(TokenType.LBRACE, 'Expected "{" before if body');
    const thenBranch = this.parseBlock();

    let elseBranch = null;
    if (this.match(TokenType.ELSE)) {
      this.expect(TokenType.LBRACE, 'Expected "{" before else body');
      elseBranch = this.parseBlock();
    }

    return new IfStatement(condition, thenBranch, elseBranch);
  }

  // WhileStmt = "while" Expression Block
  parseWhileStatement() {
    this.expect(TokenType.LPAREN, 'Expected "(" after while');
    const condition = this.parseExpression();
    this.expect(TokenType.RPAREN, 'Expected ")" after while condition');

    const body = this.parseBlock();

    return new WhileStatement(condition, body);
  }

  // ReturnStmt = "return" Expression?
  parseReturnStatement() {
    const value = this.parseExpression();
    this.expect(TokenType.SEMICOLON, 'Expected ";" after return statement');
    return new ReturnStatement(value);
  }

  // Expression = Assignment
  parseExpression() {
    return this.parseAssignment();
  }

  // Assignment = (IDENTIFIER | PropertyExpression) "=" Assignment | LogicalOr
  parseAssignment() {
    const expr = this.parseLogicalOr();

    if (this.match(TokenType.ASSIGN)) {
      const equals = this.previous();
      const value = this.parseAssignment();

      if (expr instanceof Identifier || expr instanceof PropertyExpression) {
        const target = expr instanceof Identifier ? expr.value : expr;
        return new AssignmentExpression(target, "=", value);
      }

      throw new Error(`Invalid assignment target at line ${equals.line}`);
    }

    return expr;
  }

  // LogicalOr = LogicalAnd ("||" LogicalAnd)*
  parseLogicalOr() {
    let expr = this.parseLogicalAnd();

    while (this.match(TokenType.OR)) {
      const operator = this.previous().value;
      const right = this.parseLogicalAnd();
      expr = new LogicalOperation(expr, operator, right);
    }

    return expr;
  }

  // LogicalAnd = Equality ("&&" Equality)*
  parseLogicalAnd() {
    let expr = this.parseEquality();

    while (this.match(TokenType.AND)) {
      const operator = this.previous().value;
      const right = this.parseEquality();
      expr = new LogicalOperation(expr, operator, right);
    }

    return expr;
  }

  // Equality = Comparison (("!=" | "==") Comparison)*
  parseEquality() {
    let expr = this.parseComparison();

    while (this.match(TokenType.BANG_EQUAL) || this.match(TokenType.EQUALS)) {
      const operator = this.previous().value;
      const right = this.parseComparison();
      expr = new BinaryOperation(expr, operator, right);
    }

    return expr;
  }

  // Comparison = Term ((">" | ">=" | "<" | "<=") Term)*
  parseComparison() {
    let expr = this.parseTerm();

    while (
      this.match(TokenType.GREATER) ||
      this.match(TokenType.GREATER_EQUAL) ||
      this.match(TokenType.LESS) ||
      this.match(TokenType.LESS_EQUAL)
    ) {
      const operator = this.previous().value;
      const right = this.parseTerm();
      expr = new BinaryOperation(expr, operator, right);
    }

    return expr;
  }

  // Term = Factor (("+" | "-") Factor)*
  parseTerm() {
    let expr = this.parseFactor();

    while (this.match(TokenType.PLUS) || this.match(TokenType.MINUS)) {
      const operator = this.previous().value;
      const right = this.parseFactor();
      expr = new BinaryOperation(expr, operator, right);
    }

    return expr;
  }

  // Factor = Unary (("*" | "/") Unary)*
  parseFactor() {
    let expr = this.parseUnary();

    while (this.match(TokenType.MULTIPLY) || this.match(TokenType.DIVIDE)) {
      const operator = this.previous().value;
      const right = this.parseUnary();
      expr = new BinaryOperation(expr, operator, right);
    }

    return expr;
  }

  // Unary = ("!" | "-") Unary | Call
  parseUnary() {
    if (this.match(TokenType.BANG) || this.match(TokenType.MINUS)) {
      const operator = this.previous().value;
      const right = this.parseUnary();
      return new UnaryOperation(operator, right);
    }

    return this.parseCall();
  }

  // Call = Primary ( "(" Arguments? ")" )*
  parseCall() {
    let expr = this.parsePrimary();

    while (true) {
      if (this.match(TokenType.LPAREN)) {
        expr = this.finishCall(expr);
      } else if (this.match(TokenType.DOT)) {
        const name = this.expect(TokenType.IDENTIFIER, "Expected property name after '.'").value;
        expr = new PropertyExpression(expr, new Identifier(name));
      } else {
        break;
      }
    }

    return expr;
  }

  finishCall(callee) {
    const args = [];
    if (!this.check(TokenType.RPAREN)) {
      do {
        args.push(this.parseExpression());
      } while (this.match(TokenType.COMMA));
    }

    this.expect(TokenType.RPAREN, 'Expected ")" after arguments');

    return new CallExpression(callee, args);
  }

  // Primary = NUMBER | STRING | "true" | "false" | "nil" | "(" Expression ")" | IDENTIFIER
  parsePrimary() {
    if (this.match(TokenType.NUMBER)) {
      return new NumberLiteral(this.previous().value);
    }
    if (this.match(TokenType.STRING)) {
      return new StringLiteral(this.previous().value);
    }
    if (this.match(TokenType.TRUE)) {
      return new BooleanLiteral(true);
    }
    if (this.match(TokenType.FALSE)) {
      return new BooleanLiteral(false);
    }
    if (this.match(TokenType.NIL)) {
      return new NullLiteral();
    }
    if (this.match(TokenType.IDENTIFIER)) {
      return new Identifier(this.previous().value);
    }
    if (this.match(TokenType.LPAREN)) {
      const expr = this.parseExpression();
      this.expect(TokenType.RPAREN, 'Expected ")" after expression');
      return new GroupingExpression(expr);
    }
    if (this.match(TokenType.THIS)) {
      return new ThisExpression();
    }
    if (this.match(TokenType.NEW)) {
      return this.parseNewExpression();
    }

    throw new Error(
      `Unexpected token: ${this.peek().type} at line ${this.peek().line}`
    );
  }

  parseNewExpression() {
    const className = this.expect(TokenType.IDENTIFIER, "Expected class name after 'new'").value;
    this.expect(TokenType.LPAREN, 'Expected "(" after class name');

    const args = [];
    if (!this.check(TokenType.RPAREN)) {
      do {
        args.push(this.parseExpression());
      } while (this.match(TokenType.COMMA));
    }

    this.expect(TokenType.RPAREN, 'Expected ")" after arguments');
    return new NewExpression(className, args);
  }

  parseClassDeclaration() {
    const name = this.expect(TokenType.IDENTIFIER, "Expected class name").value;
    this.expect(TokenType.LBRACE, 'Expected "{" before class body');

    const properties = [];
    const methods = [];

    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      const isStatic = this.match(TokenType.STATIC);

      if (this.match(TokenType.FN)) {
        // Method tanımı
        const method = this.parseMethodDeclaration(isStatic);
        methods.push(method);
      } else {
        // Property tanımı
        const property = this.parsePropertyDeclaration(isStatic);
        properties.push(property);
      }
    }

    this.expect(TokenType.RBRACE, 'Expected "}" after class body');
    return new ClassDeclaration(name, methods, properties);
  }

  parseMethodDeclaration(isStatic) {
    const name = this.expect(TokenType.IDENTIFIER, "Expected method name").value;
    this.expect(TokenType.LPAREN, 'Expected "(" after method name');

    const params = [];
    if (!this.match(TokenType.RPAREN)) {
      do {
        const paramName = this.expect(TokenType.IDENTIFIER, "Expected parameter name").value;
        this.expect(TokenType.COLON, 'Expected ":" after parameter name');
        const paramType = this.expect(TokenType.IDENTIFIER, "Expected parameter type").value;
        params.push({ name: paramName, type: paramType });
      } while (this.match(TokenType.COMMA));

      this.expect(TokenType.RPAREN, 'Expected ")" after parameters');
    }

    this.expect(TokenType.ARROW, 'Expected "->" after parameters');
    const returnType = this.expect(TokenType.IDENTIFIER, "Expected return type").value;

    this.expect(TokenType.LBRACE, 'Expected "{" before method body');
    const body = this.parseBlock();

    return new MethodDeclaration(name, params, returnType, body, isStatic);
  }

  parsePropertyDeclaration(isStatic) {
    const name = this.expect(TokenType.IDENTIFIER, "Expected property name").value;
    this.expect(TokenType.COLON, 'Expected ":" after property name');
    const type = this.expect(TokenType.IDENTIFIER, "Expected property type").value;

    let init = null;
    if (this.match(TokenType.ASSIGN)) {
      init = this.parseExpression();
    }

    this.expect(TokenType.SEMICOLON, 'Expected ";" after property declaration');
    return new PropertyDeclaration(name, type, isStatic, init);
  }
}
