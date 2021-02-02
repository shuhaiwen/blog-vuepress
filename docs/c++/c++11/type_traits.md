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
      - [extent](#extent)
      - [rank](#rank)
    - [类型关系判断](#类型关系判断)
      - [is_convertible](#is_convertible)
  - [类型修改](#类型修改)
    - [add_pointer](#add_pointer)
    - [remove_pointer](#remove_pointer)
    - [make_signed](#make_signed)
    - [make_unsigned](#make_unsigned)
    - [remove_cv](#remove_cv)
    - [remove_reference](#remove_reference)
    - [add_lvalue_reference和add_rvalue_reference](#add_lvalue_reference和add_rvalue_reference)
    - [remove_exten`和`remove_all_extents](#remove_exten和remove_all_extents)
  - [其它类](#其它类)
    - [enable_if](#enable_if)
    - [conditional](#conditional)
    - [decay](#decay)
    - [type_identity](#type_identity)
    - [invoke_result](#invoke_result)
    - [common_type](#common_type)
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
#### extent
- 功能：获取数组类型在指定维度的大小
- 源码分析:
  - `extent`继承自`integral_constant`
  - `extent_v`利用继承递归展开，最终当展开到维度为0时结束
```cpp
template <class _Ty, unsigned int _Ix = 0>
_INLINE_VAR constexpr size_t extent_v = 0; // determine extent of dimension _Ix of array _Ty

template <class _Ty, size_t _Nx>
_INLINE_VAR constexpr size_t extent_v<_Ty[_Nx], 0> = _Nx;

template <class _Ty, unsigned int _Ix, size_t _Nx>
_INLINE_VAR constexpr size_t extent_v<_Ty[_Nx], _Ix> = extent_v<_Ty, _Ix - 1>;

template <class _Ty, unsigned int _Ix>
_INLINE_VAR constexpr size_t extent_v<_Ty[], _Ix> = extent_v<_Ty, _Ix - 1>;

template <class _Ty, unsigned int _Ix = 0>
struct extent : integral_constant<size_t, extent_v<_Ty, _Ix>> {};
```
- 示例
```cpp
#include <iostream>
#include <type_traits>

int main()
{
	std::cout << std::extent<int[3]>::value << '\n'; // < 默认维度为 0
	std::cout << std::extent<int[3][4], 0>::value << '\n';
	std::cout << std::extent<int[3][4], 1>::value << '\n';
	std::cout << std::extent<int[3][4], 2>::value << '\n';
	std::cout << std::extent<int[]>::value << '\n';

	const auto ext = std::extent<int[9]>{};
	std::cout << ext << '\n'; // < 隐式转换到 std::size_t

	const int ints[] = { 1,2,3,4 };
	std::cout << std::extent<decltype(ints)>::value << '\n'; // < 数组大小 
}
```
#### rank
- 功能：计算指定数组的维度，当非数组时结果为0
- 源码分析:
  - `rank`继承自`integral_constant`
  - `rank_v`递归展开数组维度，并+1
```cpp
template <class _Ty>
_INLINE_VAR constexpr size_t rank_v = 0; // determine number of dimensions of array _Ty

template <class _Ty, size_t _Nx>
_INLINE_VAR constexpr size_t rank_v<_Ty[_Nx]> = rank_v<_Ty> + 1;

template <class _Ty>
_INLINE_VAR constexpr size_t rank_v<_Ty[]> = rank_v<_Ty> + 1;

template <class _Ty>
struct rank : integral_constant<size_t, rank_v<_Ty>> {};

```
- 示例
```cpp
#include <iostream>
#include <type_traits>

int main()
{
	std::cout << std::rank<int[1][2][3]>::value << '\n';
	std::cout << std::rank<int[][2][3][4]>::value << '\n';
	std::cout << std::rank<int>::value << '\n';
}
```
### 类型关系判断
#### is_convertible
- 功能：判断是否可以由A转换到B
- 规则：
  - 子类指针或引用可转基类指针或引用
  - A实现了转换B函数，则A可以转B，(但A的指针或引用不能转B的引用或指针)
  - B实现了完美构造函数`template<class T> B(T&&){...}`，任何类型（包括指针和引用）都可以转换成B
- 示例
```cpp
#include <iostream>
#include <type_traits>

class E { public: template<class T> E(T&&) { } };
class A {};
class B : public A {};
class C {};
class D 
{ 
public: operator C() { return c; }  C c; 
};
int main()
{
	bool b2ap = std::is_convertible<B*, A*>::value;//true 子类转基类 指针
	bool b2ar = std::is_convertible<B&, A&>::value;//true 子类转基类 引用
	bool a2b = std::is_convertible<A*, B*>::value;//false 基类不能向下转子类
	bool b2c = std::is_convertible<B*, C*>::value;//false B C没有继承关系
	bool d2c = std::is_convertible<D, C>::value;//true D实现了转换C函数
	bool d2cp = std::is_convertible<D&, C&>::value;//false 转换函数不能用在指针和引用上	
	bool everything2e = std::is_convertible<A, E>::value; //true 完美转发构造函数使类能从任何类型转换
}
```
## 类型修改
### add_pointer
- 功能：对给定类型添加一层指针
- 示例
```cpp
#include <iostream>
#include <type_traits>
int main()
{
	int i = 123;
	int* p = &i;
	int& ri = i;
	typedef std::add_pointer<decltype(p)>::type IntPtr3;
	typedef std::add_pointer<decltype(i)>::type IntPtr;
	typedef std::add_pointer<decltype(ri)>::type IntPtr2;

	static_assert(std::is_pointer<IntPtr>::value, "IntPtr should be a pointer");
	static_assert(std::is_same<IntPtr, int*>::value, "IntPtr should be a pointer to int");
	static_assert(std::is_same<IntPtr2, IntPtr>::value, "IntPtr2 should be equal to IntPtr");
    static_assert(std::is_same<IntPtr3, int**>::value, "IntPtr3 should be equal to int**");
}
```
源码分析:先去除引用再增加一层指针，添加指针的方式很直接，在类型后增加一个符号`*`
- `_Add_pointer`含2个版本，版本1作为主模板类，当版本2不满足时被使用，版本2通过判断针对移除引用再添加指针后是否被`void_t`匹配（即是否是类型）
```cpp
template <class _Ty, class = void>
struct _Add_pointer { // add pointer (pointer type cannot be formed)
    using type = _Ty;
};

template <class _Ty>
struct _Add_pointer<_Ty, void_t<remove_reference_t<_Ty>*>> { // (pointer type can be formed)
    using type = remove_reference_t<_Ty>*;
};

template <class _Ty>
struct add_pointer {
    using type = typename _Add_pointer<_Ty>::type;
};

template <class _Ty>
using add_pointer_t = typename _Add_pointer<_Ty>::type;
```
### remove_pointer
- 功能：移除给定类型的一层指针
- 示例
```cpp
#include <iostream>
#include <type_traits>
 
template<class T1, class T2>
void print_is_same() 
{
    std::cout << std::is_same<T1, T2>() << '\n';
}
 
void print_separator() 
{
    std::cout << "-----\n";
}
 
int main() 
{
    std::cout << std::boolalpha;
 
    print_is_same<int, int>();   // true
    print_is_same<int, int*>();  // false
    print_is_same<int, int**>(); // false
 
    print_separator();
 
    print_is_same<int, std::remove_pointer<int>::type>();   // true
    print_is_same<int, std::remove_pointer<int*>::type>();  // true
    print_is_same<int, std::remove_pointer<int**>::type>(); // false
 
    print_separator();
 
    print_is_same<int, std::remove_pointer<int* const>::type>();          // true
    print_is_same<int, std::remove_pointer<int* volatile>::type>();       // true
    print_is_same<int, std::remove_pointer<int* const volatile>::type>(); // true
}
```
源码分析：类似[remove_reference](#remove_reference),对`_Ty*`及cv限定符的具体化
```cpp
template <class _Ty>
struct remove_pointer {
    using type = _Ty;
};

template <class _Ty>
struct remove_pointer<_Ty*> {
    using type = _Ty;
};

template <class _Ty>
struct remove_pointer<_Ty* const> {
    using type = _Ty;
};

template <class _Ty>
struct remove_pointer<_Ty* volatile> {
    using type = _Ty;
};

template <class _Ty>
struct remove_pointer<_Ty* const volatile> {
    using type = _Ty;
};

template <class _Ty>
using remove_pointer_t = typename remove_pointer<_Ty>::type;
```
### make_signed
- 功能：将有符号或无符号的 char 、 short 、 int 、 long 、 long long 统一转换成有符号类型
- 示例
```cpp
#include <iostream>
#include <type_traits>

int main() {
	typedef std::make_signed<char>::type char_type;
	typedef std::make_signed<int>::type int_type;
	typedef std::make_signed<volatile long>::type long_type;

	bool ok1 = std::is_same<char_type, signed char>::value;
	bool ok2 = std::is_same<int_type, signed int>::value;
	bool ok3 = std::is_same<long_type, volatile signed long>::value;

	std::cout << std::boolalpha
		<< "char_type is 'signed char'?          : " << ok1 << '\n'
		<< "int_type  is 'signed int'?           : " << ok2 << '\n'
		<< "long_type is 'volatile signed long'? : " << ok3 << '\n';
}
```
源码分析：枚举判断整形类型的有符号和无符号，统一返回有符号版
- 使用`remove_cv`去除cv限定符，并调用`_Apply`（作用使`_Make_signed1`以去除了cv限定符的`_Ty`作为模板参数），`_Make_signed1`是`_Make_signed2`的模板别名，`_Make_signed2`（有多个版本）以整形字节大小作为模板参数，并调用内部`_Apply`
```cpp
template <class _Ty>
using _Make_signed1 = // signed partner to cv-unqualified _Ty
    typename _Make_signed2<sizeof(_Ty)>::template _Apply<_Ty>;

template <class _Ty>
struct make_signed { // signed partner to _Ty
    static_assert(_Is_nonbool_integral<_Ty> || is_enum_v<_Ty>,
        "make_signed<T> requires that T shall be a (possibly cv-qualified) "
        "integral type or enumeration but not a bool type.");

    using type = typename remove_cv<_Ty>::template _Apply<_Make_signed1>;
};

template <class _Ty>
using make_signed_t = typename make_signed<_Ty>::type;
```
- `_Make_signed2`分别实现了1字节、2字节、4字节、8字节版本,内部的`_Apply`直接是对应整形的有符号版，在4字节版本实现中使用了`_Select`，这个作用类似于三元运算`bool:A?B`
```cpp
template <size_t>
struct _Make_signed2; // Choose make_signed strategy by type size

template <>
struct _Make_signed2<1> {
    template <class>
    using _Apply = signed char;
};

template <>
struct _Make_signed2<2> {
    template <class>
    using _Apply = short;
};

template <>
struct _Make_signed2<4> {
    template <class _Ty>
    using _Apply = // assumes LLP64
        typename _Select<is_same_v<_Ty, long> || is_same_v<_Ty, unsigned long>>::template _Apply<long, int>;
};

template <>
struct _Make_signed2<8> {
    template <class>
    using _Apply = long long;
};
```
- `_Select`2个版本，具体化`false`版,使`_Apply`等价于第二个参数，另一个版本匹配`true`，使`_Apply`等价于第一个参数
```cpp
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
### make_unsigned
原理使用方法同[make_signed](#make_signed)
### remove_cv
- 功能：移除最顶层 const 、最顶层 volatile 或两者，若存在
  - 解释：如`const volatile int*p`,其中`const volatile`修饰的是p指向的数据，并不是限定`int*`的，因此`remove_cv`会匹配无cv限定的模板实现，即内部type类型指向`const volatile int*`。又如`int* const volatile p`，cv限定符修饰的是`int*`,因此`remove_cv`内部type指向`int*`。
- 源码分析:实现4个模板函数，分别匹配const volatile限定符，而内部type始终指向无cv限定符类型，从而达到去除cv限定符功能
```cpp
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
```cpp
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
```cpp
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
```cpp
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
### add_lvalue_reference和add_rvalue_reference
- 功能：向给定类型添加左值引用或右值引用
- 规则：
  - `std::add_lvalue_reference<T>::type` 是 `T&`
  - `std::add_lvalue_reference<T&>::type` 是 `T&`
  - `std::add_lvalue_reference<T&&>::type` 是 `T&`
  - `std::add_rvalue_reference<T>::type` 是 `T&&`
  - `std::add_rvalue_reference<T&>::type` 是 `T&`
  - `std::add_rvalue_reference<T&&>::type` 是 `T&&`
- 示例
```cpp
#include <iostream>
#include <type_traits>

int main() {
	using nonref = int;
	using lref = typename std::add_lvalue_reference<nonref>::type;//int&
	using rref = typename std::add_rvalue_reference<nonref>::type;//int&&
	using llref = typename std::add_lvalue_reference<lref>::type;//int&
	using rlref = typename std::add_rvalue_reference<lref>::type;//int&
	using lrref = typename std::add_lvalue_reference<rref>::type;//int&
	using rrref = typename std::add_rvalue_reference<rref>::type;//int&&
	std::cout << std::boolalpha;
	std::cout << std::is_lvalue_reference<nonref>::value << '\n';
	std::cout << std::is_lvalue_reference<lref>::value << '\n';
	std::cout << std::is_rvalue_reference<rref>::value << '\n';
}
```
源码分析：利用万能引用和[引用坍缩](/c++/c++11/reference.md)特性（右值引用的右值引用依然是右值引用，左值或左值引用的右值引用是左值引用）。
- `add_lvalue_reference`和`add_rvalue_reference`中`type`分别来自`_Add_reference`中定义的`_Lvalue`和`_Rvalue`
```cpp
// STRUCT TEMPLATE add_lvalue_reference
template <class _Ty>
struct add_lvalue_reference {
    using type = typename _Add_reference<_Ty>::_Lvalue;
};

template <class _Ty>
using add_lvalue_reference_t = typename _Add_reference<_Ty>::_Lvalue;

// STRUCT TEMPLATE add_rvalue_reference
template <class _Ty>
struct add_rvalue_reference {
    using type = typename _Add_reference<_Ty>::_Rvalue;
};

template <class _Ty>
using add_rvalue_reference_t = typename _Add_reference<_Ty>::_Rvalue;
```
- `_Add_reference`的实现由2个版本，一个主模板，一个部分具体化。具体化版本中`void_t<_Ty&>`用来判断`_Ty&`是否是一个类型，在上面的示例程序中，`int`、`int&`和`int&&`都会匹配这个版本。`using _Lvalue = _Ty&;`和`using _Rvalue = _Ty&&;`这以语法完全遵循应勇坍缩规则
```cpp
//主模板
template <class _Ty, class = void>
struct _Add_reference { // add reference (non-referenceable type)
    using _Lvalue = _Ty;
    using _Rvalue = _Ty;
};
//部分具体化
template <class _Ty>
struct _Add_reference<_Ty, void_t<_Ty&>> { // (referenceable type)
    using _Lvalue = _Ty&;
    using _Rvalue = _Ty&&;
};
```
### remove_exten`和`remove_all_extents
- 功能：
  - `remove_exten`:从给定数组类型移除一个维度
  - `remove_all_extents`:从给定数组类型移除全部维度
- 源码分析:特化`_Ty[]`类型，优先匹配数组
```cpp
template <class _Ty>
struct remove_extent { // remove array extent
    using type = _Ty;
};

template <class _Ty, size_t _Ix>
struct remove_extent<_Ty[_Ix]> {
    using type = _Ty;
};

template <class _Ty>
struct remove_extent<_Ty[]> {
    using type = _Ty;
};
```
- 示例
```cpp
#include <iostream>
#include <type_traits>
using namespace std;
int main()
{
	//移除第一层维度
	static_assert(is_same_v<remove_extent_t<int[]>, int>, "类型不同");
	static_assert(is_same_v<remove_extent_t<int[2][3]>, int[3]>,"类型不同");
	//移除全部数组维度
	static_assert(is_same_v<remove_all_extents_t<int[][3][3]>, int>, "类型不同");
}
```
## 其它类
### enable_if
- 功能：基于类型特性条件性地从重载决议移除函数，并对不同类型特性提供分离的函数重载与特化的便利方法；std::enable_if 可用作额外的函数参数（不可应用于运算符重载）、返回类型（不可应用于构造函数与析构函数），或类模板或函数模板形参。
- 使用场景：
  - 利用`enable_if`的决断能力，实现多个同参函数，不受同名函数不能重载限制
```cpp
struct T {
    enum { int_t,float_t } m_type;
    template <typename Integer,
              std::enable_if_t<std::is_integral_v<Integer>, int> = 0>
    T(Integer) : m_type(int_t) {}
 
    template <typename Floating,
              std::enable_if_t<std::is_floating_point_v<Floating>, int> = 0>
    T(Floating) : m_type(float_t) {} // OK
};
```
- 源码分析：`enable_if`有2个参数，参数1是`bool`类型数据，当参数1是`false`时，`enable_if_t`将会编译报错。

```cpp
template <bool _Test, class _Ty = void>
struct enable_if {}; // no member "type" when !_Test

template <class _Ty>
struct enable_if<true, _Ty> { // type is _Ty for _Test
    using type = _Ty;
};

template <bool _Test, class _Ty = void>
using enable_if_t = typename enable_if<_Test, _Ty>::type;

```
### conditional
- 功能：根据条件真假选择，功能如三目运算符`?:`
- 源码分析：
  - 实现2个模板类，含3个参数，当参数1是`false`时匹配特化`false`版类，当参数1为`true`时匹配普通模板类
  - 2个模板类内部`type`分别指向参数2和参数3类型，从而达到根据参数1真假选择参数2或参数3功能
```cpp
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
```cpp
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
- 功能：
  - 对类型 T 应用左值到右值、数组到指针及函数到指针隐式转换
  - 移除 cv 限定符
- 源码分析:

**`decay`中通过`is_array_v` 和`is_function_v`来检查是否是数组或函数类型，再通过`_Select`来根据`is_array_v` 和`is_function_v`的检查结果来选择`_Apply`参数中的前者还是后者。对应数组就移除[],再去除引用，对于函数就添加指针,对应对象就移除cv限定符和引用**
```cpp
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
```cpp
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
```cpp
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
### type_identity
- 功能：复制类型`T`
- 使用场景：当一个模板函数如sum可以计算int和float值，但只有一个模板参数T，为避免如`sum(1,1.2)`编译报错，可使用type_identity
- 示例
```cpp
template<class T>
void f(T, T);
 
template<class T>
void g(T, std::type_identity_t<T>);
int main()
{
    f(4.2, 0); // 错误：对 'T' 推导出冲突的类型
    g(4.2, 0); // OK ：调用 g<double>
    g(0, 4.2); // OK ：调用 g<int>
}
```
- 源码分析:使用类型别名指向_Ty
```cpp
template <class _Ty>
struct type_identity {
	using type = _Ty;
};
template <class _Ty>
using type_identity_t = typename type_identity<_Ty>::type;
```
### invoke_result
- 功能：计算可调用类型的返回值类型
- 示例
```cpp
#include <type_traits>
//识别call返回值类型
template<typename _CallBack,typename... Args>
std::invoke_result_t<_CallBack,Args...> call(_CallBack fun,Args...args)
{
	return std::invoke(fun, args...);
}
int main()
{
	using namespace std;
    //含参函数，需要单独传递参数类型
	invoke_result_t<int(int, int),int,int> res_int = 2;
	static_assert(is_same_v<decltype(res_int), int>, "error");
	invoke_result_t<void*()> res_void;
	static_assert(is_same_v<decltype(res_void),void*>, "error");
    //可调用对象 function类型
	invoke_result_t<function<void* ()>> res_fun;
	static_assert(is_same_v<decltype(res_fun), void*>, "error");

	function<int(int,int)> fun = [](int i,int j)->int {return i+j; };
	auto val = call(fun,1,2);//val=3 int类型
}
```
源码分析：本质是利用`decltype`和`declval`编译期识别类型特点
- 利用`conditional_t`判断可调用类型是否含参，由此来展开无参和有参版本的处理
```cpp
template <class _Callable, class... _Args>
using _Select_invoke_traits = conditional_t<sizeof...(_Args) == 0, _Invoke_traits_zero<void, _Callable>,
    _Invoke_traits_nonzero<void, _Callable, _Args...>>;

template <class _Callable, class... _Args>
using invoke_result_t = typename _Select_invoke_traits<_Callable, _Args...>::type;

```
- 利用`decltype`和`declval`来计算可调用类型的返回值
```cpp
//无参版本
template <class _Void, class _Callable>
struct _Invoke_traits_zero {
    // selected when _Callable isn't callable with zero _Args
    using _Is_invocable         = false_type;
    using _Is_nothrow_invocable = false_type;
    template <class _Rx>
    using _Is_invocable_r = false_type;
    template <class _Rx>
    using _Is_nothrow_invocable_r = false_type;
};

template <class _Callable>
using _Decltype_invoke_zero = decltype(_STD declval<_Callable>()());

template <class _Callable>
struct _Invoke_traits_zero<void_t<_Decltype_invoke_zero<_Callable>>, _Callable> {
    // selected when _Callable is callable with zero _Args
    using type                  = _Decltype_invoke_zero<_Callable>;
    using _Is_invocable         = true_type;
    using _Is_nothrow_invocable = bool_constant<noexcept(_STD declval<_Callable>()())>;
    template <class _Rx>
    using _Is_invocable_r = bool_constant<disjunction_v<is_void<_Rx>, is_convertible<type, _Rx>>>;
    template <class _Rx>
    using _Is_nothrow_invocable_r = bool_constant<
        conjunction_v<_Is_nothrow_invocable, disjunction<is_void<_Rx>, _Is_nothrow_convertible<type, _Rx>>>>;
};
```
### common_type
- 功能：确定一组类型的公共类型
- 源码分析
  - `common_type`分别对0参、单参、双参、多参版特化
    - 0参版无type类型，编译报错
    - 单参版继承自双参版
    - 多参版最终转化成双参版
  - 最终`common_type`会展开到`_Conditional_type`,`_Conditional_type`是一个模板变量,等号右边是个`decltype`+三元表达式`decltype(false ? _STD declval<_Ty1>() : _STD declval<_Ty2>());`,这个三元表达式正是判断类型是否相同的关键，三目运算符要求表达式2和表达式3必须是同一类型或可隐式转化另一类型，故当类型不同会编译报错
```cpp
template <class _Ty1, class _Ty2, class = void>
struct _Const_lvalue_cond_oper {};

template <class _Ty1, class _Ty2>
struct _Const_lvalue_cond_oper<_Ty1, _Ty2, void_t<_Conditional_type<const _Ty1&, const _Ty2&>>> {
    using type = remove_cvref_t<_Conditional_type<const _Ty1&, const _Ty2&>>;
};

template <class _Ty1, class _Ty2, class = void>
struct _Decayed_cond_oper : _Const_lvalue_cond_oper<_Ty1, _Ty2> {};

template <class _Ty1, class _Ty2>
struct _Decayed_cond_oper<_Ty1, _Ty2, void_t<_Conditional_type<_Ty1, _Ty2>>> {
    using type = decay_t<_Conditional_type<_Ty1, _Ty2>>;
};

template <class... _Ty>
struct common_type;

template <class... _Ty>
using common_type_t = typename common_type<_Ty...>::type;

template <>
struct common_type<> {};

template <class _Ty1>
struct common_type<_Ty1> : common_type<_Ty1, _Ty1> {};

template <class _Ty1, class _Ty2, class _Decayed1 = decay_t<_Ty1>, class _Decayed2 = decay_t<_Ty2>>
struct _Common_type2 : common_type<_Decayed1, _Decayed2> {};

template <class _Ty1, class _Ty2>
struct _Common_type2<_Ty1, _Ty2, _Ty1, _Ty2> : _Decayed_cond_oper<_Ty1, _Ty2> {};

template <class _Ty1, class _Ty2>
struct common_type<_Ty1, _Ty2> : _Common_type2<_Ty1, _Ty2> {};

template <class _Void, class _Ty1, class _Ty2, class... _Rest>
struct _Common_type3 {};

template <class _Ty1, class _Ty2, class... _Rest>
struct _Common_type3<void_t<common_type_t<_Ty1, _Ty2>>, _Ty1, _Ty2, _Rest...>
    : common_type<common_type_t<_Ty1, _Ty2>, _Rest...> {};

template <class _Ty1, class _Ty2, class... _Rest>
struct common_type<_Ty1, _Ty2, _Rest...> : _Common_type3<void, _Ty1, _Ty2, _Rest...> {};
```
- 示例
```cpp
#include <iostream>
#include <type_traits>
 
template <class T>
struct Number { T n; };
 
template <class T, class U>
Number<typename std::common_type<T, U>::type> operator+(const Number<T>& lhs,
                                                        const Number<U>& rhs) 
{
    return {lhs.n + rhs.n};
}
 
int main()
{
    Number<int> i1 = {1}, i2 = {2};
    Number<double> d1 = {2.3}, d2 = {3.5};
    std::cout << "i1i2: " << (i1 + i2).n << "\ni1d2: " << (i1 + d2).n << '\n'
              << "d1i2: " << (d1 + i2).n << "\nd1d2: " << (d1 + d2).n << '\n';
}
```
## 辅助类
### integral_constant
- 功能：包装特定类型的静态常量
- 源码分析：
  - 类模板包含2个参数，分别是类型参数和非类型参数
  - 实现转换函数使`integral_constant`可以转换成`T`类型
  - 实现`()`函数对象使`integral_constant`对象可以函数调用形式返回数据
```cpp
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
```cpp
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
```cpp
template <bool _Val>
using bool_constant = integral_constant<bool, _Val>;

using true_type  = bool_constant<true>;
using false_type = bool_constant<false>;
```
- 示例
```cpp
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
```cpp
// 类1 本可以匹配任意参数且第一个参数false和true均可，但由于类2具体化第一个参数为true，导致要想匹配true只能在只剩一个参数 _First时；
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
```cpp
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

