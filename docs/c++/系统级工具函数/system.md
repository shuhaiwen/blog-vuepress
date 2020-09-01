---
title: std::system
date: 2020-08-31
sidebarDepth: 2
tags:
 - system
categories:
 - C++系统级工具函数
---

# std::system
- 头文件： `cstdlib` or `stdlib.h`
- 定义：`int system( const char* command );`
- 功能：以参数 command 调用运行环境的命令处理器（例如 /bin/sh 、 cmd.exe 、 command.com ）。返回相应实现的定义值（通常是被调用程序所返回的值）。
- 示例
```c++
int main()
{
    // 执行 UNIX 命令 "ls -l >test.txt"
    std::system("ls -l >test.txt"); 
    // 强制结束某一进程
    system("taskkill /f /t /im Code.exe");//结束vscode
}

```