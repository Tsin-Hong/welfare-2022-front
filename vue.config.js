module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: process.env.NODE_ENV === 'production'
    ? '/welfare22/'
    : '/',
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = '睿訊群英傳 貳零貳貳'
      return args
    })
  }
}
