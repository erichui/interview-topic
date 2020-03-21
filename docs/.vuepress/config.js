module.exports = {
  title: '面试指北',
  description: '面试题目收集',
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    navbar: true,
    sidebarDepth: 1,
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
        title: '框架相关',
        collapsable: false,
        children: [
          ["frame-topic/react", "react 相关"]
        ]
      },
    ]
  }
}