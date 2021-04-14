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
  - 绑定普通函数
  - 绑定类成员函数
  - 绑定类成员变量
## 绑定普通函数
- 示例
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
## 绑定类成员函数和类成员变量
- 语法形式：
  - 成员函数：`bind(&A::fun, &obj, parm1, parm2)`
  - 成员变量：`bind(&A::i, &obj)`
- 注意事项
  - 绑定成员需要提供具体的对象
- 示例
```cpp
#include<functional>
#include<iostream>
class A
{
public:
	void fun(int i,int& ir)
	{
		std::cout << "i=" << i << " ir=" << ir << std::endl;
	}
	int i;
};
int main() {
	A a;
	int i = 3;
	auto f1=std::bind(&A::fun, &a, 2, std::ref(i));
  //使用占位符
	auto f2 = std::bind(&A::fun, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3);
	f1();
	f2(a, 3, std::ref(i));
	auto f3=std::bind(&A::i, &a);
	auto f4 = std::bind(&A::i, std::placeholders::_1);
	a.i = 3;
	auto val1=f3();
	auto val21=f4(a);
}
```
## 源码分析
- bind函数模板原型有2个，一个匹配隐式返回类型，一个匹配显式返回类型
- 使用`forward`转发参数（绑定的函数，以及绑定的函数的参数）
- 调用`bind`函数返回值`_Binder`类型
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
- `Binder`类重载了`operator ()`实现函数对象，因此可以bind返回的对象可以以函数形式调用
```cpp
template <class _Ret, class _Fx, class... _Types>
class _Binder : public _Binder_result_type<_Ret, _Fx>::type { // wrap bound callable object and arguments
private:
    using _Seq    = index_sequence_for<_Types...>;
    using _First  = decay_t<_Fx>;
    using _Second = tuple<decay_t<_Types>...>;

    _Compressed_pair<_First, _Second> _Mypair;

public:
    constexpr explicit _Binder(_Fx&& _Func, _Types&&... _Args)
        : _Mypair(_One_then_variadic_args_t{}, _STD forward<_Fx>(_Func), _STD forward<_Types>(_Args)...) {}

#define _CALL_BINDER                                                                  \
    _Call_binder(_Invoker_ret<_Ret>{}, _Seq{}, _Mypair._Get_first(), _Mypair._Myval2, \
        _STD forward_as_tuple(_STD forward<_Unbound>(_Unbargs)...))

    template <class... _Unbound>
    _CONSTEXPR20 auto operator()(_Unbound&&... _Unbargs) noexcept(noexcept(_CALL_BINDER)) -> decltype(_CALL_BINDER) {
        return _CALL_BINDER;
    }

    template <class... _Unbound>
    _CONSTEXPR20 auto operator()(_Unbound&&... _Unbargs) const noexcept(noexcept(_CALL_BINDER))
        -> decltype(_CALL_BINDER) {
        return _CALL_BINDER;
    }

#undef _CALL_BINDER
};
```
