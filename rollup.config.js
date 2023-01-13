const { defineConfig } = require('rollup');
const ts = require('rollup-plugin-typescript2');

module.exports = defineConfig({
    input: './src/index.ts',
    output: [
        {
            format: 'cjs',
            exports: 'default',
            file: 'dist/index.cjs.js'
        }
    ],
    plugins: [
        ts({
            tsconfig: './tsconfig.json',
            tsconfigOverride: {
                compilerOptions: {
                    declaration: true,
                    declarationMap: false,
                    declarationDir: 'dist',
                    allowJs: true
                },
                include: ['src/**/*']
            },
            clean: true,
            useTsconfigDeclarationDir: true
        })
    ],
    external: ['@vue/cli-service', 'path', 'fs']
});

