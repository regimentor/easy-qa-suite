## Additional Documentation
- [Official Bun testing documentation](https://bun.sh/docs/cli/test)
- [Testing API documentation](https://bun.sh/docs/api/testing)

# Tests for EasyQASuite Backend

This directory contains tests for the EasyQASuite backend, using the built-in Bun.sh test runner.

## Directory Structure

```
tests/
  ├─ mocks/              # Mocks used in tests
  ├─ services/           # Tests for services
```

## Running Tests

You can run tests using the built-in Bun test runner:

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run a specific test file
bun test tests/services/user.service.test.ts

# Using the helper script
./tests/run-tests.sh             # Run all tests
./tests/run-tests.sh --watch     # Run in watch mode
./tests/run-tests.sh services    # Run all tests in the services directory
```

## Writing Tests

Tests are written using the built-in Bun test runner. Each test file should:

1. Import the necessary test utilities from 'bun:test'
2. Mock external dependencies
3. Import the module being tested
4. Define test cases using the `describe` and `test` functions

Example:

```typescript
import { describe, test, expect, mock } from 'bun:test';

// Create a mock
const repoMock = {
  findById: mock(async () => ({ id: 1, name: 'test' }))
};

// Mock a module using mock.module
mock.module('../repositories/some-repo', () => ({
  someRepo: repoMock
}));

// Import the module being tested
const { someService } = await import('../services/some-service');

describe('someService', () => {
  test('should correctly process data', async () => {
    // Arrange - preparation
    const input = 'test-id';

    // Act - action
    const result = await someService.doSomething(input);

    // Assert - verification
    expect(repoMock.findById).toHaveBeenCalledWith(input);
    expect(result).toEqual({ processed: true, data: { id: 1, name: 'test' } });
  });
});
```

## Mocking

For mocking, built-in Bun tools are used:

```typescript
import { mock } from 'bun:test';

// Creating a simple mock
const simpleMock = mock(() => 'mocked value');

// Checking calls
expect(simpleMock).toHaveBeenCalled();
expect(simpleMock).toHaveBeenCalledWith(expectedArg);
expect(simpleMock).toHaveBeenCalledTimes(1);

// Configuring mock behavior
simpleMock.mockImplementation(() => 'new mocked value');

// Mocking modules using mock.module
mock.module('./path/to/module', () => ({
  exportedFunction: mock(() => 'mocked'),
  exportedObject: { property: 'value' }
}));
```

## Testing Best Practices

1. Follow the AAA pattern: Arrange, Act, Assert
2. Mock external dependencies to isolate the code being tested
3. Use `mock.resetMocks()` between tests to reset the state of mocks
4. Give tests descriptive names that explain the expected behavior
5. Write both positive and negative test scenarios
6. Group related tests using `describe`
7. Use helper functions from `setup.ts` to create test data

## Testing Features with Bun

1. Bun has a built-in test runner with excellent performance
2. The `mock()` function from `bun:test` creates mocks with call inspection capabilities
3. `mock.module()` is used to mock modules
4. Use `spyOn()` to create spies on existing object methods
5. Bun automatically runs tests in parallel, speeding up the testing process
