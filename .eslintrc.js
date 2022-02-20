module.exports = {
	// https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
	extends: 'standard',
	root: true,
	parser: '@babel/eslint-parser',
	parserOptions: {
		// sourceType: 'module',
		requireConfigFile: false,
	},
	env: {
		node: true,
		// browser: true,
	},
	globals: {
		// $: true,
		// API_URL: true,
		// angular: true,
	},
	plugins: [
		// 'mocha',
		// 'jasmine',
		'prefer-arrow',
	],
	rules: {
		indent: [
			'error', 'tab',
		],
		// allowIndentationTabs: true,
		'arrow-body-style': ['error', 'as-needed'],
		'arrow-parens': ['error', 'as-needed'], // allow paren-less arrow functions
		camelcase: 0,
		'comma-dangle': ['error', 'always-multiline'],
		curly: ['error', 'multi'],
		'generator-star-spacing': 0, // allow async-await
		'handle-callback-err': [0, 'error'],
		// indent: ['error', 2, { SwitchCase: 1 }],
		'multiline-comment-style': ['error', 'separate-lines'], // experimental
		'no-debugger': process.env.NODE_ENV === 'prod' ? 2 : 0, // allow debugger during development
		'no-multi-spaces': 0,
		'no-return-assign': 0,
		'no-tabs': 0,
		'no-template-curly-in-string': 0,
		'no-trailing-spaces': ['error', { skipBlankLines: true }],
		'no-unused-vars': 'error',
		'no-useless-escape': 'warn',
		'no-var': 'error',
		'prefer-arrow-callback': 'error',
		'prefer-arrow/prefer-arrow-functions': [
			'error',
			{
				disallowPrototype: true,
				singleReturnOnly: false,
				classPropertiesAllowed: false,
			},
		],
		'prefer-const': 2,
		semi: ['error', 'always'],
	},
};
