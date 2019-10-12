import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import vue from 'rollup-plugin-vue';
import serve from 'rollup-plugin-serve';

export default {
  input: 'src/main.js',
  output: {
    file: 'public/main.js',
    format: 'iife'
  },
  watch: {
    chokidar: false,
    include: 'src/**',
    exclude: 'node_modules/**',
    clearScreen: false
  },
  plugins: [
    resolve(),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    vue(),
    serve('public')
  ]
};
