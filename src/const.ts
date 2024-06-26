import { resolve } from 'node:path';
import type { AutoAlias } from './type';

/**
 * @description 插件名称
 */
export const PLUGIN_NAME = 'vue-cli-plugin-inject-alias';

/**
 * @description 处理插件默认配置
 */
export const defaultConfig = (cwd: string): Required<AutoAlias> => {
    return {
        root: resolve(cwd, 'src'),
        prefix: '@',
        mode: 'sync'
    };
};

/**
 * @description 插件配置文件路径
 */
export default (cwd: string) => {
    return {
        ALIAS_JSON_PATH: null,
        JSON_CONFIG_PATH: resolve(cwd, 'jsconfig.json'),
        TS_CONFIG_PATH: resolve(cwd, 'tsconfig.json')
    };
};

