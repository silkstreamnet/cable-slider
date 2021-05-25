const webpack = require('webpack');

module.exports = {
    plugins:[
        new webpack.DefinePlugin({
            __VERSION__: JSON.stringify(process.env.npm_package_version)
        })
    ],
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components|vendor)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                exclude: /(node_modules|bower_components|vendor)/,
                type: 'asset/resource',
                generator: {
                    filename: 'css/[name].min.css'
                },
                use: [
                    // Creates `style` nodes from JS strings
                    // "style-loader",
                    // Translates CSS into CommonJS
                    // "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
        ],
    },
};
