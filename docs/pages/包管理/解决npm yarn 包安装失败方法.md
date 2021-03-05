---
title: 解决npm yarn 包安装失败方法
date: 2020-06-29
sidebarDepth: 2
tags:
 - Cmd
categories:
 - Npm
 - Yarn
 - Solution
---
# 解决npm yarn 包安装失败方法
1. 在项目根目录（package.json所在目录）下新建 .npmrc 或 .yarnrc 文件
2. 复制对应的配置到 .npmrc 或 .yarnrc 文件中
```shellsession
# .npmrc 配置文件
registry=https://registry.npm.taobao.org
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
phantomjs_cdnurl=http://cnpmjs.org/downloads
electron_mirror=https://npm.taobao.org/mirrors/electron/
sqlite3_binary_host_mirror=https://foxgis.oss-cn-shanghai.aliyuncs.com/
profiler_binary_host_mirror=https://npm.taobao.org/mirrors/node-inspector/
chromedriver_cdnurl=https://cdn.npm.taobao.org/dist/chromedriver

# .yarnrc 配置文件
registry "https://registry.npm.taobao.org"
sass_binary_site "https://npm.taobao.org/mirrors/node-sass/"
phantomjs_cdnurl "http://cnpmjs.org/downloads"
electron_mirror "https://npm.taobao.org/mirrors/electron/"
sqlite3_binary_host_mirror "https://foxgis.oss-cn-shanghai.aliyuncs.com/"
profiler_binary_host_mirror "https://npm.taobao.org/mirrors/node-inspector/"
chromedriver_cdnurl "https://cdn.npm.taobao.org/dist/chromedriver"

```
3. 执行npm i [packageName] 或者 yarn add [packageName]