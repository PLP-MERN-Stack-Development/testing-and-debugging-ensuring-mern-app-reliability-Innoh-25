// This file runs automatically with react-scripts before tests.
// Patch `react-dom/test-utils.act` to use `react.act` to silence the deprecation
// warning that appears when older testing-library code calls the deprecated API.
try {
  const react = require('react');
  const reactDomTestUtils = require('react-dom/test-utils');
  if (react && react.act && reactDomTestUtils && reactDomTestUtils.act !== react.act) {
    reactDomTestUtils.act = react.act;
  }
} catch (e) {
  // ignore
}

// Optionally include jest-dom matchers globally
try {
  require('@testing-library/jest-dom');
} catch (e) {}
