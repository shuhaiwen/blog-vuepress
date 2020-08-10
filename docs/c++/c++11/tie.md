---
title: std::tie
date: 2020-08-08
sidebarDepth: 2
tags:
 - tie
categories:
 - C++11
---
# std::tie

- 头文件：tuple
- 功能：解构pair和tuple类型数据,可以与std::ignore配合使用
- 示例
```c++
#include <tuple>
 
int main()
{
   int a1 = 0, a2 = 0;
   auto tp = tie(a1, a2) = pair<int, int>(1, 2);
}
```
- 源码分析：tie是一个模板函数，参数是引用类型，返回值一个tuple类型，其中存储了引用数据，正因为此，当tie函数执行时，返回tuple值作为左值，通过调用tuple的赋值运算符操作，右值的数据使tuple中存储的数据变化，从而使tie参数数据变化。（变化的主要原因是tie参数和返回值tuple中数据都是引用类型）
```c++
// FUNCTION TEMPLATE tie
template <class... _Types>
_NODISCARD constexpr tuple<_Types&...> tie(_Types&... _Args) noexcept { // make tuple from elements
    using _Ttype = tuple<_Types&...>;
    return _Ttype(_Args...);
}
```