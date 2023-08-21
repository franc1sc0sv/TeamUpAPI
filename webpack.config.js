import { readdirSync } from "fs";
import { resolve } from "path";
import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const nodeModules = {};

readdirSync(resolve(__dirname, 'node_modules'))
    .filter(x => ['.bin'].indexOf(x) === -1)
    .forEach(mod => { nodeModules[mod] = "commonjs "+mod });

const entry = './src/index.js';
const output = {
  path: resolve(__dirname),
  filename: 'api-build.cjs',
};
const externals = nodeModules;
const target = 'node';

export default {
  entry,
  output,
  externals,
  target
}