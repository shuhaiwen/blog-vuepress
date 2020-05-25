const { resolve } = require('path')

module.exports = (options, context) => ({
  define () {
    const { clean, messages, theme, modelStyle, btnStyle, width, height, messageStyle } = options
    return {
      CLEAN: clean || false,
      THEME: theme || ['tsumiki'],
      MESSAGES: messages || {
        welcome: '',
        home: '心里的花，宝宝带您回家。',
        theme: '主人，您想看看宝宝的其它小伙伴吗？',
        close: '主人，您不想要宝宝了吗？痴痴地望着你。'
      },
      MESSAGE_STYLE: messageStyle || {
        right: '68px',
        bottom: '190px'
      },
      MODEL_STYLE: modelStyle || {
        right: '90px',
        bottom: '-20px',
        opacity: '0.9'
      },
      BTN_STYLE: btnStyle || {
        right: '90px',
        bottom: '40px'
      },
      WIDTH: width || 150,
      HEIGHT: height || 220
    }
  },
  name: '@vuepress-reco/vuepress-plugin-kan-ban-niang',
  enhanceAppFiles: resolve(__dirname, './bin/enhanceAppFile.js'),
  globalUIComponents: 'KanBanNiang'
})
