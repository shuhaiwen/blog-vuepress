---
title: std::ignore
date: 2020-08-05
sidebarDepth: 2
tags:
 - ignore
categories:
 - C++11
---
# std::ignore
- 头文件： `tuple`
- 功能：和值均可赋给而无效果的未指定类型的对象。目的是令 std::tie 在解包 std::tuple 时作为不使用的参数的占位符使用。
- 示例
```cpp
#include <iostream>
#include <string>
#include <set>
#include <tuple>
 
int main()
{
    std::set<std::string> set_of_str;
    bool inserted = false;
    std::tie(std::ignore, inserted) = set_of_str.insert("Test");
    if (inserted) {
        std::cout << "Value was inserted successfully\n";
    }
}
```
- 源码分析：std::ignore是一个_Ignore类对象，_Ignore以模板形式重载了赋值运算符，仅仅用来接收任意类型数据，但不使用其数据。
```cpp
// STRUCT _Ignore
struct _Ignore { // struct that ignores assignments
    template <class _Ty>
    constexpr const _Ignore& operator=(const _Ty&) const noexcept /* strengthened */ {
        // do nothing
        return *this;
    }
};

_INLINE_VAR constexpr _Ignore ignore{};
```

