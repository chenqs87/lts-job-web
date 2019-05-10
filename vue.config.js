module.exports = {
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
