# Dual Package (CJS + ESM)

This guide covers setting up an npm library that supports both CommonJS (CJS) and ES Modules (ESM).

## Overview

A dual package provides both CJS and ESM outputs, allowing your package to work with:
- Legacy tools using `require()` (CommonJS)
- Modern tools using `import` (ES Modules)

**Note:** For modern packages, ESM-only is recommended (simpler, cleaner). Use dual packages only when you need to support legacy consumers.

## When to Use Dual Package

- ✅ You need to support legacy Node.js tools that use `require()`
- ✅ You want maximum compatibility across different build tools
- ✅ You're migrating an existing CJS package to ESM gradually

**Consider ESM-only instead if:**
- Your consumers are modern (Node.js >= 18)
- You want simpler build configuration
- You prefer the modern standard

## Prerequisites

- Node.js >= 12.22 (for conditional exports support; ideally use maintained LTS)
- Bunchee for building both formats

## Step 1: Install Bunchee

```bash
npm install -D bunchee
```

## Step 2: Configure package.json

Update your `package.json` to support dual exports:

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "description": "Dual package supporting CJS and ESM",
  "type": "module",
  "main": "./dist/cjs/index.cjs",
  "module": "./dist/esm/index.mjs",
  "types": "./dist/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/types/index.d.ts",
      "import": "./dist/esm/index.mjs",
      "require": "./dist/cjs/index.cjs"
    },
    "./package.json": "./package.json"
  },
  "files": ["dist"],
  "scripts": {
    "build": "bunchee ./src/index.ts --format cjs,esm --out-dir dist",
    "test": "vitest"
  },
  "devDependencies": {
    "bunchee": "latest",
    "vitest": "^2.0.0"
  },
  "engines": {
    "node": ">=20"
  }
}
```

### Key Fields Explained

- `type: "module"` - Treats `.js` files as ESM by default
- `main` - Points to CJS entry for `require()` consumers
- `module` - Legacy field pointing to ESM entry (used by some bundlers)
- `exports` - Modern conditional exports:
  - `"import"` - Used when consumer uses `import`
  - `"require"` - Used when consumer uses `require()`
  - `"types"` - TypeScript definitions

## Step 3: Build Configuration

Bunchee supports building both formats in one command:

```json
{
  "scripts": {
    "build": "bunchee ./src/index.ts --format cjs,esm --out-dir dist"
  }
}
```

This generates:
- `dist/cjs/index.cjs` - CommonJS output
- `dist/esm/index.mjs` - ES Module output
- `dist/types/index.d.ts` - TypeScript definitions (if using TS)

### Build Output Structure

```
dist/
├── cjs/
│   └── index.cjs      # CommonJS bundle
├── esm/
│   └── index.mjs      # ES Module bundle
└── types/
    └── index.d.ts     # TypeScript definitions (if using TS)
```

## Step 4: File Extensions

**Important:** Use explicit file extensions to avoid ambiguity:

- **`.cjs`** - For CommonJS output (always CJS, regardless of `type` field)
- **`.mjs`** - For ES Module output (always ESM, regardless of `type` field)

This ensures Node.js resolves modules correctly regardless of `package.json` `type` field.

## Step 5: Write Source Code

Write your source code in ESM syntax (`import`/`export`). Let bunchee compile to CJS:

```javascript
// src/index.js
export function greet(name) {
  return `Hello, ${name}!`;
}

export const version = '1.0.0';

export default class MyLibrary {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return greet(this.name);
  }
}
```

**Don't mix formats in source** - Avoid `require()` or `module.exports` in your source files. Use ESM syntax and let the build tool handle compilation.

## Step 6: TypeScript Configuration (if using TS)

If using TypeScript, configure `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "types": ["node", "vitest/globals"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

Bunchee will handle TypeScript compilation and generate both CJS and ESM outputs automatically.

## Step 7: Build

Run the build:

```bash
npm run build
```

This creates both formats in the `dist/` directory.

## Step 8: Testing Both Formats

Test both CJS and ESM imports to ensure they work:

### Test CJS Import

```javascript
// test-cjs.js
const { greet, version } = require('./dist/cjs/index.cjs');
const MyLibrary = require('./dist/cjs/index.cjs').default;

console.log(greet('World')); // Hello, World!
console.log(version); // 1.0.0

const lib = new MyLibrary('CJS');
console.log(lib.greet()); // Hello, CJS!
```

### Test ESM Import

```javascript
// test-esm.mjs (or .js with type: module)
import { greet, version } from './dist/esm/index.mjs';
import MyLibrary from './dist/esm/index.mjs';

console.log(greet('World')); // Hello, World!
console.log(version); // 1.0.0

const lib = new MyLibrary('ESM');
console.log(lib.greet()); // Hello, ESM!
```

### Vitest Test Example

```javascript
// src/index.test.js
import { describe, it, expect } from 'vitest';
import { greet, version } from './index.js';
import MyLibrary from './index.js';

describe('greet', () => {
  it('should work in ESM', () => {
    expect(greet('World')).toBe('Hello, World!');
  });
});
```

## Common Pitfalls

### 1. Dual Package Hazard

If your code uses singletons, module-level state, or `instanceof` checks, you might get inconsistent behavior because CJS and ESM versions load separate instances.

**Solution:** Avoid module-level state or ensure state is shared through a separate module.

### 2. File Extension Ambiguity

Avoid using ambiguous `.js` extensions for outputs. Always use `.cjs` for CJS and `.mjs` for ESM.

**Solution:** Configure bunchee to use explicit extensions:

```bash
bunchee ./src/index.ts --format cjs,esm --out-dir dist --ext cjs,mjs
```

### 3. Default Exports

CommonJS handles default exports differently than ESM. Test both formats.

**Solution:** Prefer named exports, or ensure default export interop works correctly.

### 4. `__dirname` and `__filename`

These are not available in ESM. Use `import.meta.url` in ESM code.

**Solution:** Write code that works in both, or use build-time replacements:

```javascript
// Works in both CJS and ESM
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

## Best Practices

1. ✅ **Use explicit file extensions** (`.cjs`, `.mjs`)
2. ✅ **Write source in ESM syntax** - Let bunchee compile to CJS
3. ✅ **Test both formats** - Ensure `require()` and `import` work
4. ✅ **Use conditional exports** - Leverage `exports` field
5. ✅ **Keep it simple** - If you don't need CJS, use ESM-only

## Package Structure

```
my-package/
├── package.json
├── tsconfig.json        # if using TS
├── src/
│   ├── index.js         # or index.ts
│   └── index.test.js
└── dist/                # Build output
    ├── cjs/
    │   └── index.cjs
    ├── esm/
    │   └── index.mjs
    └── types/
        └── index.d.ts   # if using TS
```

## Consumer Usage

After publishing, consumers can use either format:

### CommonJS

```javascript
const { greet, version } = require('my-package');
const MyLibrary = require('my-package').default;
```

### ES Modules

```javascript
import { greet, version } from 'my-package';
import MyLibrary from 'my-package';
```

Node.js and bundlers will automatically resolve to the correct format based on how it's imported.

## Summary

- Use dual packages only when you need to support legacy `require()` consumers
- Configure `exports` with both `"import"` and `"require"` conditions
- Use explicit file extensions (`.cjs`, `.mjs`)
- Write source in ESM syntax
- Test both formats
- Consider ESM-only for modern packages

For pure ESM packages, see [Getting Started](./01-getting-started.md).
