/**
 * Example ESM module - index.js
 */

// Import from another module
import { helperFunction } from './helpers.js';

// Named export
export function greet(name) {
  return 'Hello, ' + name + '!';
}

// Default export
export default helperFunction;
