const path = require('path');
const MicroAppWrapper = require('./micro-app-wrapper/app.wrapper');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const rxPaths = require('rxjs/_esm5/path-mapping');

const ROOT = path.resolve(__dirname, 'src');
const DESTINATION = path.resolve(__dirname, 'dist');

module.exports = {
    context: ROOT,

    entry: {
        main: './main.ts',
    },

    output: {
        filename: '[name].bundle.js',
        path: DESTINATION,
    },

    resolve: {
        extensions: ['.ts', '.js'],
        modules: [ROOT, 'node_modules'],
        alias: rxPaths()
    },

    optimization: {
        splitChunks: {
            chunks: 'all',
            name: false,
        },
        runtimeChunk: true,
    },

    plugins: [
        new webpack.WatchIgnorePlugin([
            path.join(__dirname, "node_modules")
        ]),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.LoaderOptionsPlugin({
            options: {
                tslint: {
                    emitErrors: true,
                    failOnHint: false,
                },
            },
        }),
        new MicroAppWrapper({microApps: '../micro-apps', outFolderName: 'micro-apps'}),
        new CopyWebpackPlugin([
            { from: 'index.html', to: 'index.html' },
            { from: '../micro-apps', to: 'micro-apps' }
        ]),
    ],

    module: {
        rules: [
            /****************
             * PRE-LOADERS
             *****************/
            {
                enforce: 'pre',
                test: /\.js$/,
                use: 'source-map-loader',
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'tslint-loader',
            },

            /****************
             * LOADERS
             *****************/
            {
                test: /\.ts$/,
                exclude: [/node_modules/],
                use: 'awesome-typescript-loader',
            },
        ],
    },

    devtool: 'cheap-module-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        hot: true,
        index: 'index.html',
        inline: false,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000,
        },
        disableHostCheck: true,
        historyApiFallback: true,
    },
};
