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
  - [类型属性](#类型属性)
    - [类型类别判断](#类型类别判断)
    - [类型属性判断](#类型属性判断)
    - [类型关系判断](#类型关系判断)
  - [类型修改](#类型修改)
    - [remove_cv](#remove_cv)
    - [remove_reference](#remove_reference)
  - [其它类](#其它类)
    - [conditional](#conditional)
    - [decay](#decay)
  - [辅助类](#辅助类)
    - [integral_constant](#integral_constant)
    - [bool_constant true_type false_type](#bool_constant-true_type-false_type)
  - [逻辑运算类](#逻辑运算类)
    - [conjunction](#conjunction)
# type_traits
**c++ 类型特性（type_traits）定义一个编译时基于模板的结构，以查询或修改类型的属性**
## 类型属性
### 类型类别判断
### 类型属性判断
### 类型关系判断
## 类型修改
### remove_cv
- 功能：移除最顶层 const 、最顶层 volatile 或两者，若存在
  - 解释：如`const volatile int*p`,其中`const volatile`修饰的是p指向的数据，并不是限定`int*`的，因此`remove_cv`会匹配无cv限定的模板实现，即内部type类型指向`const volatile int*`。又如`int* const volatile p`，cv限定符修饰的是`int*`,因此`remove_cv`内部type指向`int*`。
- 源码分析:实现4个模板函数，分别匹配const volatile限定符，而内部type始终指向无cv限定符类型，从而达到去除cv限定符功能
```c++
// STRUCT TEMPLATE remove_cv
template <class _Ty>
struct remove_cv { // remove top-level const and volatile qualifiers
    using type = _Ty;

    template <template <class> class _Fn>
    using _Apply = _Fn<_Ty>; // apply cv-qualifiers from the class template argument to _Fn<_Ty>
};

template <class _Ty>
struct remove_cv<const _Ty> {
    using type = _Ty;

    template <template <class> class _Fn>
    using _Apply = const _Fn<_Ty>;
};

template <class _Ty>
struct remove_cv<volatile _Ty> {
    using type = _Ty;

    template <template <class> class _Fn>
    using _Apply = volatile _Fn<_Ty>;
};

template <class _Ty>
struct remove_cv<const volatile _Ty> {
    using type = _Ty;

    template <template <class> class _Fn>
    using _Apply = const volatile _Fn<_Ty>;
};

template <class _Ty>
using remove_cv_t = typename remove_cv<_Ty>::type;

```
- 示例
```c++
#include <iostream>
#include <type_traits>
 
int main() {
    typedef std::remove_cv<const int>::type type1;
    typedef std::remove_cv<volatile int>::type type2;
    typedef std::remove_cv<const volatile int>::type type3;
    typedef std::remove_cv<const volatile int*>::type type4;
    typedef std::remove_cv<int * const volatile>::type type5;
 
    std::cout << "test1 " << (std::is_same<int, type1>::value
        ? "passed" : "failed") << '\n';
    std::cout << "test2 " << (std::is_same<int, type2>::value
        ? "passed" : "failed") << '\n';
    std::cout << "test3 " << (std::is_same<int, type3>::value
        ? "passed" : "failed") << '\n';
    std::cout << "test4 " << (std::is_same<const volatile int*, type4>::value
        ? "passed" : "failed") << '\n';
    std::cout << "test5 " << (std::is_same<int*, type5>::value
        ? "passed" : "failed") << '\n';
}
```
### remove_reference
- 功能：移除类型的引用`&`或`&&`
- 源码分析:`remove_reference_t`是`remove_reference::type`的别名，`remove_reference`有3个定义，分别接收`T`、`T&`和`T&&`，即左值，左值引用和右值引用，而`type`始终指向`T`,即左值，因此达到去除引用的目的。
```c++
// STRUCT TEMPLATE remove_reference
template <class _Ty>
struct remove_reference {
    using type                 = _Ty;
    using _Const_thru_ref_type = const _Ty;
};

template <class _Ty>
struct remove_reference<_Ty&> {
    using type                 = _Ty;
    using _Const_thru_ref_type = const _Ty&;
};

template <class _Ty>
struct remove_reference<_Ty&&> {
    using type                 = _Ty;
    using _Const_thru_ref_type = const _Ty&&;
};

template <class _Ty>
using remove_reference_t = typename remove_reference<_Ty>::type;
```
- 示例
```c++
#include <iostream> // std::cout
#include <type_traits> // std::is_same
 
template<class T1, class T2>
void print_is_same() {
  std::cout << std::is_same<T1, T2>() << '\n';
}
 
int main() {
  std::cout << std::boolalpha;
 
  print_is_same<int, int>();
  print_is_same<int, int &>();
  print_is_same<int, int &&>();
 
  print_is_same<int, std::remove_reference<int>::type>();
  print_is_same<int, std::remove_reference<int &>::type>();
  print_is_same<int, std::remove_reference<int &&>::type>();
}
//输出结果
//true
//false
//false
//true
//true
//true
```

## 其它类
### conditional
- 功能：根据条件真假选择，功能如三目运算符`?:`
- 源码分析：
  - 实现2个模板类，含3个参数，当参数1是`false`时匹配特化`false`版类，当参数1为`true`时匹配普通模板类
  - 2个模板类内部`type`分别指向参数2和参数3类型，从而达到根据参数1真假选择参数2或参数3功能
```c++
template <bool _Test, class _Ty1, class _Ty2>
struct conditional { // Choose _Ty1 if _Test is true, and _Ty2 otherwise
    using type = _Ty1;
};

template <class _Ty1, class _Ty2>
struct conditional<false, _Ty1, _Ty2> {
    using type = _Ty2;
};

template <bool _Test, class _Ty1, class _Ty2>
using conditional_t = typename conditional<_Test, _Ty1, _Ty2>::type;

```
- 示例
```c++
#include <iostream>
#include <type_traits>
#include <typeinfo>
 
int main() 
{
    typedef std::conditional<true, int, double>::type Type1;
    typedef std::conditional<false, int, double>::type Type2;
    typedef std::conditional<sizeof(int) >= sizeof(double), int, double>::type Type3;
 
    std::cout << typeid(Type1).name() << '\n';
    std::cout << typeid(Type2).name() << '\n';
    std::cout << typeid(Type3).name() << '\n';
}
//输出结果
//int
//double
//double
```
### decay
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
## 辅助类
### integral_constant
- 功能：包装特定类型的静态常量
- 源码分析：
  - 类模板包含2个参数，分别是类型参数和非类型参数
  - 实现转换函数使`integral_constant`可以转换成`T`类型
  - 实现`()`函数对象使`integral_constant`对象可以函数调用形式返回数据
```c++
template <class _Ty, _Ty _Val>
struct integral_constant {
    static constexpr _Ty value = _Val;

    using value_type = _Ty;
    using type       = integral_constant;

    constexpr operator value_type() const noexcept {
        return value;
    }

    _NODISCARD constexpr value_type operator()() const noexcept {
        return value;
    }
};
```
- 示例
```c++
#include <iostream>
#include <type_traits>
int main()
{

	auto i1=std::integral_constant<int, 2>()(); //i1经 operator()() 返回2，i1类型是int
	auto i2 = std::integral_constant<int, 2>();//i2是std::integral_constant<int, 2>类型
	int i3 = std::integral_constant<int, 2>();//i3经 operator value_type() 返回2，i3是int类型
}
```
### bool_constant true_type false_type
- 功能:
  - `bool_constant`是对`integral_constant`特化`bool`的别名
  - `true_type`是对`bool_constant`特化`true`的别名
  - `false_type`是对`bool_constant`特化`false`的别名
- 源码分析
```c++
template <bool _Val>
using bool_constant = integral_constant<bool, _Val>;

using true_type  = bool_constant<true>;
using false_type = bool_constant<false>;
```
- 示例
```c++
#include <iostream>
#include <type_traits>
int main()
{
	std::cout << std::boolalpha;
	std::cout << std::is_same_v<std::bool_constant<false>, std::false_type> << std::endl;
	std::true_type tt;
	if (tt)
		std::cout <<"value of true_type "<< tt << std::endl;
}
//输出结果
//true
//value of true_type true
```
## 逻辑运算类
### conjunction
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
//type递归终止条件是调用了类1
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
//类5 value有2个来源，一个是通过类3继承自true_type，另是一个通过类4间接指向类1中type所指向类型中所含的静态成员常量value
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

