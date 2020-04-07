module.exports = {
  title: '题目',
  description: '题目收集',
  base: '/interview-topic/',
  markdown: {
    lineNumbers: true, // 代码行显示行号
    toc: {  //  显示目录
      includeLevel: [2, 3, 4, 5, 6]
    }
  },
  themeConfig: {
    navbar: true,
    sidebarDepth: 3,  // 侧边目录的层级
    displayAllHeaders: true,
    activeHeaderLinks: true,
    sidebar: 'auto',
    lastUpdated: '上次更新',
    nextLinks: false,
    prevLinks: false,
    smoothScroll: true,
    nav: [
      { 
        text: 'GitHub', 
        link: 'https://github.com/erichui' 
      },
    ],
    sidebar: [
      {
        title: 'CSS 相关',   // 必要的
        collapsable: false,
        children: [
          ["css-topic/", "CSS 基础"]
        ]
      },
      {
        title: 'JS 相关',
        collapsable: false,
        children: [
          ["js-topic/", "JS 基础"]
        ]
      },
      {
        title: '网络相关',
        collapsable: false,
        children: [
          ["network/http-history", "HTTP不同版本对比"]
        ]
      },
      {
        title: '框架相关',
        collapsable: false,
        children: [
          ["frame-topic/react", "react 相关"],
          ["frame-topic/vue", "vue 相关"],
        ]
      },
    ]
  }
}