---
title: SFINAE
date: 2020-12-04
sidebarDepth: 2
tags:
 - SFINAE
categories:
 - C++
---
# SFINAE
- 解释：Substitution Failure Is Not An Error(替换失败不是错误)
- 使用场景：在模板重载集中，匹配一个失败时会尝试下一个重载，直到所有都匹配失败，这时才是错误
- 示例
```c++
/*
 The compiler will try this overload since it's less generic than the variadic.
 T will be replace by int which gives us void f(const int& t, int::iterator* b = nullptr);
 int doesn't have an iterator sub-type, but the compiler doesn't throw a bunch of errors.
 It simply tries the next overload. 
*/
template <typename T> void f(const T& t, typename T::iterator* it = nullptr) { }

// The sink-hole.
void f(...) { }

f(1); // Calls void f(...) { }
```