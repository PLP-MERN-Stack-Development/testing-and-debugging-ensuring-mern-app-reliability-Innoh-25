// Manual mock for local api module used in tests
const instance = {
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

module.exports = instance;
module.exports.default = instance;
