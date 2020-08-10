---
title: std::initializer_list
date: 2020-08-05
sidebarDepth: 2
tags:
 - initializer_list
categories:
 - C++11
---
# std::initializer_list

- 头文件：initializer_list
- 功能
  -  以花括号{}初始化对象
  -  以花括号{}为赋值的右运算数
  -  以花括号{}绑定到auto
- 示例
```c++
#include <iostream>
#include <vector>
#include <initializer_list>
 
template <class T>
struct S {
    std::vector<T> v;
    S(std::initializer_list<T> l) : v(l) {
         std::cout << "constructed with a " << l.size() << "-element list\n";
    }
    void append(std::initializer_list<T> l) {
        v.insert(v.end(), l.begin(), l.end());
    }
    std::pair<const T*, std::size_t> c_arr() const {
        return {&v[0], v.size()};  // 在 return 语句中复制列表初始化
                                   // 这不使用 std::initializer_list
    }
};
 
template <typename T>
void templated_fn(T) {}
 
int main()
{
    S<int> s = {1, 2, 3, 4, 5}; // 复制初始化
    s.append({6, 7, 8});      // 函数调用中的列表初始化
 
    std::cout << "The vector size is now " << s.c_arr().second << " ints:\n";
 
    for (auto n : s.v)
        std::cout << n << ' ';
    std::cout << '\n';
 
    std::cout << "Range-for over brace-init-list: \n";
 
    for (int x : {-1, -2, -3}) // auto 的规则令此带范围 for 工作
        std::cout << x << ' ';
    std::cout << '\n';
 
    auto al = {10, 11, 12};   // auto 的特殊规则
 
    std::cout << "The list bound to auto has size() = " << al.size() << '\n';
 
//    templated_fn({1, 2, 3}); // 编译错误！“ {1, 2, 3} ”不是表达式，
                             // 它无类型，故 T 无法推导
    templated_fn<std::initializer_list<int>>({1, 2, 3}); // OK
    templated_fn<std::vector<int>>({1, 2, 3});           // 也 OK
}

```
- 源码分析：initializer_list中的构造有2个参数，分别是数组首尾地址，有begin，end方法，分别返回首尾指针，还有一个size方法，通过首尾指针相减得到数组大小。猜测：在使用花括号时，花括号里自动构造一个数组，再将数组首尾指针传给initializer_list的构造中。
```c++
template <class _Elem>
class initializer_list {
public:
    using value_type      = _Elem;
    using reference       = const _Elem&;
    using const_reference = const _Elem&;
    using size_type       = size_t;

    using iterator       = const _Elem*;
    using const_iterator = const _Elem*;

    constexpr initializer_list() noexcept : _First(nullptr), _Last(nullptr) {}

    constexpr initializer_list(const _Elem* _First_arg, const _Elem* _Last_arg) noexcept
        : _First(_First_arg), _Last(_Last_arg) {}

    _NODISCARD constexpr const _Elem* begin() const noexcept {
        return _First;
    }

    _NODISCARD constexpr const _Elem* end() const noexcept {
        return _Last;
    }

    _NODISCARD constexpr size_t size() const noexcept {
        return static_cast<size_t>(_Last - _First);
    }

private:
    const _Elem* _First;
    const _Elem* _Last;
};
```
- 注意：当类中没有定义initializer_list 为参数的构造函数时，会默认使用相应的构造函数，因此花括号{}可以在没有实现initializer_list时正确解析。
