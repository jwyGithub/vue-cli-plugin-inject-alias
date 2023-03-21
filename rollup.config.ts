import { defineConfig } from 'rollup';
import ts from 'rollup-plugin-typescript2';

export default defineConfig({
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
                    declarationDir: 'dist/types',
                    allowJs: true
                },
                include: ['src/**/*'],
                exclude: ['rollup.config.ts']
            },
            clean: true,
            useTsconfigDeclarationDir: true
        })
    ],
    external: ['@vue/cli-service', 'path', 'fs', 'url']
});

