# Best Practices

This guide covers recommended practices for setting up and maintaining npm packages with ESM.

## Package Configuration

### ✅ Do: Use `exports` Field

Use the modern `exports` field instead of deprecated `module`:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  }
}
```

### ✅ Do: Specify Node.js Version

Always specify minimum Node.js version using the oldest maintained LTS:

```json
{
  "engines": {
    "node": ">=20"  // Use oldest currently-maintained LTS (check Node.js Release Schedule)
  }
}
```

**Note:** Always check the [Node.js Release Schedule](https://github.com/nodejs/Release) to find the current oldest maintained LTS version when creating a new package.

### ✅ Do: Use Explicit File Extensions

Always include `.js` extension in imports:

```javascript
import { helper } from './helper.js'; // ✅
import { helper } from './helper';    // ❌
```

## Dependencies Management

### ✅ Do: Separate Runtime and Dev Dependencies

- `dependencies`: Code used in `src/` files (runtime)
- `devDependencies`: Build tools, test runners, type definitions

```json
{
  "dependencies": {
    "lodash": "^4.17.21"  // Used in src/index.js
  },
  "devDependencies": {
    "bunchee": "latest",  // Build tool
    "vitest": "^2.0.0"     // Test runner
  }
}
```

### ❌ Don't: Put Runtime Dependencies in devDependencies

If you use a package in your source code, it must be in `dependencies`, not `devDependencies`. Even if it's bundled, users might need it at runtime.

## File Organization

### ✅ Do: Organize Source Files

```
my-package/
├── package.json
├── src/
│   ├── index.js       # Main entry
│   ├── utils/
│   │   └── helper.js
│   └── types/
│       └── index.d.ts
├── dist/              # Build output (gitignored)
├── tests/             # Test files (optional)
│   └── index.test.js
└── README.md
```

### ✅ Do: Gitignore Build Output

Add to `.gitignore`:

```
dist/
node_modules/
*.log
```

## Build and Publish

### ✅ Do: Build Before Publish

Use `prepublishOnly` hook:

```json
{
  "scripts": {
    "prepublishOnly": "npm run build && npm run test:run"
  }
}
```

### ✅ Do: Specify Files to Publish

Limit published files to essentials:

```json
{
  "files": ["dist", "README.md", "LICENSE"]
}
```

## Code Quality

### ✅ Do: Use TypeScript Definitions

Even if not using TypeScript, consider providing `.d.ts` files:

```json
{
  "types": "./dist/index.d.ts"
}
```

### ✅ Do: Use ESM for Modern Packages

For pure ESM packages, bunchee outputs only ESM by default, which is the modern standard:

```bash
npm run build
# Outputs: dist/index.js (ESM only)
```

**Note:** If you need CommonJS support for compatibility, you can configure bunchee to output both formats, but for modern packages, ESM-only is recommended.

### ✅ Do: Write Tests

Always include tests:

```bash
npm install -D vitest
```

## Documentation

### ✅ Do: Write Clear README

Include:
- Installation instructions
- Usage examples
- API documentation
- Minimum Node.js version

### ✅ Do: Document Breaking Changes

Use semantic versioning and document breaking changes in CHANGELOG.md.

## Security

### ✅ Do: Keep Dependencies Updated

Regularly update dependencies:

```bash
npm outdated
npm update
```

### ✅ Do: Review Dependencies

Audit for security vulnerabilities:

```bash
npm audit
npm audit fix
```

## Performance

### ✅ Do: Use Tree-Shaking Friendly Exports

Export individual functions for better tree-shaking:

```javascript
// ✅ Good - tree-shakeable
export function helper1() {}
export function helper2() {}

// ❌ Less optimal - bundles everything
export default {
  helper1() {},
  helper2() {}
};
```

### ✅ Do: Minimize Bundle Size

Consider what dependencies are truly necessary and if they can be made optional.

## Common Mistakes to Avoid

1. ❌ Using deprecated `module` field - use `exports` instead
2. ❌ Forgetting file extensions in imports
3. ❌ Putting runtime dependencies in `devDependencies`
4. ❌ Not specifying Node.js version requirement
5. ❌ Publishing entire `src/` directory instead of `dist/`
6. ❌ Not running tests before publishing
7. ❌ Missing TypeScript definitions when using TypeScript

## Examples

See the [example package](../examples/example-package/) for a complete implementation following these best practices.
