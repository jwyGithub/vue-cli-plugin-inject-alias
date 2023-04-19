import { existsSync, lstatSync, readdirSync } from 'fs';
import { join } from 'path';
import type { getPluginConfigFn } from './type';
import { DEFAULT_CONFIG, PLUGIN_NAME } from './config';
export interface ObjectKey {
    [key: string]: any;
}

export type GetDirs = Array<{
    dirName: string;
    dirPath: string;
}>;

/**
 * @description 是否是文件夹
 * @param path
 * @returns
 */
export const isDir = (path: string): boolean => {
    return lstatSync(path).isDirectory();
};

/**
 * @description 是否存在文件
 * @param path
 * @returns
 */
export const hasFile = (path: string) => {
    return existsSync(path);
};

/**
 * @description 获取所有文件夹
 * @param path
 * @returns
 */
export const getDirs = (path: string): GetDirs => {
    const dirs = readdirSync(path);
    return dirs.reduce<GetDirs>((result, name) => {
        const fullPath = join(path, name);
        isDir(fullPath) && result.push({ dirName: name, dirPath: fullPath });
        return result;
    }, []);
};

/**
 * @description 合并配置
 * @param source object
 * @param target object
 * @returns object
 */
export function mergeConfig<T extends ObjectKey>(source: ObjectKey, target: T): T {
    const isObject = (data: any) => Object.prototype.toString.call(data) === '[object Object]';
    const hasKey = (data: any, key: string) => isObject(data) && Reflect.has(data, key);
    for (const key in target) {
        if (!hasKey(source, key)) {
            source[key] = target[key];
            isObject(target[key]) && mergeConfig(source[key], target[key]);
        } else {
            isObject(target[key]) && mergeConfig(source[key], target[key]);
        }
    }

    return source as T;
}

/**
 * @description 处理插件默认配置
 * @param root string
 */
export const getPluginConfig: getPluginConfigFn = root => {
    return {
        [PLUGIN_NAME]: {
            root: join(root, 'src'),
            prefix: DEFAULT_CONFIG.prefix,
            mode: DEFAULT_CONFIG.mode
        }
    };
};

