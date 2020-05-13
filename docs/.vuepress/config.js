module.exports = {
    title: '小锋哥的博客',
    base:'blog-vuepress',
    head: [ // 注入到当前页面的 HTML <head> 中的标签
      ['link', { rel: 'icon', href: '/logo.png' }], // 增加一个自定义的 favicon(网页标签的图标)
    ],
    themeConfig: {
      logo: '/logo.png',  // 左上角logo
      nav:[ // 导航栏配置
        {text: '首页', link: '/' }    
      ],
      sidebar: 'auto', // 侧边栏配置
    }
  };