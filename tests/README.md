# Testing

This project uses [Vitest](https://vitest.dev/) for unit testing JavaScript components.

## Running Tests

### Quick Commands

```bash
# Run tests once
yarn test:run
make test

# Run tests in watch mode (auto-rerun on file changes)
yarn test
make test-watch

# Run tests with coverage
yarn test:coverage
make test-coverage

# Run tests with UI
yarn test:ui
make test-ui

# Run development mode (esbuild + tests in watch mode)
yarn dev
make dev
```

### Test Files

- Tests are located in the `tests/` directory
- Test files should end with `.test.js` or `.spec.js`
- Currently testing the CV component (`cv.test.js`)

### Coverage

Coverage reports are generated in the `coverage/` directory and include:
- HTML report at `coverage/index.html` 
- LCOV format for CI/CD integration
- Text summary in console

### CI/CD

Tests automatically run on:
- Pull requests
- Pushes to main/master branch

The GitHub Actions workflow is in `.github/workflows/test.yml` and runs tests on Node.js 20.x and 22.x.

## Test Structure

The CV component tests cover:
- Constructor initialization
- Cache management (fresh vs expired)
- LaTeX content fetching and processing
- PDF URL resolution from GitHub API
- LaTeX to HTML conversion
- DOM manipulation and display
- Error handling
- Integration scenarios

Tests use mocked DOM environment (jsdom) and fetch API for reliable, isolated testing.