---
title: std::ignore
date: 2020-08-07
sidebarDepth: 2
tags:
 - declval
categories:
 - C++11
---

# declval
- 头文件：utility
- 功能：常与decltype一起使用，用来直接从类中获取成员类型
- 示例
```c++
#include <utility>
#include <iostream>
 
struct Default { int foo() const { return 1; } };
 
struct NonDefault
{
    NonDefault() = delete;
    string m_str;
    int foo() const { return 1; }
};
 
int main()
{
    decltype(Default().foo()) n1 = 1;                   // n1 的类型是 int
//  decltype(NonDefault().foo()) n2 = n1;               // 错误：无默认构造函数
    decltype(std::declval<NonDefault>().foo()) n2 = n1; // n2 的类型是 int
    decltype(std::declval<NonDefault>().m_str) n3;      //n3的类型是string
    
}
```
- 源码分析：模板函数`declval`（只声明不定义）最终返回的是_Ty类型
```c++
// STRUCT TEMPLATE _Add_reference
template <class _Ty, class = void>
struct _Add_reference { // add reference (non-referenceable type)
    using _Lvalue = _Ty;
    using _Rvalue = _Ty;
};

template <class _Ty>
using add_rvalue_reference_t = typename _Add_reference<_Ty>::_Rvalue;

// FUNCTION TEMPLATE declval
template <class _Ty>
add_rvalue_reference_t<_Ty> declval() noexcept;
```