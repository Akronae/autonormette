// https://eslint.org/docs/user-guide/configuring

module.exports =
{
    extends: ['eslint:recommended'],
    root: true,
    parser: 'babel-eslint',
    parserOptions:
    {
        ecmaVersion: 6,
        ecmaFeatures:
        {
          experimentalObjectRestSpread: true,
          jsx: true
        },
        sourceType: 'module'
    },

    env:
    {
        browser: true,
        amd: true,
        es6: true,
    },

    // required to lint *.vue files
    plugins:
    [
        'html'
    ],

    // add your custom rules here
    rules:
    {
        // allow debugger during development
        'no-debugger': process.env.BUILD_TYPE === 'production' ? 'error' : 'off',
        'no-undef': 'error',
        'newline-before-return': 0,
        'brace-style': ['warn', 'allman', { allowSingleLine: true }],
        'indent': ['off', 4],
        'no-unused-vars': ['warn', {args: 'none'}],
        'quotes': ['warn', 'single', { allowTemplateLiterals: true }],
        'no-console': 0,
        'valid-typeof': 0,
        'no-empty': 'warn',
        'no-unreachable': 0,
        'no-unexpected-multiline': 0,
        'no-constant-condition': 0
    },

    globals:
    {
        ImageCapture: 'readonly',
        cordova: 'readonly',
        StatusBar: 'readonly',
        Keyboard: 'readonly',
        LocalFileSystem: 'readonly',
        Camera: 'readonly',
        process: 'readonly',
        module: 'readonly',
        app: 'readonly',
        __build_date__: 'readonly'
    }
}
