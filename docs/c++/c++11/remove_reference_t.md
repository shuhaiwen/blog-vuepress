---
title: remove_reference_t
date: 2020-10-14
sidebarDepth: 2
tags:
 - remove_reference_t
categories:
 - C++11
---
- [remove_reference_t](#remove_reference_t)
# remove_reference_t
- 头文件：`type_traits`
- 功能：移除类型的引用`&`或`&&`
- 源码分析:`remove_reference_t`是`remove_reference::type`的别名，`remove_reference`有3个定义，分别接收`T`、`T&`和`T&&`，即左值，左值引用和右值引用，而`type`始终执行`T`,即左值，因此达到去除引用的目的。
```c++
// STRUCT TEMPLATE remove_reference
template <class _Ty>
struct remove_reference {
    using type                 = _Ty;
    using _Const_thru_ref_type = const _Ty;
};

template <class _Ty>
struct remove_reference<_Ty&> {
    using type                 = _Ty;
    using _Const_thru_ref_type = const _Ty&;
};

template <class _Ty>
struct remove_reference<_Ty&&> {
    using type                 = _Ty;
    using _Const_thru_ref_type = const _Ty&&;
};

template <class _Ty>
using remove_reference_t = typename remove_reference<_Ty>::type;
```