const { merge } = require('webpack-merge');
const base = require('./webpack.base.js');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const minimize = process.argv.indexOf('minimize=1') >= 0;

module.exports = merge(base, {
    mode: 'production',
    entry: {
        app_js: './src/index.js',
        app_css: './src/sass/main.scss'
    },
    externals:{
        jquery: "jQuery"
    },
    output: {
        filename: 'cable-slider'+(minimize ? '.min' : '')+'.js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        minimize: minimize,
        minimizer: [
            new TerserPlugin({
                extractComments:{
                    condition:false,
                    filename:() => {
                        return '';
                    },
                    banner:(licenseFile) => {
                        return '';
                    }
                },
                terserOptions: {
                    output: {
                        comments: false,
                    },
                },
            }),
        ],
    },
});
