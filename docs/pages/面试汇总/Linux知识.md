---
title: Linux知识
date: 2021-03-09
sidebarDepth: 2
tags:
 - Linux知识
categories:
 - 面试汇总
---
# Linux知识
## Linux 启动流程
详见 [CS_Offer](https://github.com/selfboot/CS_Offer/blob/master/Linux_OS/Others.md)
## Linux指令
详见[linuxtools-readthedocs](https://linuxtools-rst.readthedocs.io/zh_CN/latest/tool/index.html)
## select、poll、epoll之间的区别
[资料1](https://www.cnblogs.com/aspirant/p/9166944.html)
[资料2](https://www.cnblogs.com/anker/p/3265058.html)
[资料3](https://zhuanlan.zhihu.com/p/115220699)
## 什么是shell
Shell 是一个应用程序，它连接了用户和 Linux 内核，让用户能够更加高效、安全、低成本地使用 Linux 内核，这就是 Shell 的本质。
详见[shell-c语言中文网](http://c.biancheng.net/view/706.html)
## 管道
管道（英语：Pipeline）是一系列将标准输入输出链接起来的进程，其中每一个进程的输出被直接作为下一个进程的输入。
详见[Linux的进程间通信：管道-知乎](https://zhuanlan.zhihu.com/p/58489873)
::: tip
管道遵循Linux一切皆文件的理念，管道实际上也是一个文件，但管道不占磁盘空间，而是存储在内存上。所以，Linux上的管道就是一个操作方式为文件的内存缓冲区。
:::
::: warning
管道是半双工的
:::
## fock之后先执行子进程还是父进程
标准没有规定，详见[知乎](https://www.zhihu.com/question/59296096)
## I/O 模型
Unix 下有5种可用的 I/O 模型，如下：
1. 阻塞式 I/O
2. 非阻塞式 I/O
3. I/O 复用（select 和 poll）
4. 信号驱动 I/O
5. 异步I/O
## 文件
### 文件类型

Linux的文件类型有以下几种:

| 文件类型	  | ls -l 显示 |
| ------     |  -----     |
|普通文件	  | -         |
|目录	     |   d        |
|符号链接	  |   l       |
|字符设备	  |    c      |
|块设备	     |   b        |
|套接字	     |     s      |
|命名管道	  |    p      |
### 软链接、硬链接
软链接：
1. 当源文件被删除后，软链接也将失效；
2. 当软链接被删除，不影响原文件；
::: tip
软连接是建立了一个iNode，专门用来指向实际文件的iNode，有点像Win下的快捷方式。软链接与硬链接不同，若文件用户数据块中存放的内容是另一文件的路径名的指向，则该文件就是软连接。软链接就是一个普通文件，只是数据块内容有点特殊。
:::
硬链接：
1. 当原文家删除后，硬链接还能访问数据；
2. 删除硬链接也不影响原文件；
3. 当原文件和所有硬链接都被删除是，数据才遗失。
::: tip
硬链接和原文件的inode是相同的，所以即使删掉原文件，硬链接也能访问inode指向的数据块。
:::