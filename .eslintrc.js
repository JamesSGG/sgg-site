
module.exports = {
  root: true,
  extends: [
    'airbnb',
    'react-app',
  ],
  env: {
    browser: true,
  },
  plugins: [
    'graphql',
  ],
  settings: {
    'import/extensions': ['.js', '.jsx'],
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
        moduleDirectory: [
          'node_modules',
          'src',
        ],
      },
    },
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
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'ignore',
    }],
    'no-underscore-dangle': 'off',
    'class-methods-use-this': 'off',
    'react/prefer-stateless-function': 'off',
    'react/sort-comp': ['warn', {
      order: [
        'static-methods',
        '/^props$/',
        '/^state$/',
        '/^constructor$/',
        '/^_.+$/',
        '/^(get|set).+$/',
        '/^(on|handle).+$/',
        'lifecycle',
        'everything-else',
        '/^render.+$/',
        'render',
      ],
    }],
    'jsx-a11y/href-no-hash': 'off',
    'graphql/template-strings': ['error', {
      env: 'literal',
      schemaJson: require('./schema.json'),
    }],
    'import/extensions': ['error', 'always', {
      js: 'never',
      jsx: 'never',
    }],
    'import/order': ['warn', {
      groups: [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
      ],
      'newlines-between': 'ignore',
    }],
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
        '**/webpack.*.js', // Other Webpack-specific files
        'tools/**', // Development tools
        'scripts/**', // Development scripts
      ],
      optionalDependencies: false,
    }],
  },
}
