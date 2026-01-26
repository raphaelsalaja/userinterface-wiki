# Getting Started

This guide walks you through the initial setup of an npm library with ESM support.

## Prerequisites

- Node.js: Use the **oldest currently-maintained LTS version** (check [Node.js Release Schedule](https://github.com/nodejs/Release))
- npm, yarn, pnpm, or bun

## Step 1: Initialize Your Package

Create a new directory and initialize npm:

```bash
mkdir my-package
cd my-package
npm init -y
```

This creates a basic `package.json` file.

## Step 2: Enable ESM

Edit `package.json` and add the `type` field:

```json
{
  "type": "module"
}
```

This tells Node.js to treat all `.js` files as ES Modules by default.

## Step 3: Set Up Project Structure

Create a basic project structure:

```
my-package/
├── package.json
├── src/
│   └── index.js
├── dist/          # Build output (gitignored)
└── README.md
```

## Step 4: Install Development Dependencies

Install the build tool (bunchee) and test runner (vitest):

```bash
npm install -D bunchee vitest
```

Note: Only runtime dependencies used in your source code go in `dependencies`. Build tools and test runners go in `devDependencies`.

## Step 5: Configure package.json

Update your `package.json` with proper entry points and scripts:

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
  "files": ["dist"],
  "scripts": {
    "build": "bunchee",
    "test": "vitest",
    "prepublishOnly": "npm run build"
  },
  "engines": {
    "node": ">=20"  // Use oldest currently-maintained LTS (check Node.js Release Schedule)
  }
}
```

## Step 6: Create Your First Module

Create `src/index.js`:

```javascript
export function greet(name) {
  return `Hello, ${name}!`;
}

export default {
  version: '1.0.0'
};
```

## Step 7: Build

Run the build:

```bash
npm run build
```

This will create the `dist/` directory with bundled output.

## Next Steps

- See [Package.json Configuration](./02-package-json-config.md) for detailed field explanations
- Learn about [ESM Syntax](./03-esm-syntax.md) patterns
- Set up [Building and Testing](./04-building-and-testing.md)
