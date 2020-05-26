module.exports = {
  title: '小锋哥的博客',
  dest: 'blog',
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
        theme: ['miku','tsumiki']	,
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
        ],
        floatPosition: 'mini',

      }
    ],
    [
      '@vuepress/pwa', 
      {
        serviceWorker: true,
        updatePopup: {
          message: "发现新内容可用",
          buttonText: "刷新"
        }
      }
    ]
  ],
  theme: 'reco',
  themeConfig: {
    // 左上角logo
    logo: '/github.svg',
    authorAvatar: '/github.svg',
    type: 'blog',
    // 导航栏配置
    nav: [
      { text: '首页', link: '/' },
      {
        text: '教程', link: '/pages/' //引用到docs/pages/README.md
        // ariaLabel: '教程1',
        // items: [
        //   { text: 'C++', link: '/pages/C++/' },
        //   { text: 'Git', link: '/pages/Git/git常用指令.md' },
        //   { text: 'cmake', link: '/pages/cmake/cmake 错误汇总.md' },
        //   { text: 'Linux', link: '/pages/Linux/Linux命令学习步骤.md' },
        //   { text: 'markdown', link: '/pages/markdown/README.md' },
        //   { text: 'npm', link: '/pages/npm/npm命令.md' },
        //   { text: 'XML', link: '/pages/XML/xml总结.md' },
        // ]
      },
      { text: 'TimeLine', link: '/timeline/', icon: 'reco-date' },
      { text: 'GitHub', link: 'https://github.com/shuhaiwen' }
    ],
    // 博客设置
    blogConfig: {
      category: {
        location: 2, // 在导航栏菜单中所占的位置，默认2
        text: 'Category' // 默认 “分类”
      },
      tag: {
        location: 3, // 在导航栏菜单中所占的位置，默认3
        text: 'Tag' // 默认 “标签”
      }
    },
    //侧边栏
    sidebarDepth: 1,
    displayAllHeaders: false, // 默认值：false
    activeHeaderLinks: true, // 默认值：true
    sidebar: {
      // '/pages/':[
      //   {
      //     title:'C++',
      //     collapsable: true,
      //     children:[
      //       'C++/别名归类',
      //       'C++/移动语义',
      //       'C++/c++随机数'
      //     ]
      //   },
      //   {
      //     title:'Git',
      //     collapsable: true,
      //     children:[
      //       'Git/git常用指令',
      //     ]
      //   },
       
      // ],
      '/pages/':require('../pages')('./docs/pages')//后一个路径以项目package.json所在路径为起点
    },
   
    //主题色
    mode: 'auto', // 默认 auto，auto 跟随系统，dark 暗色模式，light 亮色模式
    modePicker: true, // 默认 true，false 不显示模式调节按钮，true 则显示
    // 作者
    author: 'shuhaiwen',
    // 最后更新时间
    lastUpdated: 'Last Updated',
    startYear: '2020',
    //腾讯公益链接404
    noFoundPageByTencent: false,
  },
  locales: {
    '/': {
      lang: 'en-US'//默认en-US
    }
  },
};
