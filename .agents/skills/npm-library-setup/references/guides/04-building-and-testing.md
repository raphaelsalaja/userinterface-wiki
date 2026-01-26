# Building and Testing

This guide covers using bunchee for building and vitest for testing your npm package.

## Building with Bunchee

Bunchee is a fast, **zero-config** bundler that automatically handles most configuration for you.

### Basic Setup

Install bunchee:

```bash
npm install -D bunchee
```

Add build script to `package.json`:

```json
{
  "scripts": {
    "build": "bunchee"
  }
}
```

That's it! Bunchee handles the rest automatically.

### Default Behavior

Bunchee automatically:
- Uses `src/index.js` (or `src/index.ts`) as the entry point
- Outputs to `dist/index.js` (ESM only for pure ESM packages)
- Generates TypeScript definitions (`.d.ts`) if using TypeScript
- Handles JSX/TSX if React is detected

**No configuration needed!** Just run `npm run build`.

### Build Output

After running `npm run build`, you'll have:

```
dist/
├── index.js      # ESM bundle
└── index.d.ts    # TypeScript definitions (if using TS)
```

### Advanced Configuration (Optional)

If you need custom configuration, you can use CLI options:

```json
{
  "scripts": {
    "build": "bunchee --entry src/index.js --outdir dist --format esm,cjs"
  }
}
```

Or create a `bunchee.config.js` for more complex setups (rarely needed):

```javascript
export default {
  entry: 'src/index.js',
  outdir: 'dist',
  format: ['esm', 'cjs'],
  sourcemap: true
};
```

## Testing with Vitest

Vitest is a fast Vite-native test runner with great ESM support.

### Basic Setup

Install vitest:

```bash
npm install -D vitest
```

Add test scripts to `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

### Writing Tests

Create test files with `.test.js` or `.spec.js` extension:

```javascript
// src/index.test.js
import { describe, it, expect } from 'vitest';
import { greet } from './index.js';

describe('greet', () => {
  it('should greet a user', () => {
    expect(greet('World')).toBe('Hello, World!');
  });
});
```

### Test Structure

Organize tests alongside source or in a `tests/` directory:

```
src/
├── index.js
├── index.test.js
└── utils/
    ├── helper.js
    └── helper.test.js
```

Or:

```
src/
└── index.js
tests/
└── index.test.js
```

### Vitest Configuration

Create `vitest.config.js` for custom configuration:

```javascript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});
```

### Running Tests

```bash
# Watch mode (default)
npm test

# Run once
npm run test:run

# With coverage
npx vitest run --coverage
```

### Common Test Patterns

```javascript
import { describe, it, expect, beforeEach } from 'vitest';

describe('MyLibrary', () => {
  beforeEach(() => {
    // Setup before each test
  });

  it('should work', () => {
    expect(true).toBe(true);
  });

  it('should handle errors', () => {
    expect(() => {
      throw new Error('test');
    }).toThrow();
  });
});
```

## Build + Test Workflow

Common workflow:

```json
{
  "scripts": {
    "build": "bunchee",
    "test": "vitest",
    "test:run": "vitest run",
    "prepublishOnly": "npm run build && npm run test:run"
  }
}
```

The `prepublishOnly` hook ensures tests pass and code is built before publishing.

## Examples

See [examples/example-package/](../examples/example-package/) for a complete example with bunchee and vitest configured.
