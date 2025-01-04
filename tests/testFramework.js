class TestFramework {
    constructor() {
        this.beforeEachFn = null;
        this.tests = new Map();
        this.currentGroup = null;

        // Bind methods to preserve this context
        this.describe = this.describe.bind(this);
        this.beforeEach = this.beforeEach.bind(this);
        this.test = this.test.bind(this);
        this.expect = this.expect.bind(this);
        this.runTests = this.runTests.bind(this);
    }

    describe(groupName, fn) {
        this.currentGroup = groupName;
        console.log(`\n🧪 Test Group: ${groupName}`);
        fn();
        this.currentGroup = null;
    }

    beforeEach(fn) {
        this.beforeEachFn = fn;
    }

    test(testName, fn) {
        const fullTestName = this.currentGroup ? `${this.currentGroup} - ${testName}` : testName;
        this.tests.set(fullTestName, { fn, name: testName });
    }

    expect(actual) {
        return {
            toBe: (expected) => {
                if (actual !== expected) {
                    throw new Error(`Expected ${expected} but got ${actual}`);
                }
                return true;
            },
            toEqual: (expected) => {
                const actualStr = JSON.stringify(actual);
                const expectedStr = JSON.stringify(expected);
                if (actualStr !== expectedStr) {
                    throw new Error(`Expected ${expectedStr} but got ${actualStr}`);
                }
                return true;
            },
            toThrow: (errorType) => {
                try {
                    actual();
                    throw new Error('Expected function to throw but it did not');
                } catch (e) {
                    if (errorType && !(e instanceof errorType)) {
                        throw new Error(`Expected ${errorType.name} but got ${e.constructor.name}`);
                    }
                    return true;
                }
            }
        };
    }

    async runTests() {
        let passed = 0;
        let failed = 0;
        
        console.log('\n🚀 Starting Tests...\n');

        for (const [fullTestName, test] of this.tests) {
            try {
                if (this.beforeEachFn) {
                    await this.beforeEachFn();
                }
                await test.fn();
                console.log(`✅ PASS: ${test.name}`);
                passed++;
            } catch (error) {
                console.log(`❌ FAIL: ${test.name}`);
                console.log(`   Error: ${error.message}`);
                failed++;
            }
        }

        console.log(`\n📊 Test Results:`);
        console.log(`   Total: ${this.tests.size}`);
        console.log(`   Passed: ${passed}`);
        console.log(`   Failed: ${failed}`);
        
        return failed === 0;
    }
}

const framework = new TestFramework();
export { framework };
export const { describe, test, expect, beforeEach } = framework; 