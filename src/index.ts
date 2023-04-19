import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import type { PluginAPI } from '@vue/cli-service';
import { getDirs, hasFile } from './shared';
import { syncJson } from './sync';

const ALIAS_JSON_PATH = resolve(process.cwd(), 'node_modules/@jiangweiye/tsconfig/tsconfig.alias.json');

const jsconfig = (root: string) => join(root, 'jsconfig.json');
const tsconfig = (root: string) => join(root, 'tsconfig.json');

function genAlias(root: string) {
    const dirs = getDirs(root);
    return dirs.reduce<{ [key: string]: string }>((result, item) => {
        const key = `@${item.dirName}`;
        const value = item.dirPath;
        result[key] = value;
        return result;
    }, {});
}

function alias(api: PluginAPI) {
    const cwd = api.getCwd();
    const root = join(cwd, 'src');
    if (!hasFile(root)) {
        return;
    }
    api.configureWebpack(config => {
        let baseAlias = {};
        if (config.resolve && config.resolve.alias) {
            baseAlias = config.resolve.alias;
        }

        const _alias = { ...genAlias(root), ...baseAlias };

        syncJson({
            extendJson: ALIAS_JSON_PATH,
            jsJson: jsconfig(process.cwd()),
            tsJson: tsconfig(process.cwd()),
            alias: _alias,
            root,
            prefix: '@',
            mode: 'all'
        });

        return {
            resolve: {
                alias: _alias
            }
        };
    });
}

export default alias;

