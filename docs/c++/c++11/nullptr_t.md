---
title: std::nullptr_t
date: 2020-10-10
sidebarDepth: 2
tags:
 - nullptr_t
categories:
 - C++11
---

# std::nullptr_t
- 头文件： `cstddef`
- 功能：std::nullptr_t 是空指针字面量 nullptr 的类型。它是既非指针类型亦非指向成员指针类型的独立类型
- 示例
```c++
#include <cstddef>
#include <iostream>
 
void f(int*)
{
   std::cout << "Pointer to integer overload\n";
}
 
void f(double*)
{
   std::cout << "Pointer to double overload\n";
}
 
void f(std::nullptr_t)
{
   std::cout << "null pointer overload\n";
}
 
int main()
{
    int* pi {}; double* pd {};
 
    f(pi);
    f(pd);
    f(nullptr); // 无 void f(nullptr_t) 可能有歧义
    // f(0);    // 歧义调用：三个函数全部为候选
    // f(NULL); // 若 NULL 是整数空指针常量则为歧义
                // （如在大部分实现中的情况）
}
```
- 源码分析:利用`decltype`来识别`nullptr`类型，在利用`typedef`定义类型别名`nullptr_t`
```c++
typedef decltype(nullptr) nullptr_t;
```