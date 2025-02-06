module.exports = {
    mode: "development",
    entry: {
        "prac3-1":"./src/prac3-1.js",
        "prac3-2":"./src/prac3-2.js",
        "prac3-3":"./src/prac3-3.js",
    },
    devtool: 'inline-source-map',
    devServer: {
        static: {
            directory: __dirname
        },
        devMiddleware: {
            writeToDisk: true
        }
    },
    performance: {
        maxAssetSize: 1000000,
        maxEntrypointSize: 1000000
    }
};