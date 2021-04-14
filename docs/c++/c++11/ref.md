---
title: std::ref
date: 2021-04-13
sidebarDepth: 2
tags:
 - ref
categories:
 - C++11
---
# std::ref
- 头文件：`<functional>`
- 功能:转换左值或左值引用到左值引用
- 使用场景：作为`bind`绑定函数时，传递左值引用作为参数。
- 示例
```cpp
#include <functional>
#include <iostream>
 
void f(int& n1, int& n2, const int& n3)
{
    std::cout << "In function: " << n1 << ' ' << n2 << ' ' << n3 << '\n';
    ++n1; // 增加存储于函数对象的 n1 副本
    ++n2; // 增加 main() 的 n2
    // ++n3; // 编译错误
}
 
int main()
{
    int n1 = 1, n2 = 2, n3 = 3;
    std::function<void()> bound_f = std::bind(f, n1, std::ref(n2), std::cref(n3));
    n1 = 10;
    n2 = 11;
    n3 = 12;
    std::cout << "Before function: " << n1 << ' ' << n2 << ' ' << n3 << '\n';
    bound_f();
    std::cout << "After function: " << n1 << ' ' << n2 << ' ' << n3 << '\n';
}
```
- 输出结果
```
Before function: 10 11 12
In function: 1 11 12
After function: 10 12 12
```
- 源码分析
  - `ref`模板函数有3个版本；
  - 右值引用参数版被删除，因此`ref`匹配右值时会编译期报错；
  - `ref`返回类型是`reference_wrapper`，这个类实现了转换函数，用于隐式转换`_Ty&`类型
```cpp
// 匹配左值参数
template <class _Ty>
_NODISCARD _CONSTEXPR20 reference_wrapper<_Ty> ref(_Ty& _Val) noexcept {
    return reference_wrapper<_Ty>(_Val);
}

template <class _Ty>
void ref(const _Ty&&) = delete;
//匹配reference_wrapper作为参数
template <class _Ty>
_NODISCARD _CONSTEXPR20 reference_wrapper<_Ty> ref(reference_wrapper<_Ty> _Val) noexcept {
    //此处ref会调用ref(_Ty& _Val)版本
    return _STD ref(_Val.get());
}
```