---
title: 踩坑electron
date: 2020-11-10
sidebarDepth: 2
tags:
 - electron
 - 踩坑
categories:
 - 前端
---
- [踩坑electron](#踩坑electron)
  - [require is not defined](#require-is-not-defined)
# 踩坑electron
## require is not defined
- 问题原因：浏览器不支持require语法
- 解决：在electron中是可以在html文件中使用require语法的，但需要开启node.js环境，在main.js文件中添加`nodeIntegration:true`
```js
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration:true//设置true才可以在html中使用node.js环境
    }
  })
```