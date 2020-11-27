---
title: type_traits
date: 2020-11-27
sidebarDepth: 2
tags:
 - type_traits
categories:
 - C++11
---
- [type_traits](#type_traits)
  - [conjunction](#conjunction)
  - [decay](#decay)
# type_traits
**c++ 类型特性（type_traits）定义一个编译时基于模板的结构，以查询或修改类型的属性**
## conjunction
- 功能：在特性序列上进行逻辑与
- 源码分析
```c++
// 类1 本可以匹配任意参数且第一个参数false和true均可，但由于类2具体化第一个参数为true，导致只能在只剩一个参数 _First时才可以去匹配ture
template <bool _First_value, class _First, class... _Rest>
struct _Conjunction { // handle false trait or last trait
    using type = _First;
};
//类2 部分具体化true使其能匹配第一个参数true的情况，变长参数前有2个参数_True _Next，使其最少匹配2个以上参数，不能匹配1个参数此处参数不包括false和ture；递归嵌套_Conjunction使type最终指向类1中的 type=_First,因此type中有一个value变量，类型为bool，值最终为false或true
template <class _True, class _Next, class... _Rest>
struct _Conjunction<true, _True, _Next, _Rest...> { // the first trait is true, try the next one
    using type = typename _Conjunction<_Next::value, _Next, _Rest...>::type;
};
//类3 可以匹配任意参数长度的类实例化，但由于类4的存在，其在匹配1个参数以上的优先级低于类4，因此类3只能匹配0参的实例化
template <class... _Traits>
struct conjunction : true_type {}; // If _Traits is empty, true_type
//类4 可以匹配大于1个参数的实例化，且优先级大于类3；继承自_Conjunction中的type，这个type中会有一个value变量，类型bool
template <class _First, class... _Rest>
struct conjunction<_First, _Rest...> : _Conjunction<_First::value, _First, _Rest...>::type {
    // the first false trait in _Traits, or the last trait if none are false
};
//类5 
template <class... _Traits>
_INLINE_VAR constexpr bool conjunction_v = conjunction<_Traits...>::value;
```
- 示例
```c++
#include <iostream>
#include <type_traits>
 
// 若所有 Ts... 都拥有等同于 T 的类型，则启用 func
template<typename T, typename... Ts>
std::enable_if_t<std::conjunction_v<std::is_same<T, Ts>...>>
func(T, Ts...) {
    std::cout << "all types in pack are T\n";
}
 
// 否则
template<typename T, typename... Ts>
std::enable_if_t<!std::conjunction_v<std::is_same<T, Ts>...>>
func(T, Ts...) {
    std::cout << "not all types in pack are T\n";
}
 
int main() {
    func(1, 2, 3);
    func(1, 2, "hello!");
}
//输出：
//all types in pack are T
//not all types in pack are T
```
## decay
- 功能：对类型 T 应用左值到右值、数组到指针及函数到指针隐式转换，移除 cv 限定符
- 源码分析:

**`decay`中通过`is_array_v` 和`is_function_v`来检查是否是数组或函数类型，再通过`_Select`来根据`is_array_v` 和`is_function_v`的检查结果来选择`_Apply`参数中的前者还是后者。对应数组就移除[],再去除引用，对于函数就添加指针,对应对象就移除cv限定符和引用**
```c++
// STRUCT TEMPLATE decay
template <class _Ty>
struct decay { // determines decayed version of _Ty
    //移除引用
    using _Ty1 = remove_reference_t<_Ty>;
    //_Select判断is_function_v<_Ty1>的检查结果，true则_Apply<add_pointer<_Ty1>, remove_cv<_Ty1>>就会被替换成add_pointer<_Ty1>，false就会替换成remove_cv<_Ty1>
    using _Ty2 = typename _Select<is_function_v<_Ty1>>::template _Apply<add_pointer<_Ty1>, remove_cv<_Ty1>>;
    //与上面相同原理，但type一般是整个decay类的入口，即从type开始层层展开
    using type = typename _Select<is_array_v<_Ty1>>::template _Apply<add_pointer<remove_extent_t<_Ty1>>, _Ty2>::type;
};

template <class _Ty>
using decay_t = typename decay<_Ty>::type;
```
**`_Select`类主要用来匹配`_Select<true>`还是`_Select<false>`从而使`_Apply`等价于模板参数的第一个`_Ty1`还是第二个`_Ty2`**
```c++
// STRUCT TEMPLATE make_signed
template <bool>
struct _Select { // Select between aliases that extract either their first or second parameter
    template <class _Ty1, class>
    using _Apply = _Ty1;
};

template <>
struct _Select<false> {
    template <class, class _Ty2>
    using _Apply = _Ty2;
};
```
- 示例
```c++
#include <iostream>
#include <type_traits>
 
template <typename T, typename U>
struct decay_equiv : 
    std::is_same<typename std::decay<T>::type, U>::type 
{};
 
int main()
{
    std::cout << std::boolalpha
              << decay_equiv<int, int>::value << '\n'
              << decay_equiv<int&, int>::value << '\n'
              << decay_equiv<int&&, int>::value << '\n'
              << decay_equiv<const int&, int>::value << '\n'
              << decay_equiv<int[2], int*>::value << '\n'
              << decay_equiv<int(int), int(*)(int)>::value << '\n';
}
//输出：
//true
//true
//true
//true
//true
//true
```