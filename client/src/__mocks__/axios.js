// Manual Jest mock for axios to avoid importing the ESM distribution during tests
const instance = {
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

const create = jest.fn(() => instance);

const axiosMock = {
  create,
  // expose common methods for direct require usage if any tests rely on them
  ...instance,
};

module.exports = axiosMock;
module.exports.default = axiosMock;
