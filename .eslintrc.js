
module.exports = {
  root: true,
  extends: [
    'airbnb',
    'react-app',
  ],
  env: {
    browser: true,
  },
  rules: {
    semi: ['error', 'never'],
    'brace-style': ['error', 'stroustrup', {
      allowSingleLine: false,
    }],
    'arrow-parens': ['error', 'always'],
    'prefer-arrow-callback': ['error', {
      allowNamedFunctions: true,
      allowUnboundThis: true,
    }],
    'space-before-function-paren': ['error', {
      anonymous: 'never',
      named: 'never',
      asyncArrow: 'always',
    }],
    'react/prefer-stateless-function': 'off',
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: [
        'test/**', // Tape, common npm pattern
        'tests/**', // Also common npm pattern
        'spec/**', // Mocha, rspec-like pattern
        '**/__tests__/**', // Jest pattern
        'test.js', // Repos with a single test file
        'test-*.js', // Repos with multiple top-level test files
        '**/*.test.js', // Tests where the extension denotes that it is a test
        '**/webpack.config.js', // Webpack config
        '**/webpack.config.*.js', // Webpack config
        'tools/**', // Development tools
        'scripts/**', // Development scripts
      ],
      optionalDependencies: false,
    }],
  },
}
