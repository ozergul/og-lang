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
  ArrayExpression,
  GroupingExpression,
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
    try {
      const declarations = [];
      while (!this.isAtEnd()) {
        try {
          const decl = this.parseDeclaration();
          if (decl) declarations.push(decl);
        } catch (error) {
          console.error("Error in parseDeclaration:", error);
          this.synchronize();
        }
      }
      return new Program(declarations);
    } catch (error) {
      console.error("Fatal error in parse:", error);
      throw error;
    }
  }

  isAtEnd() {
    return this.peek().type === TokenType.EOF;
  }

  parseDeclaration() {
    try {
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
    } catch (error) {
      this.synchronize();
      return null;
    }
  }

  synchronize() {
    while (!this.isAtEnd()) {
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

  parseClassDeclaration() {
    try {
      const name = this.expect(TokenType.IDENTIFIER, "Expected class name").value;
      this.expect(TokenType.LBRACE, "Expected '{' after class name");

      const methods = [];
      const properties = [];

      while (!this.isAtEnd() && this.peek().type !== TokenType.RBRACE) {
        const isStatic = this.match(TokenType.STATIC);

        if (this.peek().type === TokenType.FN) {
          this.match(TokenType.FN);
          const method = this.parseMethodDeclaration(isStatic);
          if (method) methods.push(method);
          continue;
        }

        const property = this.parsePropertyDeclaration(isStatic);
        if (property) properties.push(property);
      }

      this.expect(TokenType.RBRACE, "Expected '}' after class body");
      return new ClassDeclaration(name, methods, properties);
    } catch (error) {
      console.error("Error in parseClassDeclaration:", error);
      throw error;
    }
  }

  parseMethodDeclaration(isStatic) {
    try {
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

      const body = this.parseBlock();
      return new MethodDeclaration(name, params, returnType, body, isStatic);
    } catch (error) {
      console.error("Error in parseMethodDeclaration:", error);
      throw error;
    }
  }

  parsePropertyDeclaration(isStatic) {
    try {
      if (this.peek().type === TokenType.FN) {
        return null;
      }

      const name = this.expect(TokenType.IDENTIFIER, "Expected property name").value;
      this.expect(TokenType.COLON, "Expected ':' after property name");
      const type = this.expect(TokenType.IDENTIFIER, "Expected property type").value;

      let init = null;
      if (this.match(TokenType.ASSIGN)) {
        init = this.parseExpression();
      }

      this.expect(TokenType.SEMICOLON, "Expected ';' after property declaration");
      return new PropertyDeclaration(name, type, isStatic, init);
    } catch (error) {
      console.error("Error in parsePropertyDeclaration:", error);
      throw error;
    }
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

    const body = this.parseBlock();
    
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
    try {
      if (this.match(TokenType.IF)) {
        return this.parseIfStatement();
      }
      if (this.match(TokenType.WHILE)) {
        return this.parseWhileStatement();
      }
      if (this.match(TokenType.RETURN)) {
        const value = this.parseExpression();
        this.expect(TokenType.SEMICOLON, "Expected ';' after return value");
        return new ReturnStatement(value);
      }
      if (this.peek().type === TokenType.LBRACE) {
        return new BlockStatement(this.parseBlock());
      }
      if (this.match(TokenType.LET) || this.match(TokenType.MUT)) {
        const mutable = this.previous().type === TokenType.MUT;
        return this.parseVariableDeclaration(mutable);
      }

      const expr = this.parseExpression();
      this.expect(TokenType.SEMICOLON, "Expected ';' after expression");
      return new ExpressionStatement(expr);
    } catch (error) {
      this.synchronize();
      return null;
    }
  }

  parseBlock() {
    try {
      this.expect(TokenType.LBRACE, "Expected '{'");
      const statements = [];
      
      while (!this.isAtEnd() && this.peek().type !== TokenType.RBRACE) {
        const stmt = this.parseStatement();
        if (stmt) statements.push(stmt);
      }
      
      this.expect(TokenType.RBRACE, "Expected '}'");
      return statements;
    } catch (error) {
      console.error("Error in parseBlock:", error);
      throw error;
    }
  }

  parseIfStatement() {
    this.expect(TokenType.LPAREN, "Expected '(' after 'if'");
    const condition = this.parseExpression();
    this.expect(TokenType.RPAREN, "Expected ')' after if condition");

    const thenBranch = this.parseBlock();

    let elseBranch = null;
    if (this.match(TokenType.ELSE)) {
      elseBranch = this.parseBlock();
    }

    return new IfStatement(condition, thenBranch, elseBranch);
  }

  parseWhileStatement() {
    try {
      this.expect(TokenType.LPAREN, "Expected '(' after 'while'");
      const condition = this.parseExpression();
      this.expect(TokenType.RPAREN, "Expected ')' after while condition");
      const body = this.parseBlock();
      return new WhileStatement(condition, body);
    } catch (error) {
      console.error("Error in parseWhileStatement:", error);
      throw error;
    }
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
        if (expr instanceof Identifier && expr.value === 'print') {
          expr = new Identifier('console.log');
        }
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
    
    if (this.match(TokenType.LBRACKET)) {
      const elements = [];
      if (!this.match(TokenType.RBRACKET)) {
        do {
          elements.push(this.parseExpression());
        } while (this.match(TokenType.COMMA));
        this.expect(TokenType.RBRACKET, "Expected ']' after array elements");
      }
      return new ArrayExpression(elements);
    }
    
    if (this.match(TokenType.IDENTIFIER)) {
      return new Identifier(this.previous().value);
    }
    
    if (this.match(TokenType.LPAREN)) {
      const expr = this.parseExpression();
      this.expect(TokenType.RPAREN, "Expected ')' after expression");
      return new GroupingExpression(expr);
    }
    
    throw new Error(`Unexpected token: ${this.peek().type}`);
  }

  parsePostfix() {
    let expr = this.parsePrimary();
    
    while (true) {
      if (this.match(TokenType.LBRACKET)) {
        const index = this.parseExpression();
        this.expect(TokenType.RBRACKET, "Expected ']' after array index");
        expr = new ArrayAccessExpression(expr, index);
      } else if (this.match(TokenType.DOT)) {
        const property = this.expect(TokenType.IDENTIFIER, "Expected property name after '.'").value;
        expr = new PropertyExpression(expr, property);
      } else {
        break;
      }
    }
    
    return expr;
  }
}
