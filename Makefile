.PHONY: all clean run-examples

# Tüm örnekleri çalıştır
all: clean run-examples

# Örnekleri çalıştır
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

# Tek bir örneği çalıştır
run-%: clean
	@echo "Running $* Example..."
	node runner.js examples/$*.oglang

# Oluşturulan JS dosyalarını temizle
clean:
	@echo "Cleaning generated JS files..."
	@rm -f examples/*.js 