module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  moduleNameMapper: {
    '^@/game-ui/(.*)$': '<rootDir>/src/game-ui/$1',
    '^@/game/(.*)$': '<rootDir>/game/$1',
    '^@/(.*)$': '<rootDir>/$1',
  },
};
