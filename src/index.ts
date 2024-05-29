import { join } from 'node:path';
import type { PluginAPI, ProjectOptions } from '@vue/cli-service';
import { getDirs, hasFile, mergeConfig } from './shared';
import { syncJson } from './sync';
import getPaths, { PLUGIN_NAME, defaultConfig } from './const';
import type { AutoAlias, getPluginConfigFn } from './type';

const getPluginConfig: getPluginConfigFn = (root: string, defaultConfig: Required<AutoAlias>) => {
    return {
        [PLUGIN_NAME]: {
            root: join(root, 'src'),
            prefix: defaultConfig.prefix,
            mode: defaultConfig.mode
        }
    };
};

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
    const { ALIAS_JSON_PATH, JSON_CONFIG_PATH, TS_CONFIG_PATH } = getPaths(cwd);
    const { mode, prefix, root } = mergeConfig(pluginOptions, getPluginConfig(cwd, defaultConfig(cwd)))[PLUGIN_NAME];

    if (!hasFile(root)) {
        return;
    }
    api.configureWebpack(config => {
        let baseAlias = {};
        if (config.resolve && config.resolve.alias) {
            baseAlias = config.resolve.alias;
        }

        const _alias = Object.assign({}, genAlias(root, prefix), baseAlias);

        syncJson({
            aliasPath: ALIAS_JSON_PATH,
            jsJson: JSON_CONFIG_PATH,
            tsJson: TS_CONFIG_PATH,
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

