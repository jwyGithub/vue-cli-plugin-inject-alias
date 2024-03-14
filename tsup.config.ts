import path from 'path';
import { defineConfig } from 'tsup';

export default defineConfig({
    entry: [`${path.join(__dirname, './src/index.ts')}`],
    outDir: path.join(__dirname, './dist'),
    outExtension({ format }) {
        return {
            js: `.${format}.js`
        };
    },
    splitting: true,
    cjsInterop: true,
    dts: true,
    target: ['node8'],
    format: ['cjs'],
    minify: true,
    clean: true,
    tsconfig: path.resolve(__dirname, './tsconfig.json')
});

