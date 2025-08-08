// Global test setup
import { beforeEach } from 'vitest';

// Mock fetch globally for all tests
global.fetch = vi.fn();

// Setup DOM cleaning before each test
beforeEach(() => {
  // Clear DOM
  document.body.innerHTML = '';
  // Clear fetch mocks
  vi.clearAllMocks();
});