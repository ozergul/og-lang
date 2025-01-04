import { describe, test, expect, beforeEach, framework } from './testFramework.js';
import { generateCode } from '../codeGenerator.js';

describe('Binary Operations', () => {
    test('should generate correct arithmetic operations', () => {
        const ast = {
            declarations: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'BinaryOperation',
                    left: { type: 'NumberLiteral', value: 5 },
                    operator: '+',
                    right: { type: 'NumberLiteral', value: 3 }
                }
            }]
        };
        
        const code = generateCode(ast);
        expect(code.includes('(5 + 3)')).toBe(true);
    });
});

describe('Variable Declarations', () => {
    test('should generate let for mutable variables', () => {
        const ast = {
            declarations: [{
                type: 'VariableDeclaration',
                name: 'x',
                init: { type: 'NumberLiteral', value: 42 },
                mutable: true
            }]
        };
        
        const code = generateCode(ast);
        expect(code.includes('let x = 42;')).toBe(true);
    });

    test('should generate const for immutable variables', () => {
        const ast = {
            declarations: [{
                type: 'VariableDeclaration',
                name: 'x',
                init: { type: 'NumberLiteral', value: 42 },
                mutable: false
            }]
        };
        
        const code = generateCode(ast);
        expect(code.includes('const x = 42;')).toBe(true);
    });
});

describe('Function Declarations', () => {
    test('should generate function with parameters and type checks', () => {
        const ast = {
            declarations: [{
                type: 'FunctionDeclaration',
                name: 'add',
                params: [
                    { name: 'a', type: 'number' },
                    { name: 'b', type: 'number' }
                ],
                returnType: 'number',
                body: [{
                    type: 'ReturnStatement',
                    value: {
                        type: 'BinaryOperation',
                        left: { type: 'Identifier', value: 'a' },
                        operator: '+',
                        right: { type: 'Identifier', value: 'b' }
                    }
                }]
            }]
        };
        
        const code = generateCode(ast);
        expect(code.includes('function add(a, b)')).toBe(true);
        expect(code.includes('_runtime.checkType(a, "number")')).toBe(true);
        expect(code.includes('_runtime.checkType(b, "number")')).toBe(true);
        expect(code.includes('return _runtime.checkType')).toBe(true);
    });
});

describe('Class Declarations', () => {
    test('should generate class with methods and properties', () => {
        const ast = {
            declarations: [{
                type: 'ClassDeclaration',
                name: 'Calculator',
                properties: [
                    { name: 'result', init: { type: 'NumberLiteral', value: 0 } }
                ],
                methods: [{
                    name: 'add',
                    params: [{ name: 'x', type: 'number' }],
                    returnType: 'number',
                    body: [{
                        type: 'ExpressionStatement',
                        expression: {
                            type: 'AssignmentExpression',
                            target: {
                                type: 'PropertyExpression',
                                object: { type: 'ThisExpression' },
                                property: { value: 'result' }
                            },
                            operator: '=',
                            value: {
                                type: 'BinaryOperation',
                                left: {
                                    type: 'PropertyExpression',
                                    object: { type: 'ThisExpression' },
                                    property: { value: 'result' }
                                },
                                operator: '+',
                                right: { type: 'Identifier', value: 'x' }
                            }
                        }
                    }]
                }]
            }]
        };
        
        const code = generateCode(ast);
        expect(code.includes('class Calculator')).toBe(true);
        expect(code.includes('constructor()')).toBe(true);
        expect(code.includes('this.result = 0')).toBe(true);
        expect(code.includes('add(x)')).toBe(true);
        expect(code.includes('_runtime.checkType(x, "number")')).toBe(true);
    });
});

describe('Control Flow', () => {
    test('should generate if statement with condition', () => {
        const ast = {
            declarations: [{
                type: 'IfStatement',
                condition: {
                    type: 'BinaryOperation',
                    left: { type: 'Identifier', value: 'x' },
                    operator: '>',
                    right: { type: 'NumberLiteral', value: 0 }
                },
                thenBranch: [{
                    type: 'ReturnStatement',
                    value: { type: 'StringLiteral', value: 'positive' }
                }],
                elseBranch: [{
                    type: 'ReturnStatement',
                    value: { type: 'StringLiteral', value: 'negative' }
                }]
            }]
        };
        
        const code = generateCode(ast);
        expect(code.includes('if ((x > 0))')).toBe(true);
        expect(code.includes('return "positive"')).toBe(true);
        expect(code.includes('return "negative"')).toBe(true);
    });

    test('should generate while loop', () => {
        const ast = {
            declarations: [{
                type: 'WhileStatement',
                condition: {
                    type: 'BinaryOperation',
                    left: { type: 'Identifier', value: 'i' },
                    operator: '<',
                    right: { type: 'NumberLiteral', value: 10 }
                },
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'AssignmentExpression',
                        target: { type: 'Identifier', value: 'i' },
                        operator: '=',
                        value: {
                            type: 'BinaryOperation',
                            left: { type: 'Identifier', value: 'i' },
                            operator: '+',
                            right: { type: 'NumberLiteral', value: 1 }
                        }
                    }
                }]
            }]
        };
        
        const code = generateCode(ast);
        expect(code.includes('while ((i < 10))')).toBe(true);
        expect(code.includes('i = (i + 1)')).toBe(true);
    });
});

// Run the tests
framework.runTests(); 