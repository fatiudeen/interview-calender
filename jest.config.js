/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
import { pathsToModuleNameMapper } from 'ts-jest';
// eslint-disable-next-line import/extensions
import compilerOptions from './paths.tsconfig.js';

export default {
  transform: {},
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  clearMocks: true,
  modulePathIgnorePatterns: ['./dist', 'test_db.json'],
  moduleDirectories: ['node_modules', 'src'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  // moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' },
};
