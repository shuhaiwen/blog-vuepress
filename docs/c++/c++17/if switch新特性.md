---
title: if switch新特性
date: 2020-10-21
sidebarDepth: 2
tags:
 - if
 - switch
categories:
 - C++17
---
- [if switch新特性](#if-switch新特性)
  - [if switch 初始化语句](#if-switch-初始化语句)
  - [constexpr if](#constexpr-if)
# if switch新特性
## if switch 初始化语句
- 功能：在`if`或`switch`条件块中增加变量声明或表达式语句
- 使用场景：当if或switch语句的条件需要计算时，此计算表达式可放入if或switch条件区，而不必在外面声明
- 注意事项：表达式或声明必须由**分号**`;`结束且只能有一个**分号**`;`
- 示例
```cpp
int fun(int x) {
    return x;
}
int main() {
    pair<int, int> pr{ 1,2 };
    if (bool f1 = false, f2 = true;  f1) {

    }
    if (auto [x, y] = pr; x == 1) {

    }
    switch (int i = fun(2);i)
    {
    case 2:
        break;
    default:
        break;
    }
}
```
## constexpr if
- 功能：定义条件为常量表达式，编译器会在编译期做优化，当条件为`false`时会舍弃`true`语句块，当条件为`true`时会舍弃`false`语句块。
- 示例
```cpp
template <typename T>
auto get_value(T t) {
    if constexpr (std::is_pointer_v<T>)
        return *t; // 对 T = int* 推导返回类型为 int
    else
        return t;  // 对 T = int 推导返回类型为 int
}
int main() {
    string s = "123";
    get_value(s);
    get_value(&s);
}
```