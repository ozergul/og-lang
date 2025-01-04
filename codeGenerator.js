// codeGenerator.js
export class CodeGenerator {
  constructor(ast) {
    this.ast = ast;
    this.mainFile = [];
    this.indentLevel = 0;
  }

  indent() {
    return "  ".repeat(this.indentLevel);
  }

  generateCode() {
    // Program içeriğini oluştur
    this.generateProgram(this.ast);

    // Tüm kodu birleştir
    const fullCode = `
// Runtime kütüphanesi
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

${this.mainFile.join("\n")}
`;
    return fullCode;
  }

  generateProgram(node) {
    for (const decl of node.declarations) {
      const code = this.generateNode(decl);
      if (code) {
        this.mainFile.push(code);
        // Her fonksiyon tanımından sonra fonksiyonu çağıran kodu ekle
        if (decl.type === "FunctionDeclaration" && decl.name === "main") {
          this.mainFile.push(`
// Programı çalıştır
(async () => {
    try {
        const result = await main();
        console.log('Sonuç:', result);
        return result;
    } catch (error) {
        console.error('Hata:', error);
        throw error;
    }
})();`);
        }
      }
    }
  }

  generateNode(node) {
    switch (node.type) {
      case "Program":
        return this.generateProgram(node);
      case "FunctionDeclaration":
        return this.generateFunction(node);
      case "VariableDeclaration":
        return this.generateVariableDeclaration(node);
      case "BlockStatement":
        return this.generateBlockStatement(node);
      case "IfStatement":
        return this.generateIfStatement(node);
      case "WhileStatement":
        return this.generateWhileStatement(node);
      case "ReturnStatement":
        return this.generateReturnStatement(node);
      case "ExpressionStatement":
        return this.generateExpressionStatement(node);
      case "BinaryOperation":
        return this.generateBinaryOperation(node);
      case "UnaryOperation":
        return this.generateUnaryOperation(node);
      case "CallExpression":
        return this.generateCallExpression(node);
      case "Identifier":
        return node.value;
      case "NumberLiteral":
        return node.value.toString();
      case "StringLiteral":
        return `"${node.value}"`;
      case "ClassDeclaration":
        return this.generateClassDeclaration(node);
      case "MethodDeclaration":
        return this.generateMethodDeclaration(node);
      case "PropertyDeclaration":
        return this.generatePropertyDeclaration(node);
      case "ThisExpression":
        return "this";
      case "NewExpression":
        return this.generateNewExpression(node);
      case "PropertyExpression":
        return this.generatePropertyExpression(node);
      case "AssignmentExpression":
        return this.generateAssignmentExpression(node);
      default:
        throw new Error(`Bilinmeyen node tipi: ${node.type}`);
    }
  }

  generateFunction(node) {
    const params = node.params.map((p) => p.name).join(", ");
    let code = `async function ${node.name}(${params}) {\n`;
    this.indentLevel++;

    // Parametre tip kontrolleri
    for (const param of node.params) {
      code += `${this.indent()}_runtime.checkType(${param.name}, "${param.type}");\n`;
    }

    // Fonksiyon gövdesi
    if (node.body.length > 0) {
      for (let i = 0; i < node.body.length; i++) {
        const stmt = this.generateNode(node.body[i]);
        if (stmt) {
          code += this.indent() + stmt;
          if (i < node.body.length - 1) {
            code += "\n";
          }
        }
      }
    }

    this.indentLevel--;
    code += `\n${this.indent()}}`;
    return code;
  }

  generateVariableDeclaration(node) {
    const keyword = node.mutable ? "let" : "let";
    const init = this.generateNode(node.init);
    if (node.valueType) {
      return `${keyword} ${node.name} = _runtime.checkType(${init}, "${node.valueType}")`;
    }
    return `${keyword} ${node.name} = ${init}`;
  }

  generateBlockStatement(node) {
    let code = "";
    if (node.statements) {
      for (let i = 0; i < node.statements.length; i++) {
        const stmt = this.generateNode(node.statements[i]);
        if (stmt) {
          code += this.indent() + stmt;
          if (i < node.statements.length - 1) {
            code += ";\n";
          }
        }
      }
    }
    return code;
  }

  generateIfStatement(node) {
    const condition = this.generateNode(node.condition);
    let code = `if (${condition}) {\n`;
    this.indentLevel++;

    // Then branch
    for (const stmt of node.thenBranch) {
      const stmtCode = this.generateNode(stmt);
      if (stmtCode) {
        code += this.indent() + stmtCode;
        if (stmt !== node.thenBranch[node.thenBranch.length - 1]) {
          code += ";\n";
        }
      }
    }

    this.indentLevel--;
    code += `\n${this.indent()}}`;

    // Else branch
    if (node.elseBranch) {
      code += ` else {\n`;
      this.indentLevel++;
      for (const stmt of node.elseBranch) {
        const stmtCode = this.generateNode(stmt);
        if (stmtCode) {
          code += this.indent() + stmtCode;
          if (stmt !== node.elseBranch[node.elseBranch.length - 1]) {
            code += ";\n";
          }
        }
      }
      this.indentLevel--;
      code += `\n${this.indent()}}`;
    }

    return code;
  }

  generateExpressionStatement(node) {
    const expr = this.generateNode(node.expression);
    if (node.expression.type === "AssignmentExpression") {
      return expr;
    }
    return `return ${expr}`;
  }

  generateBinaryOperation(node) {
    const left = this.generateNode(node.left);
    const right = this.generateNode(node.right);
    return `(${left} ${node.operator} ${right})`;
  }

  generateUnaryOperation(node) {
    const operand = this.generateNode(node.operand);
    return `(${node.operator}${operand})`;
  }

  generateReturnStatement(node) {
    const value = this.generateNode(node.value);
    return `return ${value}`;
  }

  generateCallExpression(node) {
    const callee = this.generateNode(node.callee);
    const args = node.arguments.map((arg) => this.generateNode(arg)).join(", ");
    return `await ${callee}(${args})`;
  }

  generateClassDeclaration(node) {
    let code = `class ${node.name} {\n`;
    this.indentLevel++;

    // Constructor
    code += `${this.indent()}constructor() {\n`;
    this.indentLevel++;
    
    // Initialize properties
    for (const prop of node.properties) {
      if (!prop.isStatic) {
        code += `${this.indent()}this.${prop.name} = ${prop.init ? this.generateNode(prop.init) : 'null'};\n`;
      }
    }
    
    this.indentLevel--;
    code += `${this.indent()}}\n\n`;

    // Static properties
    for (const prop of node.properties) {
      if (prop.isStatic) {
        code += this.generatePropertyDeclaration(prop);
      }
    }

    // Methods
    for (const method of node.methods) {
      code += this.indent() + this.generateMethodDeclaration(method) + "\n";
    }

    this.indentLevel--;
    code += `${this.indent()}}`;
    return code;
  }

  generateMethodDeclaration(node) {
    const prefix = node.isStatic ? "static " : "";
    const params = node.params.map((p) => p.name).join(", ");
    let code = `${prefix}async ${node.name}(${params}) {\n`;
    this.indentLevel++;

    // Parameter type checks
    for (const param of node.params) {
      code += `${this.indent()}_runtime.checkType(${param.name}, "${param.type}");\n`;
    }

    // Method body
    if (node.body.length > 0) {
      for (let i = 0; i < node.body.length; i++) {
        const stmt = this.generateNode(node.body[i]);
        if (stmt) {
          code += this.indent() + stmt;
          if (i < node.body.length - 1) {
            code += "\n";
          }
        }
      }
    }

    this.indentLevel--;
    code += `\n${this.indent()}}`;
    return code;
  }

  generatePropertyDeclaration(node) {
    if (node.isStatic) {
      return `${this.indent()}static ${node.name} = ${node.init ? this.generateNode(node.init) : 'null'};\n`;
    }
    return "";
  }

  generateNewExpression(node) {
    const args = node.arguments.map(arg => this.generateNode(arg)).join(", ");
    return `new ${node.className}(${args})`;
  }

  generatePropertyExpression(node) {
    const object = this.generateNode(node.object);
    const property = this.generateNode(node.property);
    return `${object}.${property}`;
  }

  generateAssignmentExpression(node) {
    const value = this.generateNode(node.value);
    const target = typeof node.target === 'string' ? node.target : this.generateNode(node.target);
    return `${target} = ${value}`;
  }
}
