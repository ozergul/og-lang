import { TokenType } from "./lexer.js";
import {
  Program,
  FunctionDeclaration,
  VariableDeclaration,
  BlockStatement,
  IfStatement,
  WhileStatement,
  ReturnStatement,
  ExpressionStatement,
  BinaryOperation,
  UnaryOperation,
  LogicalOperation,
  AssignmentExpression,
  CallExpression,
  PropertyExpression,
  ArrayAccessExpression,
  Identifier,
  NumberLiteral,
  StringLiteral,
  BooleanLiteral,
  NullLiteral,
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

  peek() {
    return this.tokens[this.current];
  }

  previous() {
    return this.tokens[this.current - 1];
  }

  consume() {
    return this.tokens[this.current++];
  }

  match(type) {
    if (this.peek().type === type) {
      this.consume();
      return true;
    }
    return false;
  }

  expect(type, message) {
    const token = this.peek();
    if (token.type === type) {
      return this.consume();
    }
    throw new Error(`${message} at line ${token.line}, column ${token.column}`);
  }

  parse() {
    const declarations = [];
    while (this.current < this.tokens.length && this.peek().type !== TokenType.EOF) {
      try {
        const decl = this.parseDeclaration();
        if (decl) declarations.push(decl);
      } catch (error) {
        console.error(error);
        this.synchronize();
      }
    }
    return new Program(declarations);
  }

  synchronize() {
    this.consume();
    while (this.current < this.tokens.length) {
      if (this.previous().type === TokenType.SEMICOLON) return;

      switch (this.peek().type) {
        case TokenType.CLASS:
        case TokenType.FN:
        case TokenType.LET:
        case TokenType.MUT:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.RETURN:
          return;
      }

      this.consume();
    }
  }

  parseDeclaration() {
    if (this.match(TokenType.CLASS)) {
      return this.parseClassDeclaration();
    }
    if (this.match(TokenType.FN)) {
      return this.parseFunctionDeclaration();
    }
    if (this.match(TokenType.LET) || this.match(TokenType.MUT)) {
      const mutable = this.previous().type === TokenType.MUT;
      return this.parseVariableDeclaration(mutable);
    }
    return this.parseStatement();
  }

  parseClassDeclaration() {
    const name = this.expect(TokenType.IDENTIFIER, "Expected class name").value;
    this.expect(TokenType.LBRACE, "Expected '{' after class name");

    const methods = [];
    const properties = [];

    while (this.peek().type !== TokenType.RBRACE && this.peek().type !== TokenType.EOF) {
      const isStatic = this.match(TokenType.STATIC);

      if (this.match(TokenType.FN)) {
        methods.push(this.parseMethodDeclaration(isStatic));
      } else {
        const property = this.parsePropertyDeclaration(isStatic);
        if (property) properties.push(property);
      }
    }

    this.expect(TokenType.RBRACE, "Expected '}' after class body");
    return new ClassDeclaration(name, methods, properties);
  }

  parseMethodDeclaration(isStatic) {
    const name = this.expect(TokenType.IDENTIFIER, "Expected method name").value;
    this.expect(TokenType.LPAREN, "Expected '(' after method name");

    const params = [];
    if (!this.match(TokenType.RPAREN)) {
      do {
        const paramName = this.expect(TokenType.IDENTIFIER, "Expected parameter name").value;
        this.expect(TokenType.COLON, "Expected ':' after parameter name");
        const paramType = this.expect(TokenType.IDENTIFIER, "Expected parameter type").value;
        params.push({ name: paramName, type: paramType });
      } while (this.match(TokenType.COMMA));

      this.expect(TokenType.RPAREN, "Expected ')' after parameters");
    }

    this.expect(TokenType.ARROW, "Expected '->' after parameters");
    const returnType = this.expect(TokenType.IDENTIFIER, "Expected return type").value;

    const body = [];
    this.expect(TokenType.LBRACE, "Expected '{' before method body");
    
    while (this.peek().type !== TokenType.RBRACE && this.peek().type !== TokenType.EOF) {
      const stmt = this.parseStatement();
      if (stmt) body.push(stmt);
    }

    this.expect(TokenType.RBRACE, "Expected '}' after method body");
    return new MethodDeclaration(name, params, returnType, body, isStatic);
  }

  parsePropertyDeclaration(isStatic) {
    const name = this.expect(TokenType.IDENTIFIER, "Expected property name").value;
    this.expect(TokenType.COLON, "Expected ':' after property name");
    const type = this.expect(TokenType.IDENTIFIER, "Expected property type").value;

    let init = null;
    if (this.match(TokenType.ASSIGN)) {
      init = this.parseExpression();
    }

    this.expect(TokenType.SEMICOLON, "Expected ';' after property declaration");
    return new PropertyDeclaration(name, type, isStatic, init);
  }

  parseFunctionDeclaration() {
    const name = this.expect(TokenType.IDENTIFIER, "Expected function name").value;
    this.expect(TokenType.LPAREN, "Expected '(' after function name");

    const params = [];
    if (!this.match(TokenType.RPAREN)) {
      do {
        const paramName = this.expect(TokenType.IDENTIFIER, "Expected parameter name").value;
        this.expect(TokenType.COLON, "Expected ':' after parameter name");
        const paramType = this.expect(TokenType.IDENTIFIER, "Expected parameter type").value;
        params.push({ name: paramName, type: paramType });
      } while (this.match(TokenType.COMMA));

      this.expect(TokenType.RPAREN, "Expected ')' after parameters");
    }

    this.expect(TokenType.ARROW, "Expected '->' after parameters");
    const returnType = this.expect(TokenType.IDENTIFIER, "Expected return type").value;

    const body = [];
    this.expect(TokenType.LBRACE, "Expected '{' before function body");
    
    while (this.peek().type !== TokenType.RBRACE && this.peek().type !== TokenType.EOF) {
      const stmt = this.parseStatement();
      if (stmt) body.push(stmt);
    }

    this.expect(TokenType.RBRACE, "Expected '}' after function body");
    return new FunctionDeclaration(name, params, returnType, body);
  }

  parseVariableDeclaration(mutable = false) {
    const name = this.expect(TokenType.IDENTIFIER, "Expected variable name").value;
    
    let type = null;
    if (this.match(TokenType.COLON)) {
      type = this.expect(TokenType.IDENTIFIER, "Expected type annotation").value;
    }

    this.expect(TokenType.ASSIGN, "Expected '=' after variable name");
    const init = this.parseExpression();
    this.expect(TokenType.SEMICOLON, "Expected ';' after variable declaration");

    return new VariableDeclaration(name, type, mutable, init);
  }

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

  parseBlock() {
    const statements = [];
    
    while (this.peek().type !== TokenType.RBRACE && this.peek().type !== TokenType.EOF) {
      const stmt = this.parseStatement();
      if (stmt) statements.push(stmt);
    }
    
    return statements;
  }

  parseIfStatement() {
    this.expect(TokenType.LPAREN, "Expected '(' after 'if'");
    const condition = this.parseExpression();
    this.expect(TokenType.RPAREN, "Expected ')' after if condition");

    this.expect(TokenType.LBRACE, "Expected '{' before if body");
    const thenBranch = this.parseBlock();

    let elseBranch = null;
    if (this.match(TokenType.ELSE)) {
      this.expect(TokenType.LBRACE, "Expected '{' before else body");
      elseBranch = this.parseBlock();
    }

    return new IfStatement(condition, thenBranch, elseBranch);
  }

  parseWhileStatement() {
    this.expect(TokenType.LPAREN, "Expected '(' after 'while'");
    const condition = this.parseExpression();
    this.expect(TokenType.RPAREN, "Expected ')' after while condition");

    this.expect(TokenType.LBRACE, "Expected '{' before while body");
    const body = this.parseBlock();

    return new WhileStatement(condition, body);
  }

  parseReturnStatement() {
    const value = this.parseExpression();
    this.expect(TokenType.SEMICOLON, "Expected ';' after return value");
    return new ReturnStatement(value);
  }

  parseExpressionStatement() {
    const expr = this.parseExpression();
    this.expect(TokenType.SEMICOLON, "Expected ';' after expression");
    return new ExpressionStatement(expr);
  }

  parseExpression() {
    return this.parseAssignment();
  }

  parseAssignment() {
    const expr = this.parseLogicalOr();

    if (this.match(TokenType.ASSIGN)) {
      const value = this.parseAssignment();
      if (expr instanceof Identifier || expr instanceof PropertyExpression || expr instanceof ArrayAccessExpression) {
        return new AssignmentExpression(expr, "=", value);
      }
      throw new Error("Invalid assignment target");
    }

    return expr;
  }

  parseLogicalOr() {
    let expr = this.parseLogicalAnd();

    while (this.match(TokenType.OR)) {
      const operator = "||";
      const right = this.parseLogicalAnd();
      expr = new LogicalOperation(expr, operator, right);
    }

    return expr;
  }

  parseLogicalAnd() {
    let expr = this.parseEquality();

    while (this.match(TokenType.AND)) {
      const operator = "&&";
      const right = this.parseEquality();
      expr = new LogicalOperation(expr, operator, right);
    }

    return expr;
  }

  parseEquality() {
    let expr = this.parseComparison();

    while (this.match(TokenType.EQUALS) || this.match(TokenType.BANG_EQUAL)) {
      const operator = this.previous().type === TokenType.EQUALS ? "==" : "!=";
      const right = this.parseComparison();
      expr = new BinaryOperation(expr, operator, right);
    }

    return expr;
  }

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

  parseTerm() {
    let expr = this.parseFactor();

    while (this.match(TokenType.PLUS) || this.match(TokenType.MINUS)) {
      const operator = this.previous().value;
      const right = this.parseFactor();
      expr = new BinaryOperation(expr, operator, right);
    }

    return expr;
  }

  parseFactor() {
    let expr = this.parseUnary();

    while (this.match(TokenType.MULTIPLY) || this.match(TokenType.DIVIDE)) {
      const operator = this.previous().value;
      const right = this.parseUnary();
      expr = new BinaryOperation(expr, operator, right);
    }

    return expr;
  }

  parseUnary() {
    if (this.match(TokenType.BANG) || this.match(TokenType.MINUS)) {
      const operator = this.previous().value;
      const right = this.parseUnary();
      return new UnaryOperation(operator, right);
    }

    return this.parseCall();
  }

  parseCall() {
    let expr = this.parsePrimary();

    while (true) {
      if (this.match(TokenType.LPAREN)) {
        expr = this.finishCall(expr);
      } else if (this.match(TokenType.DOT)) {
        const name = this.expect(TokenType.IDENTIFIER, "Expected property name after '.'").value;
        expr = new PropertyExpression(expr, new Identifier(name));
      } else if (this.match(TokenType.LBRACKET)) {
        const index = this.parseExpression();
        this.expect(TokenType.RBRACKET, "Expected ']' after array index");
        expr = new ArrayAccessExpression(expr, index);
      } else {
        break;
      }
    }

    return expr;
  }

  finishCall(callee) {
    const args = [];
    if (!this.match(TokenType.RPAREN)) {
      do {
        args.push(this.parseExpression());
      } while (this.match(TokenType.COMMA));

      this.expect(TokenType.RPAREN, "Expected ')' after arguments");
    }

    return new CallExpression(callee, args);
  }

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
    if (this.match(TokenType.THIS)) {
      return new ThisExpression();
    }
    if (this.match(TokenType.NEW)) {
      const className = this.expect(TokenType.IDENTIFIER, "Expected class name after 'new'").value;
      this.expect(TokenType.LPAREN, "Expected '(' after class name");
      const args = [];
      if (!this.match(TokenType.RPAREN)) {
        do {
          args.push(this.parseExpression());
        } while (this.match(TokenType.COMMA));
        this.expect(TokenType.RPAREN, "Expected ')' after arguments");
      }
      return new NewExpression(className, args);
    }
    if (this.match(TokenType.IDENTIFIER)) {
      return new Identifier(this.previous().value);
    }
    if (this.match(TokenType.LPAREN)) {
      const expr = this.parseExpression();
      this.expect(TokenType.RPAREN, "Expected ')' after expression");
      return expr;
    }

    throw new Error(`Unexpected token: ${this.peek().type} at line ${this.peek().line}`);
  }
}
