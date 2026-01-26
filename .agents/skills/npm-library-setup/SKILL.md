---
name: npm-library-setup
description: Comprehensive guidance on setting up npm libraries with package.json, with a preference for ES Modules (ESM). Use when setting up npm packages, configuring ESM, TypeScript packages, or React component libraries.
---

# npm Library Setup with ESM

This skill provides comprehensive guidance on setting up an npm library with `package.json`, with a preference for ES Modules (ESM).

## Overview

This skill helps you create npm packages that:
- Use ES Modules (ESM) with `"type": "module"`
- Configure modern `exports` field (no deprecated `module` field)
- Use bunchee for zero-config bundling
- Use vitest for modern testing
- Support TypeScript and React component libraries

## When to Use This Skill

**Use when:**
- "Set up an npm package"
- "Create a new npm library"
- "Configure package.json for ESM"
- "Set up a TypeScript npm package"
- "Create a React component library"

**Categories covered:**
- Basic package setup with ESM
- TypeScript package configuration
- React component library setup
- Build configuration with bunchee
- Testing setup with vitest

## Quick Start

1. Initialize your package:
   ```bash
   npm init -y
   ```

2. Configure for ESM by adding `"type": "module"` to `package.json`

3. Install build and test tools:
   ```bash
   npm install -D bunchee vitest
   ```

4. Create your source files in `src/` and run `npm run build`

## Essential Configuration

### package.json

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
    "test": "vitest",
    "test:run": "vitest run"
  },
  "engines": {
    "node": ">=20"
  }
}
```

**Note:** Use the oldest currently-maintained LTS version (check [Node.js Release Schedule](https://github.com/nodejs/Release)).

### Key Principles

1. **ESM-first**: Use `"type": "module"` for pure ESM packages
2. **Modern exports**: Use `exports` field instead of deprecated `module` field
3. **Zero-config bundling**: Bunchee handles most configuration automatically
4. **File extensions**: Use explicit `.js` extensions in imports (even in TypeScript)
5. **Kebab-case files**: Use kebab-case for file paths

## TypeScript Setup

Install TypeScript and configure:

```bash
npm install -D typescript @types/node
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "NodeNext",
    "declaration": true,
    "strict": true
  }
}
```

Bunchee automatically compiles TypeScript and generates `.d.ts` files.

## React Component Libraries

Install React as dev dependency:

```bash
npm install -D react @types/react
```

Configure `peerDependencies`:

```json
{
  "peerDependencies": {
    "react": "*"
  }
}
```

## Best Practices

1. ✅ Use `exports` field (no deprecated `module` field)
2. ✅ Use explicit file extensions in imports (`.js`)
3. ✅ Use kebab-case for file paths
4. ✅ Separate runtime dependencies from dev dependencies
5. ✅ Specify Node.js version using oldest maintained LTS
6. ✅ Write source in ESM syntax

## Common Patterns

### ESM Import/Export

```javascript
// Named exports
export function greet(name) {
  return "Hello, " + name + "!";
}

// Default export
export default class MyLibrary {}

// Import
import { greet } from './module.js';
import MyLibrary from './MyLibrary.js';
```

**Important:** Always use `.js` extension in imports, even in TypeScript files.

### File Structure

```
my-package/
├── package.json
├── src/
│   ├── index.js         # or index.ts
│   └── helpers.js
├── dist/                # Build output
└── README.md
```

## References

See `references/` directory for detailed guides:
- Getting Started
- Package.json Configuration
- ESM Syntax and Patterns
- Building and Testing
- TypeScript Packages
- React Packages
- Best Practices

## Examples

See `examples/` directory for complete working examples:
- JavaScript ESM package
- TypeScript ESM package

## Additional Resources

- [Node.js Release Schedule](https://github.com/nodejs/Release) - Check oldest maintained LTS
- [Bunchee Documentation](https://github.com/huozhi/bunchee) - Build tool
- [Vitest Documentation](https://vitest.dev) - Test runner
