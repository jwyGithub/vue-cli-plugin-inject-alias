English | [简体中文](https://github.com/jwyGithub/vue-cli-plugin-inject-alias/blob/master/README.zh.md)

# vue-cli-plugin-inject-alias

automatically generate alias based on path

<p align="center">
  <img src="https://img.shields.io/npm/v/vue-cli-plugin-inject-alias" alt='version'>
  <img src="https://img.shields.io/npm/dm/vue-cli-plugin-inject-alias" alt='download'>
  <img src="https://img.shields.io/github/issues/jwyGithub/vue-cli-plugin-inject-alias" alt='issues'>
  <img src="https://img.shields.io/github/license/jwyGithub/vue-cli-plugin-inject-alias" alt='license'>
</p>
<br />

## Features

-   Support for custom alias prefixes
-   Supports synchronous mode configuration

## Install

### with pnpm

```sh
pnpm add vue-cli-plugin-inject-alias -D
```

### with yarn

```sh
yarn add vue-cli-plugin-inject-alias -D
```

### with npm

```sh
npm install vue-cli-plugin-inject-alias -D
```

### with vue

```sh
vue add vue-cli-plugin-inject-alias
```

## Option

```typescript
export interface AutoAlias {
    /**
     * @description the root directory where the alias needs to be generated is src by default
     * @default src
     */
    root: string;

    /**
     * @description prefix for generating aliases
     * @default @
     */
    prefix: string;

    /**
     * @description synchronize the mode of json configuration
     * @default all
     */
    mode: 'extends' | 'sync' | 'all' | 'off';
}
```

#### Mode

-   extends : when use `extends`,you can use the extensions option in the tsconfig.json of the current project, with the value of `@jiangweiye/tsconfig/tsconfig.alias.json`. therefore, you must ensure that `@jiangweiye/tsconfig` is installed in the project. for information on `@jiangweiye/tsconfig`, please refer to the [tsconfig](https://github.com/jwyGithub/tsconfig)

> vue.config.js

```javascript
const { resolve } = require('path');
module.exports = defineConfig({
    // other config
    transpileDependencies: true,
    pluginOptions: {
        'vue-cli-plugin-inject-alias': {
            mode: 'extends',
            prefix: '@',
            root: resolve(__dirname, './src')
        }
    }
});
```

> tsconfig.json

```json
{
    "extends": "@jiangweiye/tsconfig/tsconfig.alias.json",
    "compilerOptions": {
        "baseUrl": "./"
        // ...
    }
}
```

-   sync : when use `sync`,the plugin will search for `tsconfig.json` or `jsconfig.json` in the root directory of the current project, so please ensure that this file exists in the project. The plugin will automatically generate paths options when running, and then write them to the file without the need for developers to manually add them

> vue.config.js

```javascript
const { resolve } = require('path');
module.exports = defineConfig({
    // other config
    transpileDependencies: true,
    pluginOptions: {
        'vue-cli-plugin-inject-alias': {
            mode: 'sync',
            prefix: '@',
            root: resolve(__dirname, './src')
        }
    }
});
```

> tsconfig.json / jsconfig.json

```json
{
    "compilerOptions": {
        "baseUrl": "./"
        // ...
    }
}
```

## example

    |-- src
        |-- plugins
        |-- router
        |-- scss
        |-- store
        |-- utils
        |-- views
        |-- ....

```javascript
import xxx from '@plugins/xxx';
import xxx from '@router/xxx';
import xxx from '@scss/xxx';
import xxx from '@store/xxx';
import xxx from '@utils/xxx';
import xxx from '@views/xxx';
....
```

