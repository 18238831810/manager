/**
 * 配置参考: https://cli.vuejs.org/zh/config/
 */
module.exports = {
  baseUrl:process.env.VUE_APP_BASE_PATH,
  outputDir: 'crs',
  productionSourceMap: true,
  lintOnSave: false,
  configureWebpack: {
    //关闭 webpack 的性能提示
    performance: {
      hints:false
    },
  },
  devServer: {
    open: true,
    port: 8001,
    overlay: {
      errors: false,
      warnings: false
    }
  }
}
