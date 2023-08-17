export const isFunction = (d: unknown): boolean => Object.prototype.toString.call(d) === '[object Function]';

export class ReflectPolyfill {
    /**
     * @description 对象是否存在某个属性
     * @param target source
     * @param propertyKey key
     * @returns boolean
     */
    public static has(target: object, propertyKey: PropertyKey): boolean {
        return isFunction(Reflect.has) ? Reflect.has(target, propertyKey) : Object.prototype.hasOwnProperty.call(target, propertyKey);
    }

    /**
     * @description 删除某个属性
     * @param target source
     * @param propertyKey key
     * @returns boolean
     */
    public static deleteProperty(target: any, propertyKey: PropertyKey): boolean {
        return isFunction(Reflect.deleteProperty) ? Reflect.deleteProperty(target, propertyKey) : delete target[propertyKey];
    }
}

export class StringPolyfill {
    /**
     * @description 是否以某个字符串开头
     * @param str string
     * @param search string
     * @returns boolean
     */
    public static startWith(str: string, search: string): boolean {
        return isFunction(String.prototype.startsWith) ? str.startsWith(search) : str.slice(0, search.length) === search;
    }
}

