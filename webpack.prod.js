const { merge } = require('webpack-merge');
const base = require('./webpack.base.js');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const minimize = process.argv.indexOf('minimize') >= 0;

module.exports = merge(base, {
    mode: 'production',
    entry: {
        "cable-slider": ['./src/cable-slider.js','./src/sass/cable-slider.scss'],
        "themes/cable-slider-one-theme/cable-slider-one-theme": ["./src/sass/themes/cable-slider-one-theme/cable-slider-one-theme.scss"]
    },
    externals:{
        jquery: "jQuery"
    },
    output: {
        filename: '[name]'+(minimize ? '.min' : '')+'.js',
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
