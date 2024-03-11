import { readFileSync, writeFileSync } from 'fs';
import { parse } from 'path';
import type { CompilerOptions, MapLike } from 'typescript';
import { hasFile } from './shared';
import { ReflectPolyfill, StringPolyfill } from './polyfill';
import type { AutoAlias } from './type';

export interface IJson extends CompilerOptions {
    [key: string]: any;
}

/**
 * @description 获取json
 * @param jsonPath jsonPath
 * @returns
 */
export function getJson(jsonPath: string): IJson {
    try {
        const jsonText = readFileSync(jsonPath, 'utf-8');
        return JSON.parse(jsonText);
    } catch (error) {
        process.exit(0);
    }
}
/**
 * @description 合并json
 * @param target IJson
 * @param source IJson
 * @returns IJson
 */
export function mergeJson(target: IJson, source: IJson): IJson {
    const targetPaths: MapLike<string[]> = target.compilerOptions?.paths ?? {};
    const sourcePaths: MapLike<string[]> = source.compilerOptions?.paths ?? {};
    for (const pathKey in targetPaths) {
        if (!ReflectPolyfill.has(sourcePaths, pathKey)) {
            sourcePaths[pathKey] = targetPaths[pathKey];
        }
    }
    return Object.assign({}, source, {
        compilerOptions: Object.assign({}, source.compilerOptions, { paths: sourcePaths })
    });
}

/**
 * @description 移除某个path
 * @param pathKey path key
 * @param source  IJson
 * @returns IJson
 */
export function removePath(pathKey: string, source: IJson): IJson {
    const sourcePaths: MapLike<string[]> | undefined = source.compilerOptions.paths;
    sourcePaths && ReflectPolyfill.deleteProperty(sourcePaths, pathKey);
    return Object.assign({}, source, {
        compilerOptions: Object.assign({}, source.compilerOptions, { paths: sourcePaths })
    });
}

/**
 * @description 生成json
 * @param alias { [key: string]: string }
 * @param root string
 * @param prefix string
 * @returns IJson
 */
export function genJson(alias: { [key: string]: string }, root: string, prefix: string): IJson {
    const { name: rootName } = parse(root);
    const paths = Object.keys(alias).reduce<{ [key: string]: string[] }>((result, pathKey) => {
        if (StringPolyfill.startWith(pathKey, prefix) && pathKey !== prefix) {
            const { name } = parse(alias[pathKey]);
            result[`${pathKey}/*`] = [`${rootName}/${name}/*`];
        }
        result[`${prefix}/*`] = [`${rootName}/*`];
        return result;
    }, {});
    return {
        compilerOptions: {
            paths: paths,
            baseUrl: './'
        }
    };
}

export interface ISyncJson {
    aliasPath: string | null;
    jsJson: string;
    tsJson: string;
    alias: { [key: string]: string };
    prefix: string;
    root: string;
    mode: AutoAlias['mode'];
}

/**
 * @description 同步json文件
 * @param extendJson 继承的json
 * @param jsJson jsconfig.json
 * @param tsJson tsconfig.json
 */
export function syncJson({ aliasPath, jsJson, tsJson, alias, prefix, root, mode }: ISyncJson) {
    const target = genJson(alias, root, prefix);

    if (aliasPath && hasFile(aliasPath) && mode === 'sync') {
        const source = getJson(aliasPath);
        const newJson = mergeJson(target, source);
        hasFile(aliasPath) && writeFileSync(aliasPath, JSON.stringify(newJson, null, 4));
        return;
    }
    if (hasFile(jsJson) && mode === 'sync') {
        const source = getJson(jsJson);
        const newJson = mergeJson(target, source);
        hasFile(jsJson) && writeFileSync(jsJson, JSON.stringify(newJson, null, 4));
    }
    if (hasFile(tsJson) && mode === 'sync') {
        const source = getJson(tsJson);
        const newJson = mergeJson(target, source);
        hasFile(tsJson) && writeFileSync(tsJson, JSON.stringify(newJson, null, 4));
    }
}

