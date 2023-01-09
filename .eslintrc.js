module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:prettier/recommended"
	],
	plugins: ["@typescript-eslint", "prettier", "import"],
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: ["./tsconfig.json"]
	},
	settings: {
		"import/parsers": {
			"@typescript-eslint/parser": [".ts"]
		},
		"import/resolver": {
			typescript: {
				alwaysTryTypes: true,
				project: "./tsconfig.json"
			}
		}
	},
	rules: {
		"import/no-unresolved": "error",
		"@typescript-eslint/no-empty-interface": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/ban-types": "off",
		"prettier/prettier": [
			"warn",
			{
				trailingComma: "none",
				semi: false,
				useTabs: true,
				tabWidth: 2,
				jsxSingleQuote: true,
				bracketSameLine: true,
				singleQuote: false,
				arrowParens: "avoid",
				printWidth: 100
			}
		]
	}
}
