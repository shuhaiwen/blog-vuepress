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
  - [electron 调用 node C++ addon](#electron-调用-node-c-addon)
    - [问题1：require is not defined](#问题1require-is-not-defined)
    - [问题2：Loading non-context-aware native module in renderer,but app.allowRendererProcessReuse is true.](#问题2loading-non-context-aware-native-module-in-rendererbut-appallowrendererprocessreuse-is-true)
    - [NODE_MODULE_VERSION 版本不对](#node_module_version-版本不对)
  - [使用vue-devTools](#使用vue-devtools)
# 踩坑electron
## electron 调用 node C++ addon
### 问题1：require is not defined
- 问题原因：浏览器不支持require语法
- 解决方法：在electron中是可以在html文件中使用require语法的，但需要开启node.js环境，在main.js文件中添加`nodeIntegration:true`
```javascript
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration:true//设置true才可以在html中使用node.js环境
    }
  })
```
### 问题2：Loading non-context-aware native module in renderer,but app.allowRendererProcessReuse is true.
- 问题原因：在版本9之后，app.allowRendererProcessReuse将默认设置为true
- 解决方法：在main.js中设置`app.allowRendererProcessReuse = false;`
```javascript
const {app, BrowserWindow} = require('electron')
const path = require('path')

app.allowRendererProcessReuse=false;
```
### NODE_MODULE_VERSION 版本不对
- 问题原因：electron自带的node版本与本地node版本不一致
- 解决方法：使用electron-rebuild工具重新编译
```shell
# 安装electron-rebuild
npm i -D electron-rebuild
# 执行编译
./node_modules/.bin/electron-rebuild
```
## 使用vue-devTools
1. 在chrome上安装vue-devTools
2. 在chrome扩展界面找到Vue.js devtools，并找到id值如，`ljjemllljcmogpfapbkkighbhhppjdbg`
3. 在本地电脑上搜索词id值，找到该扩展文件夹，如vue-devTools的beta版文件夹名`6.0.0.2_0`
4. 在electron-vue项目的background.js文件中的修改如下代码
```javascript
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      // await installExtension(VUEJS_DEVTOOLS) //注释掉原先代码
      //以下2行新增
      const { session } = require("electron");
      session.defaultSession.loadExtension('...\\Google\\Chrome\\User Data\\Default\\Extensions\\ljjemllljcmogpfapbkkighbhhppjdbg\\6.0.0.2_0');//引号内是vue-devTools扩展地址
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})
```
5. 运行 `yarn run electron:serve`，查看结果