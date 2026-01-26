# Package.json Configuration

This guide explains the essential fields for configuring an ESM npm package.

## Essential Fields

### `type: "module"`

Enables ES Modules for all `.js` files:

```json
{
  "type": "module"
}
```

Without this, Node.js treats `.js` files as CommonJS by default.

### Entry Points

#### `main` (Legacy Support)

The main entry point for CommonJS require():

```json
{
  "main": "./dist/index.js"
}
```

#### `exports` (Modern, Recommended)

The modern way to define package entry points. Supports conditional exports:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./utils": {
      "types": "./dist/utils.d.ts",
      "default": "./dist/utils.js"
    },
    "./package.json": "./package.json"
  }
}
```

**Note:** Do not use the deprecated `"module"` field. Use `exports` instead.

#### `types` (TypeScript)

TypeScript definition file location:

```json
{
  "types": "./dist/index.d.ts"
}
```

### Files to Publish

#### `files`

Specifies which files to include in the npm package:

```json
{
  "files": ["dist", "README.md", "LICENSE"]
}
```

If omitted, npm includes everything except patterns in `.npmignore` or `.gitignore`.

### Scripts

Common scripts for development and publishing:

```json
{
  "scripts": {
    "build": "bunchee",
    "test": "vitest",
    "test:run": "vitest run",
    "dev": "vitest watch",
    "prepublishOnly": "npm run build"
  }
}
```

- `build`: Build the package using bunchee
- `test`: Run tests in watch mode
- `test:run`: Run tests once
- `prepublishOnly`: Automatically runs before `npm publish`

### Node.js Version

#### `engines`

Specify minimum Node.js version using the **oldest currently-maintained LTS** for maximum compatibility:

```json
{
  "engines": {
    "node": ">=20"  // Use oldest maintained LTS (check Node.js Release Schedule)
  }
}
```

**How to find the oldest maintained LTS:**
1. Check the [Node.js Release Schedule](https://github.com/nodejs/Release)
2. Find the oldest LTS version still in Active or Maintenance phase
3. Use that major version (e.g., `>=20` for Node.js 20.x)

**Note:** As of January 2025, the oldest maintained LTS is Node.js 20.x. Always verify the current status when setting up a new package.

### Dependencies

#### `dependencies`

Runtime dependencies used in your source code:

```json
{
  "dependencies": {
    "lodash": "^4.17.21"
  }
}
```

#### `devDependencies`

Development-only dependencies (build tools, test runners, etc.):

```json
{
  "devDependencies": {
    "bunchee": "latest",
    "vitest": "^2.0.0",
    "@types/node": "^20.0.0"
  }
}
```

**Important:** Dependencies used in `src/` files should go in `dependencies`, not `devDependencies`.

## Complete Example

See [examples/example-package/package.json](../examples/example-package/package.json) for a complete example.
