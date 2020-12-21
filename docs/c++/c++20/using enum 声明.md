---
title: using enum 声明
date: 2020-12-21
sidebarDepth: 2
tags:
 - using enum 声明
 - using
 - enum
categories:
 - C++20
---
- [using enum 声明](#using-enum-声明)
  - [using enum 枚举名](#using-enum-枚举名)
  - [using 枚举名::枚举子项名](#using-枚举名枚举子项名)
# using enum 声明
- `using enum 声明`有2种语法形式
  - `using enum 枚举名`
  - `using 枚举名::枚举子项名`
## using enum 枚举名
- 功能：类似于`using namespace`声明，`using enum` 声明将枚举值暴露在当前作用域中
- 注意事项：同一作用域不能有相同命令（会命名冲突）
- 示例
```c++
enum class fruit { orange, apple };
struct S1 {

  using enum fruit; // OK ：引入 orange 与 apple 到 S 中
  //char orange; error,不能同名
};
void f()
{
    using fruit::orange;
    auto en=orange;
    S s;
    s.orange;  // OK ：指名 fruit::orange
    S::orange; // OK ：指名 fruit::orange
}
```
## using 枚举名::枚举子项名
- 功能：将枚举中某一具体子项名暴露在当前作用域中
- 注意事项：同一作用域不能有相同命令（会命名冲突）
- 示例
```c++
enum class fruit { orange, apple };

struct S2 {

  using fruit::orange;
  using fruit::apple;
};
void f()
{
    using fruit::orange;
    auto en=orange;
    S2 s2;
    s2.orange;  // OK ：指名 fruit::orange
    S2::orange; // OK ：指名 fruit::orange
}
```