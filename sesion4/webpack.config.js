module.exports = {
    mode: "development",
    entry: {
        "prac4-1": "./src/prac4-1.js",
        "prac4-2": "./src/prac4-2.js",
        "prac4-3": "./src/prac4-3.js",
        "prac4-4": "./src/prac4-4.js"
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