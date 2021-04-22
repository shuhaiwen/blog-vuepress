---
title: UNIX C API
date: 2021-04-09
sidebarDepth: 2
tags:
 - UNIX C API
categories:
 - 面试汇总
---

# UNIX C API
## fork和vfork异同
- 执行顺序
  - `fork`：父进程和子进程执行先后顺序不确定，取决于内核调度算法。
  - `vfork`：子进程先执行`exec`函数簇或`exit`,子进程退出再执行父进程。
- 内存空间：
  - `fork`：子进程复制父进程的数据空间、堆、栈，共享代码段，子进程改变数据不会响父进程。
  - `vfork`：子进程并不完全复制父进程地址空间，子进程与父进程共享数据空间，子进程改变数据会影响父进程。
- `vfork`目的是创建一个新进程，再让新进程通过exec函数簇去执行一个新程序。
::: tip 写时复制技术(copy on write)
由于在fork之后，往往子进程直接使用exec函数簇去执行另一段代码，不需要使用到父进程的数据段、堆栈，复制这些不使用的区域会导致不必要的开销，写时复制技术可以解决此类问题。
当任意一个进程修改了这些数据时，则内核才为这块数据分配一个地址，制作一个副本。
:::
![](https://cdn.jsdelivr.net/gh/shuhaiwen/image-host/Img/linux_c/%E5%86%99%E6%97%B6%E5%A4%8D%E5%88%B6%E6%8A%80%E6%9C%AF%E7%A4%BA%E6%84%8F%E5%9B%BE.png)
### wait和waitpid异同
- `wait`使其调用者阻塞，`waitpid`由参数控制是否阻塞。