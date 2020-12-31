---
title: reference
date: 2020-10-12
sidebarDepth: 2
tags:
 - reference
categories:
 - C++11
---
# reference
## 引用坍缩(reference collapsing)
- 规则：右值引用的右值引用坍缩成右值引用，所有其他组合均坍缩成左值引用
- 示例
```cpp
int main()
{
    typedef int& lref;
    typedef int&& rref;
    int n=2;
    lref& r1 = n; // r1 的类型是 int&
    lref&& r2 = n; // r2 的类型是 int&
    rref& r3 = n; // r3 的类型是 int&
    rref&& r4 = 1; // r4 的类型是 int&&
}
```
## 万能引用&&
- 功能：模板T&&或关键字auto&&接收左值或右值，并自动推导左值引用或右值引用类型
- 实现方法：通过引用坍缩特性，右值引用的右值引用依然是右值引用，左值或左值引用的右值引用是左值引用
- 示例
```cpp
template<class T>
bool test(T&& t)
{
    return true;
}
int&& test1(int& n) {
    return move(n);
}
int main()
{
    int n=2;
    test(2);//test函数中t的类型是 int&&
    test(n);//test函数中t的类型是 int&
    auto&& i1 = test1(n);// i1的类型是 int&&
    auto&& i2 = n;// i2的类型是 int&
    auto&& i3 = 3;// i3的类型是 int&&
}
```