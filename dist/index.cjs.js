var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
var import_path4 = require("path");

// src/shared.ts
var import_fs = require("fs");
var import_path = require("path");
var isDir = /* @__PURE__ */ __name((path) => {
  return (0, import_fs.lstatSync)(path).isDirectory();
}, "isDir");
var hasFile = /* @__PURE__ */ __name((path) => {
  return (0, import_fs.existsSync)(path);
}, "hasFile");
var getDirs = /* @__PURE__ */ __name((path) => {
  const dirs = (0, import_fs.readdirSync)(path);
  return dirs.reduce((result, name) => {
    const fullPath = (0, import_path.join)(path, name);
    isDir(fullPath) && result.push({
      dirName: name,
      dirPath: fullPath
    });
    return result;
  }, []);
}, "getDirs");
function mergeConfig(source, target) {
  const isObject = /* @__PURE__ */ __name((data) => Object.prototype.toString.call(data) === "[object Object]", "isObject");
  const hasKey = /* @__PURE__ */ __name((data, key) => isObject(data) && Object.prototype.hasOwnProperty.call(data, key), "hasKey");
  for (const key in target) {
    if (!hasKey(source, key)) {
      source[key] = target[key];
    } else {
      isObject(target[key]) && mergeConfig(source[key], target[key]);
    }
  }
  return source;
}
__name(mergeConfig, "mergeConfig");

// src/sync.ts
var import_fs2 = require("fs");
var import_path2 = require("path");

// src/polyfill.ts
var isFunction = /* @__PURE__ */ __name((d) => Object.prototype.toString.call(d) === "[object Function]", "isFunction");
var _ReflectPolyfill = class _ReflectPolyfill {
  /**
   * @description 对象是否存在某个属性
   * @param target source
   * @param propertyKey key
   * @returns boolean
   */
  static has(target, propertyKey) {
    return isFunction(Reflect.has) ? Reflect.has(target, propertyKey) : Object.prototype.hasOwnProperty.call(target, propertyKey);
  }
  /**
   * @description 删除某个属性
   * @param target source
   * @param propertyKey key
   * @returns boolean
   */
  static deleteProperty(target, propertyKey) {
    return isFunction(Reflect.deleteProperty) ? Reflect.deleteProperty(target, propertyKey) : delete target[propertyKey];
  }
};
__name(_ReflectPolyfill, "ReflectPolyfill");
var ReflectPolyfill = _ReflectPolyfill;
var _StringPolyfill = class _StringPolyfill {
  /**
   * @description 是否以某个字符串开头
   * @param str string
   * @param search string
   * @returns boolean
   */
  static startWith(str, search) {
    return isFunction(String.prototype.startsWith) ? str.startsWith(search) : str.slice(0, search.length) === search;
  }
};
__name(_StringPolyfill, "StringPolyfill");
var StringPolyfill = _StringPolyfill;

// src/sync.ts
function getJson(jsonPath) {
  try {
    const jsonText = (0, import_fs2.readFileSync)(jsonPath, "utf-8");
    return JSON.parse(jsonText);
  } catch (error) {
    process.exit(0);
  }
}
__name(getJson, "getJson");
function mergeJson(target, source) {
  var _a, _b, _c, _d;
  const targetPaths = (_b = (_a = target.compilerOptions) == null ? void 0 : _a.paths) != null ? _b : {};
  const sourcePaths = (_d = (_c = source.compilerOptions) == null ? void 0 : _c.paths) != null ? _d : {};
  for (const pathKey in targetPaths) {
    if (!ReflectPolyfill.has(sourcePaths, pathKey)) {
      sourcePaths[pathKey] = targetPaths[pathKey];
    }
  }
  return Object.assign({}, source, {
    compilerOptions: Object.assign({}, source.compilerOptions, {
      paths: sourcePaths
    })
  });
}
__name(mergeJson, "mergeJson");
function genJson(alias2, root, prefix) {
  const { name: rootName } = (0, import_path2.parse)(root);
  const paths = Object.keys(alias2).reduce((result, pathKey) => {
    if (StringPolyfill.startWith(pathKey, prefix) && pathKey !== prefix) {
      const { name } = (0, import_path2.parse)(alias2[pathKey]);
      result["".concat(pathKey, "/*")] = [
        "".concat(rootName, "/").concat(name, "/*")
      ];
    }
    result["".concat(prefix, "/*")] = [
      "".concat(rootName, "/*")
    ];
    return result;
  }, {});
  return {
    compilerOptions: {
      paths,
      baseUrl: "./"
    }
  };
}
__name(genJson, "genJson");
function syncJson({ extendJson, jsJson, tsJson, alias: alias2, prefix, root, mode }) {
  if (hasFile(extendJson) && [
    "all",
    "extends"
  ].includes(mode)) {
    const json = genJson(alias2, root, prefix);
    hasFile(extendJson) && (0, import_fs2.writeFileSync)(extendJson, JSON.stringify(json, null, 4));
  }
  if (hasFile(jsJson) && [
    "all",
    "sync"
  ].includes(mode)) {
    const target = genJson(alias2, root, prefix);
    const source = getJson(jsJson);
    const newJson = mergeJson(target, source);
    hasFile(jsJson) && (0, import_fs2.writeFileSync)(jsJson, JSON.stringify(newJson, null, 4));
  }
  if (hasFile(tsJson) && [
    "all",
    "sync"
  ].includes(mode)) {
    const target = genJson(alias2, root, prefix);
    const source = getJson(tsJson);
    const newJson = mergeJson(target, source);
    hasFile(tsJson) && (0, import_fs2.writeFileSync)(tsJson, JSON.stringify(newJson, null, 4));
  }
}
__name(syncJson, "syncJson");

// src/const.ts
var import_path3 = require("path");
var PLUGIN_NAME = "vue-cli-plugin-inject-alias";
var defaultConfig = /* @__PURE__ */ __name((cwd) => {
  return {
    root: (0, import_path3.resolve)(cwd, "src"),
    prefix: "@",
    mode: "all"
  };
}, "defaultConfig");
var const_default = /* @__PURE__ */ __name((cwd) => {
  return {
    ALIAS_JSON_PATH: (0, import_path3.resolve)(cwd, "node_modules/@jiangweiye/tsconfig/tsconfig.alias.json"),
    JSON_CONFIG_PATH: (0, import_path3.resolve)(cwd, "jsconfig.json"),
    TS_CONFIG_PATH: (0, import_path3.resolve)(cwd, "tsconfig.json")
  };
}, "default");

// src/index.ts
var getPluginConfig = /* @__PURE__ */ __name((root, defaultConfig2) => {
  return {
    [PLUGIN_NAME]: {
      root: (0, import_path4.join)(root, "src"),
      prefix: defaultConfig2.prefix,
      mode: defaultConfig2.mode
    }
  };
}, "getPluginConfig");
function genAlias(root, prefix) {
  const dirs = getDirs(root);
  return dirs.reduce((result, item) => {
    const key = "".concat(prefix).concat(item.dirName);
    const value = item.dirPath;
    result[key] = value;
    return result;
  }, {});
}
__name(genAlias, "genAlias");
function alias(api, options) {
  const { pluginOptions = {} } = options;
  const cwd = api.getCwd();
  const { ALIAS_JSON_PATH, JSON_CONFIG_PATH, TS_CONFIG_PATH } = const_default(cwd);
  const { mode, prefix, root } = mergeConfig(pluginOptions, getPluginConfig(cwd, defaultConfig(cwd)))[PLUGIN_NAME];
  if (!hasFile(root)) {
    return;
  }
  api.configureWebpack((config) => {
    let baseAlias = {};
    if (config.resolve && config.resolve.alias) {
      baseAlias = config.resolve.alias;
    }
    const _alias = Object.assign({}, genAlias(root, prefix), baseAlias);
    syncJson({
      extendJson: ALIAS_JSON_PATH,
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
__name(alias, "alias");
var src_default = alias;
