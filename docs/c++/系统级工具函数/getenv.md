---
title: std::getenv
date: 2020-08-31
sidebarDepth: 2
tags:
 - getenv
categories:
 - C++系统级工具函数
---

# std::getenv
- 头文件： `cstdlib` or `stdlib.h`
- 定义：`char* getenv( const char* env_var );`
- 功能：于宿主环境（操作系统）提供的环境列表搜索匹配 env_var 所指向的 C 字符串，并返回指向与匹配的列表成员关联的 C 字符串的指针。
- 示例
```cpp
int main()
{
    if(const char* env_p = std::getenv("PATH"))
        std::cout << "Your PATH is: " << env_p << '\n';
}

```