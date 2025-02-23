module.exports = {
    mode: "development",
    entry: {
        "prac5-1": "./src/prac5-1.js",
        "prac5-2": "./src/prac5-2.js"
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