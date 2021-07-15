---
title: gdb教程
date: 2021-0-03
sidebarDepth: 2
tags:
 - gdb
categories:
 - Linux
---
# gdb教程
## 基本调试指令
**(gdb)表示已进入调试程序，不代表实际指令，[command]中表示指令的全拼**
1. 进入gdb调试：`gdb 可执行程序`
2. 开始执行程序(start 将会在程序入口main含糊打断点，在运行run停在main函数上)：`(gdb) start`
3. 列出带行号的源代码：`(gdb) l[list]`
4. 打断点：`(gdb) b[break] 行号`
5. 运行程序到下一个断点处停止：`(gdb) r[run]`
6. 继续到下一个断点处停下：`(gdb) c[continue]`
7. 往下执行一行代码（遇到函数不进入函数内部）：`(gdb) n[next]`
8. 往下执行一行代码（遇到函数进入函数内部）：`(gdb) s[step]`
9. 打印变量值：`(gdb) p[print] 变量名`
10. 终止调试：`(gdb) q[quit]`

## 堆栈帧
- 解释：GDB 调试器会按照既定规则对它们进行编号：当前正被调用函数对应的栈帧的编号为 0，调用它的函数对应栈帧的编号为 1，以此类推。
1. 跳到某一个堆栈帧：`(gdb) f[frame] 堆栈帧编号`
2. 基于当前帧前进一个帧（即帧编号+1）：`(gbd) up [number默认1]`
3. 基于当前帧后退一个帧（即帧编号-1）：`(gdb) down [number默认1]`
4. 查看当前帧存储的信息：`(gdb) info frame`
5. 查看当前帧函数参数值：`(gdb) info args`
6. 查看当前帧局部变量值：`(gdb) info locals`
## 调试coredump文件
1. `gdb 可执行程序 core文件`
2. `bt`或`where`查看堆栈信息

## info查看信息
**info简写是i**
1. 打印所有函数名称：`(gdb) info functions`
2. 打印当前函数局部变量：`(gdb) info locals`
3. 打印当前函数堆栈帧信息：`(gdb) info frame`
4. 打印寄存器信息：`(gdb) info registers`
5. 打印线程信息：`(gdb) info threads`
6. 打印进程信息：`(gdb) info inferiors`

## 调试运行中的进程
1. 在终端输入gdb进入gdb模式：`gdb`
2. 连接运行中的进程(指定进程id)：`(gdb) attach processID`
3. 使用其它调试指令

## 调试子进程
### 设置进入子进程
1. 设置进入子进程：`(gdb) set follow-fork-mode child`
### 同时调试父子进程
1. 同时调试父子进程：`(gdb) set detach-on-fork off`
2. 查看进程状态：`(gdb) info inferiors`
3. 切换某一个进程：`(gdb) inferiors infno`
### 父子进程同时运行
1. `(gdb) set schedule-multiple on`

## 调试线程
### 只允许同一时间运行一个线程
默认我们调试线程时，所有线程都会执行，如果我们只想要当前线程执行，可以如下设置。
1. `(gdb) set scheduler-locking on`