module.exports = {
    title: '小锋哥的博客',
    description: '小锋哥的博客',
    head: [ // 注入到当前页面的 HTML <head> 中的标签
      ['link', { rel: 'icon', href: '/github.svg' }], // 增加一个自定义的 favicon(网页标签的图标)
    ],
    markdown: {
      lineNumbers: true
    },
    serviceWorker: true,
    plugins: [
      [
      require('./plugins/KanBanNiang'),
      {
        theme: ['blackCat'],
        width: 200,
        height: 470,
        modelStyle: {
          position: 'fixed',
          right: '110px',
          bottom: '50px',
          opacity: '0.9'
        },
        messageStyle: {
          position: 'fixed',
          right: '110px',
          bottom: '370px'
        },
        btnStyle: {
          bottom: '60px',
          right: '80px'
        }
      }
    ],
    [
      require('./plugins/BgMusic'),
      {
        audios: [
          {
            name: '能够成家吗',
            artist: '咖啡少年',
            url: 'https://assets.smallsunnyfox.com/music/1.mp3',
            cover: 'https://assets.smallsunnyfox.com/music/1.jpg'
          },
          {
            name: '江南地铁站4号出口',
            artist: 'Plastic / Fallin` Dild',
            url: 'https://assets.smallsunnyfox.com/music/2.mp3',
            cover: 'https://assets.smallsunnyfox.com/music/2.jpg'
          },
          {
            name: '用胳膊当枕头',
            artist: '최낙타',
            url: 'https://assets.smallsunnyfox.com/music/3.mp3',
            cover: 'https://assets.smallsunnyfox.com/music/3.jpg'
          }
        ]
      }
    ]
    ],
    themeConfig: {
      logo: '/github.svg',  // 左上角logo
      nav:[ // 导航栏配置
        {text: '首页', link: '/' },
        {
          text: '教程',
          ariaLabel: '教程',
          items: [
            {text: 'C++',link: '/pages/C++/c++ 指针.md'},
            {text: 'Git',link: '/pages/Git/git常用指令.md'},
            {text: 'cmake',link: '/pages/cmake/cmake 错误汇总.md'},
            {text: 'Linux',link: '/pages/Linux/Linux命令学习步骤.md'},
            {text: 'markdown',link: '/pages/markdown/README.md'},
            {text: 'npm',link: '/pages/npm/npm命令.md'},
            {text: 'XML',link: '/pages/XML/xml总结.md'},
          ]
        },
        {text: 'GitHub',link: 'https://github.com/shuhaiwen'}
      ],
      sidebar: 'auto', // 侧边栏配置
    }
  };
