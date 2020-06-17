import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import cleaner from 'rollup-plugin-cleaner';
import livereload from 'rollup-plugin-livereload';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;
const buildTarget = process.env.BUILD ? process.env.BUILD : 'dev'

export default [{
	input: 'src/customize.js',
	output: {
		sourcemap: false,
		format: 'iife',
		name: 'app',
		file: 'public/build/customize.js'
	},
	plugins: [
		cleaner({
			targets: [
				'./public/build/',
				'./build/'
			]
		}),
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('public/build/customize.css');
			}
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		postcss({
			extract: true,
			minimize: true,
			use: [
				['sass', {
					includePaths: [
						'./src/theme',
						'./node_modules'
					]
				}]
			]
		}),

		terser(),
	]
}, {
	input: 'src/config.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/config.js'
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('public/build/config.css');
			}
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		postcss({
			extract: true,
			minimize: true,
			use: [
				['sass', {
					includePaths: [
						'./src/theme',
						'./node_modules'
					]
				}]
			]
		}),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),

		copy({
			targets: [
				{ src: 'conf/' + buildTarget + '/manifest.json', dest: 'build/' + buildTarget + '/' },
				{ src: 'public/*', dest: 'build/' + buildTarget + '/' }
			],
			hook: 'writeBundle'
		})
	],
	watch: {
		clearScreen: false
	}
}];

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}
