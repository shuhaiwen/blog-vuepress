---
title: std::bind
date: 2020-11-30
sidebarDepth: 2
tags:
 - bind
categories:
 - C++11
---
# bind
- 包含文件:`#include <functional>`
- 功能：函数模板 bind 生成 f 的转发调用包装器
## 源码分析
- bind函数模板原型由2个，一个匹配隐式返回类型，一个匹配显式返回类型
```cpp
// FUNCTION TEMPLATE bind (implicit return type)
template <class _Fx, class... _Types>
_NODISCARD _CONSTEXPR20 _Binder<_Unforced, _Fx, _Types...> bind(_Fx&& _Func, _Types&&... _Args) {
    return _Binder<_Unforced, _Fx, _Types...>(_STD forward<_Fx>(_Func), _STD forward<_Types>(_Args)...);
}

// FUNCTION TEMPLATE bind (explicit return type)
template <class _Ret, class _Fx, class... _Types>
_NODISCARD _CONSTEXPR20 _Binder<_Ret, _Fx, _Types...> bind(_Fx&& _Func, _Types&&... _Args) {
    return _Binder<_Ret, _Fx, _Types...>(_STD forward<_Fx>(_Func), _STD forward<_Types>(_Args)...);
}
```
```
#include <functional>
int sum(int a,int b){
  return a+b;
}
int main(){
  std::bind<int>(sum,1,2);//显式返回类型
  std::bind(sum,1,2);//隐式返回类型

}
```
- 调用`bind`函数返回值`_Binder`类型