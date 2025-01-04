// ast.js
class AST {
  constructor(type) {
    this.type = type;
  }
}

// Program
class Program extends AST {
  constructor(declarations) {
    super("Program");
    this.declarations = declarations;
  }
}

// Declarations
class FunctionDeclaration extends AST {
  constructor(name, params, returnType, body) {
    super("FunctionDeclaration");
    this.name = name;
    this.params = params;
    this.returnType = returnType;
    this.body = body;
  }
}

class VariableDeclaration extends AST {
  constructor(name, type, mutable, init) {
    super("VariableDeclaration");
    this.type = "VariableDeclaration";
    this.name = name;
    this.valueType = type;
    this.mutable = mutable;
    this.init = init;
  }
}

// Statements
class BlockStatement extends AST {
  constructor(statements) {
    super("BlockStatement");
    this.statements = statements;
  }
}

class IfStatement extends AST {
  constructor(condition, thenBranch, elseBranch) {
    super("IfStatement");
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseBranch = elseBranch;
  }
}

class WhileStatement extends AST {
  constructor(condition, body) {
    super("WhileStatement");
    this.condition = condition;
    this.body = body;
  }
}

class ForStatement extends AST {
  constructor(init, condition, increment, body) {
    super("ForStatement");
    this.init = init;
    this.condition = condition;
    this.increment = increment;
    this.body = body;
  }
}

class ReturnStatement extends AST {
  constructor(value) {
    super("ReturnStatement");
    this.value = value;
  }
}

class ExpressionStatement extends AST {
  constructor(expression) {
    super("ExpressionStatement");
    this.expression = expression;
  }
}

// Expressions
class BinaryOperation extends AST {
  constructor(left, operator, right) {
    super("BinaryOperation");
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
}

class UnaryOperation extends AST {
  constructor(operator, operand) {
    super("UnaryOperation");
    this.operator = operator;
    this.operand = operand;
  }
}

class LogicalOperation extends AST {
  constructor(left, operator, right) {
    super("LogicalOperation");
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
}

class AssignmentExpression extends AST {
  constructor(target, operator, value) {
    super("AssignmentExpression");
    this.target = target;
    this.operator = operator;
    this.value = value;
  }
}

class CallExpression extends AST {
  constructor(callee, args) {
    super("CallExpression");
    this.callee = callee;
    this.arguments = args;
  }
}

class GroupingExpression extends AST {
  constructor(expression) {
    super("GroupingExpression");
    this.expression = expression;
  }
}

// Literals and Identifiers
class Identifier extends AST {
  constructor(value) {
    super("Identifier");
    this.value = value;
  }
}

class NumberLiteral extends AST {
  constructor(value) {
    super("NumberLiteral");
    this.value = value;
  }
}

class StringLiteral extends AST {
  constructor(value) {
    super("StringLiteral");
    this.value = value;
  }
}

class BooleanLiteral extends AST {
  constructor(value) {
    super("BooleanLiteral");
    this.value = value;
  }
}

class NullLiteral extends AST {
  constructor() {
    super("NullLiteral");
    this.value = null;
  }
}

// Type-related nodes
class TypeAnnotation extends AST {
  constructor(name, generics = []) {
    super("TypeAnnotation");
    this.name = name;
    this.generics = generics;
  }
}

// Array ve object literal desteği
class ArrayExpression extends AST {
  constructor(elements) {
    super("ArrayExpression");
    this.elements = elements;
  }
}

class ObjectExpression extends AST {
  constructor(properties) {
    super("ObjectExpression");
    this.properties = properties;
  }
}

class PropertyExpression extends AST {
  constructor(object, property) {
    super("PropertyExpression");
    this.object = object;
    this.property = property;
  }
}

// Class-related nodes
class ClassDeclaration extends AST {
  constructor(name, methods, properties) {
    super("ClassDeclaration");
    this.name = name;
    this.methods = methods;
    this.properties = properties;
  }
}

class MethodDeclaration extends AST {
  constructor(name, params, returnType, body, isStatic = false) {
    super("MethodDeclaration");
    this.name = name;
    this.params = params;
    this.returnType = returnType;
    this.body = body;
    this.isStatic = isStatic;
  }
}

class PropertyDeclaration extends AST {
  constructor(name, type, isStatic = false, init = null) {
    super("PropertyDeclaration");
    this.name = name;
    this.type = type;
    this.isStatic = isStatic;
    this.init = init;
  }
}

class ThisExpression extends AST {
  constructor() {
    super("ThisExpression");
  }
}

class NewExpression extends AST {
  constructor(className, args) {
    super("NewExpression");
    this.className = className;
    this.arguments = args;
  }
}

class ArrayAccessExpression extends AST {
  constructor(array, index) {
    super("ArrayAccessExpression");
    this.array = array;
    this.index = index;
  }
}

// Export all classes
export {
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
  ArrayAccessExpression,
};
