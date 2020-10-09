---
title: std::forward
date: 2020-10-09
sidebarDepth: 2
tags:
 - forward
categories:
 - C++11
---

# std::forward
- 头文件：`utility`
- 功能：
  - 转发左值为左值或右值
  - 转发右值为右值并禁止右值的转发为左值
- 源码分析:
  - `forward`有2个实现，实现一功能是转发左值为左值或右值，实现二功能是转发右值为右值并禁止右值的转发为左值。在实现二中有一静态检查`static_assert(!is_lvalue_reference_v<_Ty>, "bad forward call");`,其作用是判断模板参数类型`_Ty`是否是左值，`is_lvalue_reference_v`有2个定义，定义二`template <class _Ty> _INLINE_VAR constexpr bool is_lvalue_reference_v<_Ty&> = true;`会接受左值类型，定义一`template <class> _INLINE_VAR constexpr bool is_lvalue_reference_v = false; // determine `会接受右值，因此当转发右值为左值编译器会发出警告
```c++
// STRUCT TEMPLATE is_lvalue_reference
template <class>
_INLINE_VAR constexpr bool is_lvalue_reference_v = false; // determine whether type argument is an lvalue reference

template <class _Ty>
_INLINE_VAR constexpr bool is_lvalue_reference_v<_Ty&> = true;

// FUNCTION TEMPLATE forward
template <class _Ty>
_NODISCARD constexpr _Ty&& forward(
    remove_reference_t<_Ty>& _Arg) noexcept { // forward an lvalue as either an lvalue or an rvalue
    return static_cast<_Ty&&>(_Arg);
}

template <class _Ty>
_NODISCARD constexpr _Ty&& forward(remove_reference_t<_Ty>&& _Arg) noexcept { // forward an rvalue as an rvalue
    static_assert(!is_lvalue_reference_v<_Ty>, "bad forward call");
    return static_cast<_Ty&&>(_Arg);
}
```
- 示例
```c++
void PrintV(int& t) {
    ++t;
    cout << "lvalue" << endl;
}

void PrintV(int&& t) {
    cout << "rvalue" << endl;
}

template<typename T>
void Test(T&& t) {

    PrintV(t);
    PrintV(std::forward<T>(t));

    PrintV(std::move(t));
}

#include<tuple>
int main() {
    Test(1); // lvalue rvalue rvalue
    int a = 1;
    Test(a); // lvalue lvalue rvalue
    Test(std::forward<int>(a)); // lvalue rvalue rvalue
    Test(std::forward<int&>(a)); // lvalue lvalue rvalue
    Test(std::forward<int&&>(a)); // lvalue rvalue rvalue
    Test(std::forward<int>(2)); // lvalue rvalue rvalue
    //Test(std::forward<int&>(2)); // error编译错误bad forward call
    Test(std::forward<int&&>(2)); // lvalue rvalue rvalue    
    return 0;
}
```