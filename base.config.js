// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import { fileURLToPath } from 'node:url';

import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import yml from 'eslint-plugin-yml';
import globals from 'globals';
import ts from 'typescript-eslint';
import yamlParser from 'yaml-eslint-parser';
const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));

export default ts.config(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	{
		plugins: {
			'simple-import-sort': simpleImportSort,
			'unused-imports': unusedImports
		},
		rules: {
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
			'@typescript-eslint/no-unused-vars': 'off',
			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': [
				'warn',
				{
					vars: 'all',
					varsIgnorePattern: '^_',
					args: 'after-used',
					argsIgnorePattern: '^_'
				}
			]
		}
	},
	prettier,
	eslintPluginPrettierRecommended,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		},
		rules: { 'no-undef': 'off', 'prettier/prettier': 'error' }
	},
	{
		files: ['**/*.yml', '**/*.yaml'],
		languageOptions: {
			parser: yamlParser,
			parserOptions: {
				yamlVersion: '1.2'
			}
		},
		plugins: {
			yml: yml
		},
		rules: {
			'yml/indent': ['error', 2],
			'yml/quotes': ['error', { prefer: 'single' }],
			'yml/sort-keys': ['error', 'asc'],
			'yml/no-empty-document': 'error',
			'yml/no-empty-key': 'error',
			'yml/no-empty-mapping-value': 'error',
			'yml/no-empty-sequence-entry': 'error',
			'yml/no-irregular-whitespace': 'error',
			'yml/no-tab-indent': 'error',
			'yml/plain-scalar': 'error'
		}
	}
);
