---
title: optional
date: 2020-12-03
sidebarDepth: 2
tags:
 - optional
categories:
 - C++17
---
# optional
- 功能：类模板 std::optional 管理一个可选的容纳值，既可以存在也可以不存在的值。
- 使用场景：比如一个函数执行，异常和正常的返回值需要区分时，或异常没有返回值，正常才有返回值的情况下，相当于optional带有标志，且保存着可能存在的值.可以很好的取代类似`std::pair<T,bool>`的结构
- 示例
```cpp
#include <string>
#include <functional>
#include <iostream>
#include <optional>

// optional 可用作可能失败的工厂的返回类型
std::optional<std::string> create(bool b) {
    if (b)
        return "Godzilla";
    else
        return {};
}

// 能用 std::nullopt 创建任何（空的） std::optional
auto create2(bool b) {
    return b ? std::optional<std::string>{"Godzilla"} : std::nullopt;
}

// std::reference_wrapper 可用于返回引用
auto create_ref(bool b) {
    static std::string value = "Godzilla";
    return b ? std::optional<std::reference_wrapper<std::string>>{value}
    : std::nullopt;
}
struct S
{
    virtual int f(char) const, g(int)&&; // 声明两个非静态成员函数
    virtual int f(char); // 编译时错误：virtual（在 声明说明符序列 中）
                            // 仅在非静态成员函数的声明中允许
};

int main()
{

    std::cout << "create(false) returned "
        << create(false).value_or("empty") << '\n';

    // 返回 optional 的工厂函数可用作 while 和 if 的条件
    if (auto str = create2(true)) {
        std::cout << "create2(true) returned " << *str << '\n';
    }

    if (auto str = create_ref(true)) {
        // 用 get() 访问 reference_wrapper 的值
        std::cout << "create_ref(true) returned " << str->get() << '\n';
        str->get() = "Mothra";
        std::cout << "modifying it changed it to " << str->get() << '\n';
    }
}
```