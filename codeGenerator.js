// codeGenerator.js
export function generateCode(ast) {
  let code = `
// Runtime library
const _runtime = {
    checkType: function(value, type) {
        switch(type) {
            case 'number':
                if (typeof value !== 'number') throw new TypeError(\`Expected number, got \${typeof value}\`);
                break;
            case 'string':
                if (typeof value !== 'string') throw new TypeError(\`Expected string, got \${typeof value}\`);
                break;
        }
        return value;
    }
};

`;

  // Convert AST to JavaScript code
  for (const decl of ast.declarations) {
    code += generateDeclaration(decl) + "\n";
  }

  // Export main function
  code += "\nexport { main };\n";

  return code;
}

function generateDeclaration(decl) {
  switch (decl.type) {
    case 'ClassDeclaration':
      return generateClassDeclaration(decl);
    case 'FunctionDeclaration':
      return generateFunctionDeclaration(decl);
    case 'VariableDeclaration':
      return generateVariableDeclaration(decl);
    case 'ExpressionStatement':
    case 'BlockStatement':
    case 'IfStatement':
    case 'WhileStatement':
    case 'ReturnStatement':
      return generateStatement(decl);
    default:
      throw new Error(`Unknown declaration type: ${decl.type}`);
  }
}

function generateClassDeclaration(decl) {
  let code = `class ${decl.name} {\n`;
  
  // Constructor
  code += "  constructor() {\n";
  for (const prop of decl.properties) {
    code += `    this.${prop.name} = ${prop.init ? generateExpression(prop.init) : 'null'};\n`;
  }
  code += "  }\n\n";
  
  // Methods
  for (const method of decl.methods) {
    code += generateMethodDeclaration(method);
  }
  
  code += "}\n";
  return code;
}

function generateMethodDeclaration(method) {
  let code = "  ";
  if (method.isStatic) code += "static ";
  code += `${method.name}(${method.params.map(p => p.name).join(", ")}) {\n`;
  
  // Add parameter type checks
  for (const param of method.params) {
    code += `    _runtime.checkType(${param.name}, "${param.type}");\n`;
  }
  
  // Method body
  for (const stmt of method.body) {
    code += "    " + generateStatement(stmt) + "\n";
  }
  
  code += "  }\n\n";
  return code;
}

function generateFunctionDeclaration(decl) {
  let code = `function ${decl.name}(${decl.params.map(p => p.name).join(", ")}) {\n`;
  
  // Add parameter type checks
  for (const param of decl.params) {
    code += `  _runtime.checkType(${param.name}, "${param.type}");\n`;
  }
  
  // Function body
  for (const stmt of decl.body) {
    code += "  " + generateStatement(stmt) + "\n";
  }
  
  code += "}\n";
  return code;
}

function generateStatement(stmt) {
  switch (stmt.type) {
    case 'BlockStatement':
      return generateBlockStatement(stmt);
    case 'IfStatement':
      return generateIfStatement(stmt);
    case 'WhileStatement':
      return generateWhileStatement(stmt);
    case 'ReturnStatement':
      return `return ${generateExpression(stmt.value)};`;
    case 'ExpressionStatement':
      return generateExpression(stmt.expression) + ";";
    case 'VariableDeclaration':
      return generateVariableDeclaration(stmt);
    default:
      throw new Error(`Unknown statement type: ${stmt.type}`);
  }
}

function generateBlockStatement(stmt) {
  let code = "{\n";
  for (const s of stmt.statements) {
    code += "  " + generateStatement(s) + "\n";
  }
  code += "}";
  return code;
}

function generateIfStatement(stmt) {
  let code = `if (${generateExpression(stmt.condition)}) {\n`;
  for (const s of stmt.thenBranch) {
    code += "  " + generateStatement(s) + "\n";
  }
  code += "}";
  
  if (stmt.elseBranch) {
    code += ` else {\n`;
    for (const s of stmt.elseBranch) {
      code += "  " + generateStatement(s) + "\n";
    }
    code += "}";
  }
  
  return code;
}

function generateWhileStatement(stmt) {
  let code = `while (${generateExpression(stmt.condition)}) {\n`;
  for (const s of stmt.body) {
    code += "  " + generateStatement(s) + "\n";
  }
  code += "}";
  return code;
}

function generateVariableDeclaration(decl) {
  // Use let if the variable will be modified later or is declared as mutable
  const keyword = decl.mutable || isReassigned(decl.name) ? 'let' : 'const';
  const initValue = generateExpression(decl.init);
  return `${keyword} ${decl.name} = ${initValue};`;
}

// Check if a variable is reassigned later
function isReassigned(varName) {
  // For now, consider all variables as mutable
  // TODO: Add real analysis
  return true;
}

function generateExpression(expr) {
  switch (expr.type) {
    case 'BinaryOperation':
      return `(${generateExpression(expr.left)} ${expr.operator} ${generateExpression(expr.right)})`;
    case 'LogicalOperation':
      return `(${generateExpression(expr.left)} ${expr.operator} ${generateExpression(expr.right)})`;
    case 'UnaryOperation':
      return `(${expr.operator}${generateExpression(expr.operand)})`;
    case 'CallExpression':
      return generateCallExpression(expr);
    case 'PropertyExpression':
      return generatePropertyExpression(expr);
    case 'ArrayAccessExpression':
      return `${generateExpression(expr.array)}[${generateExpression(expr.index)}]`;
    case 'AssignmentExpression':
      return `${generateExpression(expr.target)} ${expr.operator} ${generateExpression(expr.value)}`;
    case 'Identifier':
      return expr.value;
    case 'NumberLiteral':
      return expr.value.toString();
    case 'StringLiteral':
      return `"${expr.value}"`;
    case 'BooleanLiteral':
      return expr.value.toString();
    case 'NullLiteral':
      return 'null';
    case 'ThisExpression':
      return 'this';
    case 'NewExpression':
      return `new ${expr.className}(${expr.arguments.map(generateExpression).join(", ")})`;
    default:
      throw new Error(`Unknown expression type: ${expr.type}`);
  }
}

function generateCallExpression(expr) {
  if (expr.callee.type === 'PropertyExpression') {
    return `${generateExpression(expr.callee.object)}.${expr.callee.property.value}(${expr.arguments.map(generateExpression).join(", ")})`;
  }
  return `${generateExpression(expr.callee)}(${expr.arguments.map(generateExpression).join(", ")})`;
}

function generatePropertyExpression(expr) {
  if (expr.object.type === 'ThisExpression') {
    return `this.${expr.property.value}`;
  }
  return `${generateExpression(expr.object)}.${expr.property.value}`;
}
