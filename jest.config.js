/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

// function makeModuleNameMapper(srcPath, tsconfigPath) {
//   // Get paths from tsconfig
//   const { paths } = require(tsconfigPath).compilerOptions;

//   const aliases = {};

//   // Iterate over paths and convert them into moduleNameMapper format
//   Object.keys(paths).forEach((item) => {
//     const key = item.replace('/*', '/(.*)');
//     const path = paths[item][0].replace('/*', '/$1');
//     aliases[key] = `${srcPath}/${path}`;
//   });
//   return aliases;
// }

// const TS_CONFIG_PATH = './tsconfig.json';
// const SRC_PATH = '<rootDir>';

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  clearMocks: true,
  modulePathIgnorePatterns: ['./dist'],
  moduleDirectories: ['node_modules', 'src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '@app': '<rootDir>/src/api/v1/app',
    '@Shared/(.*)': '<rootDir>/src/Shared/$1',
  },
};
