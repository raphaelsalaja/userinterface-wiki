# TypeScript Packages

This guide covers setting up an npm library with TypeScript support.

## Overview

Bunchee automatically handles TypeScript compilation and generates `.d.ts` definition files, so setup is minimal.

## Step 1: Install TypeScript

Install TypeScript as a dev dependency:

```bash
npm install -D typescript @types/node
```

## Step 2: Create tsconfig.json

Create a `tsconfig.json` file in the root:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
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

### Key Options

- `target: "ES2022"` - Output JavaScript version
- `module: "ESNext"` - Use ES modules
- `moduleResolution: "NodeNext"` - Node.js-style module resolution
- `declaration: true` - Generate `.d.ts` files
- `types: ["node", "vitest/globals"]` - Include Node.js and Vitest types

## Step 3: Update package.json

Add TypeScript-related fields:

```json
{
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "bunchee",
    "typecheck": "tsc --noEmit",
    "test": "vitest"
  },
  "devDependencies": {
    "bunchee": "latest",
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "vitest": "^2.0.0"
  }
}
```

**Important:** The `types` field points to the generated `.d.ts` file.

## Step 4: Write TypeScript Source

Create TypeScript files in `src/`:

```typescript
// src/index.ts
export function greet(name: string): string {
  return `Hello, ${name}!`;
}

export interface GreetingOptions {
  prefix?: string;
  suffix?: string;
}

export class Greeter {
  constructor(private name: string) {}

  greet(): string {
    return `Hello, ${this.name}!`;
  }
}
```

**Note:** In TypeScript files, you still use `.js` extensions in imports:

```typescript
// ✅ Correct
import { helper } from './helper.js';

// ❌ Wrong
import { helper } from './helper';
```

## Step 5: Build

Bunchee automatically:
- Compiles TypeScript to JavaScript
- Generates `.d.ts` files
- Creates ESM output (for pure ESM packages)

```bash
npm run build
```

Output:
```
dist/
├── index.js      # ESM bundle
├── index.d.ts    # TypeScript definitions
└── index.d.ts.map
```

## Type Checking

Add a typecheck script to catch type errors:

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit"
  }
}
```

Run type checking without emitting files:

```bash
npm run typecheck
```

## Testing TypeScript with Vitest

Vitest works seamlessly with TypeScript. Create test files with `.test.ts`:

```typescript
// src/index.test.ts
import { describe, it, expect } from 'vitest';
import { greet, Greeter } from './index.js';

describe('greet', () => {
  it('should greet a user', () => {
    expect(greet('World')).toBe('Hello, World!');
  });
});
```

Ensure `vitest/globals` is in your `tsconfig.json` types array for global test functions.

## Examples

See [examples/example-ts-package/](../examples/example-ts-package/) for a complete TypeScript package example.
