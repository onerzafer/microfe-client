const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ROOT = path.resolve( __dirname, 'src' );
const DESTINATION = path.resolve( __dirname, 'dist' );

module.exports = {
    context: ROOT,

    resolve: {
        extensions: ['.ts', '.js'],
        modules: [
            ROOT,
            'node_modules'
        ]
    },

    plugins: [new CopyWebpackPlugin([{ from: '../micro-apps', to: 'micro-apps' }])],

    module: {
        rules: [
            // PRE-LOADERS
            {
                enforce: 'pre',
                test: /\.js$/,
                use: 'source-map-loader'
            },

            // LOADERS
            {
                test: /\.ts$/,
                exclude: [ /node_modules/ ],
                use: 'awesome-typescript-loader'
            }
        ]
    },

    devtool: 'cheap-module-source-map',
    devServer: {}
};

