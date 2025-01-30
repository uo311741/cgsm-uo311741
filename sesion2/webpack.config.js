module.exports = {
    mode: "development",
    entry: {
        "prac2-1":"./src/prac2-1.js",
        "prac2-2":"./src/prac2-2.js",
        "prac2-3":"./src/prac2-3.js",
        "prac2-4":"./src/prac2-4.js",
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