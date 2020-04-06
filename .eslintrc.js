module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // custom
    "space-before-function-paren": 0,
    "no-trailing-spaces": 0,
    "spaced-comment": 0,
    "no-undef": 0,
    "comma-dangle": 0,
    "object-curly-spacing": 0,
    "eqeqeq": 0,
    "no-irregular-whitespace": 0,
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
