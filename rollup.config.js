import { defineConfig } from 'rollup'
import typescriptPlugin from '@rollup/plugin-typescript'

const config = defineConfig({
	input: 'src/main.ts',
	output: {
		file: 'src/main.js',
		format: 'module',
		sourcemap: 'inline',
	},
	plugins: [typescriptPlugin()],
})

export default config
