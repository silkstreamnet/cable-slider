const { merge } = require('webpack-merge');
const base = require('./webpack.base.js');
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(base, {
    mode: 'development',
    entry: {
        test:'./dev/test.js'
    },
    devtool: 'inline-source-map',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dev-dist')
    },
    devServer: {
        contentBase: './dev-dist',
    },
    plugins: [
        new CopyWebpackPlugin([
            {from:"dev/assets/img",to:"assets/img"}
        ]),
        new HtmlWebpackPlugin({
            title: 'App',
            filename: 'index.html',
            template: 'dev/index.html',
            inject: "body"
        })
    ]
});
