module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  moduleNameMapper: {
    '^@/game/(.*)$': '<rootDir>/src/game/$1',
    '^@/(.*)$': '<rootDir>/$1',
  },
};
