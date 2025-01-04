.PHONY: all clean run-examples

# Run all examples
all: clean run-examples

# Run examples
run-examples: clean
	@echo "Running Calculator Example..."
	node runner.js examples/calculatorClass.oglang
	@echo "\nRunning String Utils Example..."
	node runner.js examples/stringUtils.oglang
	@echo "\nRunning Functions Example..."
	node runner.js examples/functions.oglang
	@echo "\nRunning Array Operations Example..."
	node runner.js examples/arrayOperations.oglang
	@echo "\nRunning Math Operations Example..."
	node runner.js examples/mathOperations.oglang
	@echo "\nRunning Text Processing Example..."
	node runner.js examples/textProcessing.oglang
	@echo "\nRunning Fibonacci Example..."
	node runner.js examples/fibonacci.oglang

# Run a single example
run-%: clean
	@echo "Running $* Example..."
	node runner.js examples/$*.oglang

# Clean generated JS files
clean:
	@echo "Cleaning generated JS files..."
	@rm -f examples/*.js 