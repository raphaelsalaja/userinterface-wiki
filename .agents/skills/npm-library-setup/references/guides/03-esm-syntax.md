# ESM Syntax and Patterns

This guide covers ES Module syntax and common patterns for npm libraries.

## Import/Export Basics

### Named Exports

Export individual items:

```javascript
// src/index.js
export function greet(name) {
  return `Hello, ${name}!`;
}

export const version = '1.0.0';

export class MyClass {
  constructor(name) {
    this.name = name;
  }
}
```

Import named exports:

```javascript
import { greet, version, MyClass } from './index.js';

console.log(greet('World')); // Hello, World!
console.log(version); // 1.0.0

const instance = new MyClass('Test');
```

### Default Export

Export a single default value:

```javascript
// src/index.js
export default class MyLibrary {
  // ...
}
```

Import default export:

```javascript
import MyLibrary from './index.js';
// or with different name
import MyApp from './index.js';
```

### Mixed Exports

Combine named and default exports:

```javascript
// src/index.js
export function helper() {
  return 'helper';
}

export default class Main {
  // ...
}
```

Import both:

```javascript
import Main, { helper } from './index.js';
```

### Namespace Import

Import all exports as an object:

```javascript
import * as myLib from './index.js';

console.log(myLib.greet('World'));
console.log(myLib.version);
```

## File Extensions

**Important:** In ESM, you must use explicit file extensions in imports:

```javascript
// ✅ Correct
import { something } from './module.js';

// ❌ Wrong (will fail in ESM)
import { something } from './module';
```

This applies even when working with TypeScript - you still use `.js` extensions:

```typescript
// ✅ Correct (even in .ts files)
import { something } from './module.js';
```

## Import Order

Imports must be at the top of the file (after any comments):

```javascript
// ✅ Correct
import { helper } from './helper.js';

export function main() {
  return helper();
}
```

```javascript
// ❌ Wrong
export function main() {
  return helper();
}

import { helper } from './helper.js'; // Error!
```

## Dynamic Imports

Load modules conditionally:

```javascript
async function loadModule() {
  const module = await import('./dynamic.js');
  return module.default;
}
```

## Re-exporting

Re-export from other modules:

```javascript
// src/index.js
export { helper } from './helpers.js';
export { utility } from './utils.js';

// Re-export all
export * from './helpers.js';
```

## Common Patterns

### Barrel Exports

Create an `index.js` that exports everything:

```javascript
// src/index.js
export * from './greet.js';
export * from './utils.js';
export { default as Config } from './config.js';
```

### Conditional Exports

Use package.json `exports` field for conditional exports:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./package.json": "./package.json"
  }
}
```

## Examples

See [examples/example-package/src/](../examples/example-package/src/) for working examples of ESM patterns.
