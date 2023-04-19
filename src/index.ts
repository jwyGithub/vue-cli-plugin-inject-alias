import { join, resolve } from 'path';
import type { PluginAPI, ProjectOptions } from '@vue/cli-service';
import { getDirs, getPluginConfig, hasFile, mergeConfig } from './shared';
import { syncJson } from './sync';
import { PLUGIN_NAME } from './config';

const ALIAS_JSON_PATH = (cwd: string) => resolve(cwd, 'node_modules/@jiangweiye/tsconfig/tsconfig.alias.json');

const jsconfig = (root: string) => join(root, 'jsconfig.json');
const tsconfig = (root: string) => join(root, 'tsconfig.json');

function genAlias(root: string, prefix: string) {
    const dirs = getDirs(root);
    return dirs.reduce<{ [key: string]: string }>((result, item) => {
        const key = `${prefix}${item.dirName}`;
        const value = item.dirPath;
        result[key] = value;
        return result;
    }, {});
}

function alias(api: PluginAPI, options: ProjectOptions) {
    const { pluginOptions = {} } = options;
    const cwd = api.getCwd();
    // 插件配置
    const { mode, prefix, root } = mergeConfig(pluginOptions, getPluginConfig(cwd))[PLUGIN_NAME];

    if (!hasFile(root)) {
        return;
    }
    api.configureWebpack(config => {
        let baseAlias = {};
        if (config.resolve && config.resolve.alias) {
            baseAlias = config.resolve.alias;
        }

        const _alias = { ...genAlias(root, prefix), ...baseAlias };

        syncJson({
            extendJson: ALIAS_JSON_PATH(cwd),
            jsJson: jsconfig(cwd),
            tsJson: tsconfig(cwd),
            alias: _alias,
            root,
            prefix,
            mode
        });

        return {
            resolve: {
                alias: _alias
            }
        };
    });
}

export default alias;

