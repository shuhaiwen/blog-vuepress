---
title: std::declval
date: 2020-08-07
sidebarDepth: 2
tags:
 - declval
categories:
 - C++11
---

# declval
- 头文件：utility
- 功能：declval是一个模板函数，常与`decltype`一起使用，令在 `decltype` 表达式中不必经过构造函数就能使用成员函数
- 注意：因为`declval`只有声明没有定义，因此只能用在*不求值语境*，所有可以用在`decltype`中
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