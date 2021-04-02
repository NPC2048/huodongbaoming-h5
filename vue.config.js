module.exports = {
  devServer: {
    open: true,
    port: 8081,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8082',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}