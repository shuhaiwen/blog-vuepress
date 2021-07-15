---
title: Linux常识
date: 2021-06-25
sidebarDepth: 2
tags:
 - Linux
categories:
 - Linux
---
# Linux常识
## 目录的硬链接数为什么不是1？
::: info 目录的硬链接数为什么不是1？
因为在目录下存在隐藏文件. 和..，.是硬链接指向当前目录，所以当前目录硬链接数变为2，而父目录因为子目录的..和父目录自己的.，所以父目录硬链接数是3。（使用`ls -l`查看目录硬链接数）
::: 
## ls -l 目录大小
- https://www.pianshen.com/article/45281509680/
- https://www.jianshu.com/p/1c22dcb17a2e


