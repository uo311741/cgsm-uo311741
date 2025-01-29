module.exports = {
    mode: "development",
    entry: {
        "prac1-1":"./src/prac1-1.js",
        "prac1-2":"./src/prac1-2.js",
        "prac1-3": "./src/prac1-3.js",
        "prac1-4": "./src/prac1-4.js"
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
