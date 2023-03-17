import { join } from 'path';
import type { PluginAPI } from '@vue/cli-service';
import { getDirs, hasFile } from './shared';

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

        return {
            resolve: {
                alias: { ...genAlias(root), ...baseAlias }
            }
        };
    });
}

export default alias;

