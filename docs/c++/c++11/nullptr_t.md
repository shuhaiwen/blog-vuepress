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
```cpp
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
- 源码分析:
  - 利用`decltype`来识别`nullptr`类型，在利用`typedef`定义类型别名`nullptr_t`
  - `#define nullptr _VSTD::__get_nullptr_t()`用来获取`nullptr_t`的实例,`__get_nullptr_t`函数内部调用`nullptr_t(int __nat::*)`构造函数并返回`nullptr_t`的实例
  - `nullptr_t`类中定义了类型转换函数` operator _Tp* () const {return 0;}`,一次`nullptr`可以隐式转换为任意类型指针，且指向`0`,即空指针。
  - `nullptr_t`中重载了判等运算符，且将其作为友元，因此。

```cpp
// -*- C++ -*-
//===--------------------------- __nullptr --------------------------------===//
//
// Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.
// See https://llvm.org/LICENSE.txt for license information.
// SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception
//
//===----------------------------------------------------------------------===//

#ifndef _LIBCPP_NULLPTR
#define _LIBCPP_NULLPTR

#include <__config>

#if !defined(_LIBCPP_HAS_NO_PRAGMA_SYSTEM_HEADER)
#pragma GCC system_header
#endif

#ifdef _LIBCPP_HAS_NO_NULLPTR

_LIBCPP_BEGIN_NAMESPACE_STD

struct _LIBCPP_TEMPLATE_VIS nullptr_t
{
    void* __lx;

    struct __nat {int __for_bool_;};

    _LIBCPP_INLINE_VISIBILITY _LIBCPP_CONSTEXPR nullptr_t() : __lx(0) {}
    _LIBCPP_INLINE_VISIBILITY _LIBCPP_CONSTEXPR nullptr_t(int __nat::*) : __lx(0) {}

    _LIBCPP_INLINE_VISIBILITY _LIBCPP_CONSTEXPR operator int __nat::*() const {return 0;}

    template <class _Tp>
        _LIBCPP_INLINE_VISIBILITY _LIBCPP_CONSTEXPR
        operator _Tp* () const {return 0;}

    template <class _Tp, class _Up>
        _LIBCPP_INLINE_VISIBILITY
        operator _Tp _Up::* () const {return 0;}

    friend _LIBCPP_INLINE_VISIBILITY _LIBCPP_CONSTEXPR bool operator==(nullptr_t, nullptr_t) {return true;}
    friend _LIBCPP_INLINE_VISIBILITY _LIBCPP_CONSTEXPR bool operator!=(nullptr_t, nullptr_t) {return false;}
};

inline _LIBCPP_INLINE_VISIBILITY _LIBCPP_CONSTEXPR nullptr_t __get_nullptr_t() {return nullptr_t(0);}

#define nullptr _VSTD::__get_nullptr_t()

_LIBCPP_END_NAMESPACE_STD

#else  // _LIBCPP_HAS_NO_NULLPTR

namespace std
{
    typedef decltype(nullptr) nullptr_t;
}

#endif  // _LIBCPP_HAS_NO_NULLPTR

#endif  // _LIBCPP_NULLPTR
```