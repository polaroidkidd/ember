import cloudflareAdapter from '@sveltejs/adapter-cloudflare';
import nodeAdapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const adapter =
	process.env.ENVIRONMENT === 'ci'
		? nodeAdapter()
		: cloudflareAdapter({
				// See below for an explanation of these options

				routes: {
					include: ['/*'],
					exclude: ['<all>']
				},
				platformProxy: {
					configPath: 'wrangler.jsonc',
					environment: process.env.ENVIRONMENT,
					experimentalJsonConfig: false,
					persist: false
				}
			});
const csp = {
	csp: {
		directives: {
			'script-src': ['self'],
			'frame-src': ['none']
		}
	}
};
const csrf = { csrf: { checkOrigin: true } };

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess({ typeScript: true })],
	extensions: ['.svelte'],

	compilerOptions: {
		runes: true
	},
	kit: {
		adapter,
		...(process.env.NODE_ENV === 'development' ? {} : csp),
		...(process.env.NODE_ENV === 'development' ? {} : csrf),
		csrf: {
			checkOrigin: true
		},
		env: {
			dir: '.'
		}
	}
};

export default config;
