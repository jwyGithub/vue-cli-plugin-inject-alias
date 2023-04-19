# vue-cli-plugin-inject-alias

automatically generate alias based on path

<p align="center">
  <img src="https://img.shields.io/npm/v/vue-cli-plugin-inject-alias" alt='version'>
  <img src="https://img.shields.io/npm/dm/vue-cli-plugin-inject-alias" alt='download'>
  <img src="https://img.shields.io/github/issues/jwyGithub/vue-cli-plugin-inject-alias" alt='issues'>
  <img src="https://img.shields.io/github/license/jwyGithub/vue-cli-plugin-inject-alias" alt='license'>
</p>
<br />

## install

```sh
vue add vue-cli-plugin-inject-alias
```

## config

> vue.config.js

```typescript
const { resolve } = require('path');
module.exports = defineConfig({
    // other config
    transpileDependencies: true,
    pluginOptions: {
        'vue-cli-plugin-inject-alias': {
            mode: 'all',
            prefix: '@',
            root: resolve(__dirname, './src')
        }
    }
});
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
    mode: 'extends' | 'sync' | 'all';
}
```

> mode

-   extends: inheritance mode, only typescript projects are supported
-   sync: synchronization mode, supporting typescript and javascript projects. When enabled, the generated paths will be automatically synchronized to tsconfig.json/jsconfig.json
-   all: enable both inheritance mode and synchronization mode. The default is all

## setting

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

**please ensure that @jiangweiye/tsconfig is installed**

**tips : In order to get a better path prompt, be sure to configure the jsconfig.json file or tsconfig.json file in the project**

## example

    |-- src
        |-- plugins
        |-- router
        |-- scss
        |-- store
        |-- utils
        |-- views
        |-- ....

```typescript
import xxx from '@plugins/xxx';
import xxx from '@router/xxx';
import xxx from '@scss/xxx';
import xxx from '@store/xxx';
import xxx from '@utils/xxx';
import xxx from '@views/xxx';
....
```

