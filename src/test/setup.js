require('@testing-library/jest-dom');

// Mock window.matchMedia which JSDOM doesn't support by default
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock HTML element scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
