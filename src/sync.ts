import { readFileSync, writeFileSync } from 'fs';
import { parse } from 'path';
import { hasFile } from './shared';

export interface IPaths {
    [key: string]: string[];
}

export interface IJson {
    [key: string]: any;
    compilerOptions: {
        [key: string]: any;
        baseUrl: string;
        paths: IPaths;
    };
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
    const targetPaths: IPaths = target.compilerOptions?.paths ?? {};
    const sourcePaths: IPaths = source.compilerOptions?.paths ?? {};
    for (const pathKey in targetPaths) {
        if (!Reflect.has(sourcePaths, pathKey)) {
            sourcePaths[pathKey] = targetPaths[pathKey];
        }
    }
    return {
        ...source,
        compilerOptions: {
            ...source.compilerOptions,
            paths: sourcePaths
        }
    };
}

/**
 * @description 移除某个path
 * @param pathKey path key
 * @param source  IJson
 * @returns IJson
 */
export function removePath(pathKey: string, source: IJson): IJson {
    const sourcePaths: IPaths = source.compilerOptions.paths;
    Reflect.deleteProperty(sourcePaths, pathKey);
    return {
        ...source,
        compilerOptions: {
            ...source.compilerOptions,
            paths: sourcePaths
        }
    };
}

/**
 * @description 生成json
 * @param alias { [key: string]: string }
 * @param root string
 * @param prefix string
 * @returns IJson
 */
export function genJson(alias: { [key: string]: string }, root: string): IJson {
    const { name: rootName } = parse(root);
    const paths = Object.keys(alias).reduce<{ [key: string]: string[] }>((result, pathKey) => {
        if (pathKey.startsWith('@') && pathKey !== '@') {
            const { name } = parse(alias[pathKey]);
            result[`${pathKey}/*`] = [`${rootName}/${name}/*`];
        }
        result['@/*'] = [`${rootName}/*`];
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
    extendJson: string;
    jsJson: string;
    tsJson: string;
    alias: { [key: string]: string };
    prefix: string;
    root: string;
    mode: 'extends' | 'sync' | 'all';
}

/**
 * @description 同步json文件
 * @param extendJson 继承的json
 * @param jsJson jsconfig.json
 * @param tsJson tsconfig.json
 */
export function syncJson({ extendJson, jsJson, tsJson, alias, mode, root }: ISyncJson) {
    if (hasFile(extendJson) && ['all', 'extends'].includes(mode)) {
        const json = genJson(alias, root);
        hasFile(extendJson) && writeFileSync(extendJson, JSON.stringify(json, null, 4));
    }
    if (hasFile(jsJson) && ['all', 'sync'].includes(mode)) {
        const target = genJson(alias, root);
        const source = getJson(jsJson);
        const newJson = mergeJson(target, source);
        hasFile(jsJson) && writeFileSync(jsJson, JSON.stringify(newJson, null, 4));
    }
    if (hasFile(tsJson) && ['all', 'sync'].includes(mode)) {
        const target = genJson(alias, root);
        const source = getJson(tsJson);
        const newJson = mergeJson(target, source);
        hasFile(tsJson) && writeFileSync(tsJson, JSON.stringify(newJson, null, 4));
    }
}

export interface IRemoveJson {
    extendJson: string;
    jsJson: string;
    tsJson: string;
    unlinkDirName: string;
    root: string;
    prefix: string;
    mode: 'extends' | 'sync' | 'all';
}

export function removeJson({ extendJson, jsJson, tsJson, unlinkDirName, prefix, mode }: IRemoveJson) {
    if (hasFile(extendJson) && ['all', 'extends'].includes(mode)) {
        const _extendJson = getJson(extendJson);
        const newJson = removePath(`${prefix}${unlinkDirName}/*`, _extendJson);
        hasFile(extendJson) && writeFileSync(extendJson, JSON.stringify(newJson, null, 4));
    }

    if (hasFile(jsJson) && ['all', 'sync'].includes(mode)) {
        const _jsJson = getJson(jsJson);
        const newJson = removePath(`${prefix}${unlinkDirName}/*`, _jsJson);
        hasFile(jsJson) && writeFileSync(jsJson, JSON.stringify(newJson, null, 4));
    }

    if (hasFile(tsJson) && ['all', 'sync'].includes(mode)) {
        const _tsJson = getJson(tsJson);
        const newJson = removePath(`${prefix}${unlinkDirName}/*`, _tsJson);
        hasFile(tsJson) && writeFileSync(tsJson, JSON.stringify(newJson, null, 4));
    }
}

