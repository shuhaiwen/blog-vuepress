---
title: type_traits
date: 2020-11-27
sidebarDepth: 2
tags:
 - type_traits
categories:
 - C++11
---
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