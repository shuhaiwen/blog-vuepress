---
title: std::move
date: 2020-09-28
sidebarDepth: 2
tags:
 - move
categories:
 - C++11
---

# std::move
- 头文件：`utility`
- 功能：将左值转换为右值引用
- 源码分析:将`move`简化,大致形如`T&& move(T&& _Arg){return static_cast<T&&>(_Arg)};`,整个源码最主要的代码段就是`static_cast<remove_reference_t<_Ty>&&>(_Arg)`,通过强制转换，将输入数据转为右值引用，输入的数据可以是左值、左值引用、右值、右值引用。`move`并不会将数据从A搬移到B，进行数据搬移的是类的移动赋值函数或移动构造函数，或实现的移动语义的其它函数，`move`仅仅是将输入的数据强制转为右值引用类型。

::: info
`std::move`并不会搬移数据，搬移数据的操作是由移动拷贝构造或移动赋值运算符处理的。
:::
```cpp
// STRUCT TEMPLATE remove_reference
template <class _Ty>
struct remove_reference {
    using type                 = _Ty;
    using _Const_thru_ref_type = const _Ty;
};

// FUNCTION TEMPLATE move
template <class _Ty>
using remove_reference_t = typename remove_reference<_Ty>::type;

template <class _Ty>
_NODISCARD constexpr remove_reference_t<_Ty>&& move(_Ty&& _Arg) noexcept { // forward _Arg as movable
    return static_cast<remove_reference_t<_Ty>&&>(_Arg);
}
```
- 示例
```cpp
int main()
{
    string a = "hello";
    string& b = a;
    std::move(a);//左值：a的数据并不会丢失
    std::move(b);//左值引用：b的数据并不会丢失
    string c=std::move(b);//将b转为右值引用后，再赋给c，会调用c的移动拷贝，在c的移动拷贝构造中，会将b数据搬移到c，导致b数据丢失
    string d=std::move(std::move(a));//左值->右值引用
}
```