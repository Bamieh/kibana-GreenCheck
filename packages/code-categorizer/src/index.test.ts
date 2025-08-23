import { describe, it, expect } from 'vitest';
import { categorizeCode } from './index';

describe('categorizeCode', () => {
  it('should categorize code', async () => {
    const code = 'console.log("Hello, world!");';
    const result = await categorizeCode(code);
    expect(result).toBe('Hello, world!');
  });
});