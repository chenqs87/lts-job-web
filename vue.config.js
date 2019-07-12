const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
const isProduction = true

module.exports = {
    lintOnSave: false,
    productionSourceMap: false,
    configureWebpack: config => {
        if (isProduction) {
            config.plugins.push(new CompressionWebpackPlugin({
                    algorithm: 'gzip',
                    test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                    threshold: 10240,
                    minRatio: 0.8
                })
            )
        }
    },
    devServer: {
        proxy: {
            '/console': {
                target: 'http://localhost:8080/console',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/console': ''
                }
            }
        }
    },
};
