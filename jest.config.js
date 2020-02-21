/**
 * Jest configuration file.
 */
module.exports = {
  globals: {
    'ts-jest': {
      diagnostics: true,
    },
  },
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  /**
   * Removing  the  dist  folder  because relative path to the original TS code will be linked as valid JS test cases.
   * This  would  mean inconsistency as the cases test run it. In the tsconfig.json the test folder is already removed
   * from  the  folders  to  be  compiled, though -- but in any case that flag could be removed and JS tests files are
   * generated, this option would prevented to run it.
   */
  // prettier-ignore
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
  ],
  testRegex: '(./__tests__/.*| (\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  // prettier-ignore
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  collectCoverage: true,
  useStderr: true,
  // TODO: We probably don't need this. If we do, we might be doing something wrong.
  // forceExit: true,
  // prettier-ignore
  coverageReporters: [
    "json",
    "lcov",
    "text"
  ],
  expand: true,
  logHeapUsage: true,
  bail: true,
};
