import { join } from 'path';
import type { AutoAlias } from './type';

/**
 * @description 插件名称
 */
export const PLUGIN_NAME = 'vue-cli-plugin-inject-alias';

/**
 * @description 处理插件默认配置
 */
export const DEFAULT_CONFIG: Required<AutoAlias> = {
    root: join(process.cwd(), 'src'),
    prefix: '@',
    mode: 'all'
};

