const { defineConfig } = require('@vue/cli-service');
const { resolve } = require('path');
module.exports = defineConfig({
    transpileDependencies: true,
    pluginOptions: {
        'vue-cli-plugin-inject-alias': {
            mode: 'extends',
            root: resolve(__dirname, './src')
        }
    }
});

