const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

// eslint-disable-next-line
module.exports = function (context, options) {
    return {
        name: 'polyfills-plugin',
        // eslint-disable-next-line
        configureWebpack(config, isServer, utils) {
            return {
                externals: {
                    madnetjs: 'madnetjs'
                },
                resolve: {
                    alias: {
                        process: require.resolve('process'),
                        Buffer: require.resolve('buffer'),
                    },
                    fallback: {
                        path: require.resolve('path-browserify'),
                        assert: require.resolve("assert"),
                        crypto: require.resolve("crypto-browserify"),
                        fs: false,
                        http: require.resolve("stream-http"),
                        https: require.resolve("https-browserify"),
                        os: require.resolve("os-browserify"),
                        stream: require.resolve("stream-browserify"),
                        url: require.resolve("url")
                    },
                },
                plugins: [
                    new webpack.ProvidePlugin({
                        process: 'process/browser',
                        Buffer: ['buffer', 'Buffer']
                    })
                ],
                output: {
                    libraryTarget: "umd"
                }
            };
        },
    };
};