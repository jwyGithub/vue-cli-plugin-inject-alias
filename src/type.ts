import type { PLUGIN_NAME } from './config';

/**
 * @description: vue-cli-plugin-inject-alias 配置
 */
export interface AutoAlias {
    root?: string | undefined;
    prefix?: string | undefined;
    mode?: 'extends' | 'sync' | 'all';
}

/**
 * @description: 处理插件默认配置
 */
export type getPluginConfigFn = (root: string) => { [PLUGIN_NAME]: Required<AutoAlias> };
