---
title: visual studio错误集
date: 2020-05-21
sidebarDepth: 2
tags:
 - VS
categories:
 - C++
 - Solution
---
# fatal error LNK1149 输出文件名匹配输入文件名
## 报错可能原因
错把 “属性->生成事件->后期生成事件”中的命令行语句写在了“属性->链接器->命令行”中
## 解决方法
删除“属性->链接器->命令行”中无效的语句