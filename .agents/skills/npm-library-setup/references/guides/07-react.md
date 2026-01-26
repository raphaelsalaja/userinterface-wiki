# React Packages

This guide covers setting up an npm library for React components.

## Overview

When building React component libraries, install React as a dev dependency for building, but use `peerDependencies` for React itself so consumers use their own React version.

## Step 1: Install React Dependencies

Install React and related types as dev dependencies:

```bash
npm install -D react @types/react react-dom @types/react-dom
```

## Step 2: Update package.json

Add React as a peer dependency:

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
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "devDependencies": {
    "bunchee": "latest",
    "react": "^18.0.0",
    "@types/react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "vitest": "^2.0.0"
  }
}
```

### Why peerDependencies?

- `peerDependencies`: React and React-DOM - consumers install their own versions
- `devDependencies`: React and React-DOM - needed only for building and testing

This ensures compatibility with the consumer's React version.

## Step 3: TypeScript Configuration (if using TS)

If using TypeScript, update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022", "DOM"],
    "jsx": "react-jsx",
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node", "react", "react-dom", "vitest/globals"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.test.tsx"]
}
```

### Key React Options

- `jsx: "react-jsx"` - Use React 17+ automatic JSX runtime
- `lib: ["ES2022", "DOM"]` - Include DOM types for React
- `types: ["react", "react-dom"]` - Include React types

## Step 4: Write React Components

Create React components:

### JavaScript

```jsx
// src/button.jsx
import React from 'react';

export function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="btn">
      {children}
    </button>
  );
}
```

### TypeScript

```tsx
// src/button.tsx
import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={`btn btn-${variant}`}>
      {children}
    </button>
  );
}
```

### Export from index

```typescript
// src/index.ts
export { Button } from './button.js';
export type { ButtonProps } from './button.js';
```

**Note:** Use `.js` extensions in TypeScript imports (pointing to compiled output).

## Step 5: Build

Bunchee automatically handles JSX/TSX:

```bash
npm run build
```

Output:
```
dist/
├── index.js      # ESM bundle
├── index.d.ts    # TypeScript definitions (if using TS)
```

## Testing React Components

### Install Testing Library

```bash
npm install -D @testing-library/react @testing-library/jest-dom @vitest/ui
```

### Write Component Tests

```typescript
// src/button.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './button.js';

describe('Button', () => {
  it('should render children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDefined();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    screen.getByText('Click').click();
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### Vitest Configuration

Update `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
```

Install the plugin:

```bash
npm install -D @vitejs/plugin-react jsdom
```

## Package Structure

```
react-package/
├── package.json
├── tsconfig.json        # if using TS
├── vitest.config.ts
├── src/
│   ├── index.ts         # or index.js
│   ├── button.tsx       # or button.jsx
│   └── button.test.tsx
└── dist/
```

## Consumer Usage

After publishing, consumers can use your component:

```tsx
import { Button } from 'your-package';

function App() {
  return <Button onClick={() => alert('clicked')}>Click me</Button>;
}
```

## Best Practices

1. ✅ Use `peerDependencies` for React/React-DOM
2. ✅ Install React in `devDependencies` for building/testing
3. ✅ Use `jsx: "react-jsx"` for React 17+ automatic JSX
4. ✅ Export component types from index for TypeScript users
5. ✅ Test components with `@testing-library/react`

## Examples

See React package examples in the examples directory for complete setups.
