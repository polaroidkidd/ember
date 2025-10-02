import svelte from 'eslint-plugin-svelte';
import ts from 'typescript-eslint';

import baseConfig from './base.config.js';
import svelteConfig from './svelte.config.js';

export default [
	...baseConfig,
	...svelte.configs.recommended,
	...svelte.configs.prettier,
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	}
];
