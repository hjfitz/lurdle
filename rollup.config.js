import { defineConfig } from 'rollup'
import typescriptPlugin from '@rollup/plugin-typescript'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

const config = defineConfig({
	input: 'src/main.ts',
	output: {
		file: 'src/main.js',
		format: 'module',
		sourcemap: 'inline',
	},
	plugins: [typescriptPlugin(), commonjs(), nodeResolve()],
})

export default config
