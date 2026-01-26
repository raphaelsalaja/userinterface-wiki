/**
 * Example TypeScript ESM module - index.ts
 *
 * This demonstrates TypeScript with ES Module syntax
 */

// Import from other modules (use .js extension even in .ts files)
import { helperFunction } from './helpers.js';

// Named exports with types
export function greet(name: string): string {
  return `Hello, ${name}!`;
}

export const version: string = '1.0.0';

// Export interface
export interface GreetingOptions {
  prefix?: string;
  suffix?: string;
}

// Default export with types
export default class MyLibrary {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  greet(): string {
    return greet(this.name);
  }

  greetWithOptions(options: GreetingOptions = {}): string {
    const prefix = options.prefix || '';
    const suffix = options.suffix || '';
    return `${prefix}${greet(this.name)}${suffix}`;
  }
}

export function useHelper(): string {
  return helperFunction();
}
