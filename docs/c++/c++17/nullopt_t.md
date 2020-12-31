---
title: nullopt_t
date: 2020-11-17
sidebarDepth: 2
tags:
 - nullopt_t
categories:
 - C++17
---
# nullopt_t
- 功能：std::nullopt_t 是空类类型，用于表示不含数据的空类
- 使用场景：配合`std::optional`,用于指示 `std::optional` 类型拥有未初始化状态
- 源码分析:`nullopt_t`自定义的构造函数，也隐含的使编译器提供的默认构造函数失效，初始化生成`nullopt_t`实例对象只能通过显式调用`nullopt_t(_Tag)`构造，而不能使用如默认构造`nullopt_t npt;`。
```cpp
struct nullopt_t { // no-value state indicator
    struct _Tag {};
    constexpr explicit nullopt_t(_Tag) {}
};
inline constexpr nullopt_t nullopt{nullopt_t::_Tag{}};
```
- 示例:
```cpp
int main(){
    //调用显式构造
    nullopt_t npt1{ nullopt_t::_Tag{} };//正确
    //不能使用默认构造
    nullopt_t npt2;//error 不存在默认构造函数
}
```