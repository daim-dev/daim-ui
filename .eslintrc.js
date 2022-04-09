const OFF = 'off'
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    '@nuxtjs',
    '@nuxtjs/eslint-config-typescript',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
  ],
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  // add your custom rules here
  rules: {
    '@typescript-eslint/no-var-requires': OFF,
    '@typescript-eslint/no-this-alias': OFF,
    '@typescript-eslint/no-unused-vars': OFF,
    'vue/require-prop-types': OFF,
    'vue/require-default-prop': OFF,
    'vue/no-v-html': OFF,
    'vue/multi-word-component-names': OFF,
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : OFF,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : OFF,
  },
}
