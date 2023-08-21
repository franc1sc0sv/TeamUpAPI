const { readdirSync } = require("fs");
const { resolve } = require("path");

const nodeModules = {};

readdirSync(resolve(__dirname, 'node_modules'))
    .filter(x => ['.bin'].indexOf(x) === -1)
    .forEach(mod => { nodeModules[mod] = "commonjs "+mod });

module.exports = {
    entry: './src/index.js',
    output: {
      path: resolve(__dirname),
      filename: 'api-build.cjs',
    },
    externals: nodeModules,
    target: 'node',
};