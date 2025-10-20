module.exports = {
  extends: ['react-app', 'react-app/jest'],
  rules: {
    'no-unused-vars': 'warn', // Change from error to warning
    '@typescript-eslint/no-unused-vars': 'warn'
  }
};