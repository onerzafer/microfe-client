'use strict';
const rxPaths = require('rxjs/_esm5/path-mapping');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    devtool: 'inline-source-map',
    entry: './src/main.ts',
    output: {
        pathinfo: false,
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: false,
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        modules: ['./node_modules'],
        alias: rxPaths(),
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            tslintAutoFix: true,
            formatter: 'codeframe',
        }),
    ],
};
