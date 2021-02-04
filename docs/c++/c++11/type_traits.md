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
  - [类型类别判断](#类型类别判断)
    - [is_void](#is_void)
    - [is_null_pointer](#is_null_pointer)
    - [is_integral](#is_integral)
    - [is_floating_point](#is_floating_point)
    - [is_array](#is_array)
    - [is_enum](#is_enum)
    - [is_union](#is_union)
    - [is_class](#is_class)
    - [is_function](#is_function)
    - [is_pointer](#is_pointer)
    - [is_reference、is_lvalue_reference和is_rvalue_reference](#is_referenceis_lvalue_reference和is_rvalue_reference)
    - [is_member_object_pointer](#is_member_object_pointer)
    - [is_member_function_pointer](#is_member_function_pointer)
    - [is_member_pointer](#is_member_pointer)
    - [is_arithmetic](#is_arithmetic)
    - [is_fundamental](#is_fundamental)
    - [is_object](#is_object)
  - [类型属性判断](#类型属性判断)
    - [is_const](#is_const)
    - [is_volatile](#is_volatile)
    - [extent](#extent)
      - [rank](#rank)
  - [类型关系判断](#类型关系判断)
    - [is_same](#is_same)
    - [is_base_of](#is_base_of)
    - [is_convertible](#is_convertible)
  - [类型修改](#类型修改)
    - [add_pointer](#add_pointer)
    - [remove_pointer](#remove_pointer)
    - [make_signed](#make_signed)
    - [make_unsigned](#make_unsigned)
    - [remove_cv](#remove_cv)
    - [add_cv、add_const和add_volatile](#add_cvadd_const和add_volatile)
    - [remove_reference](#remove_reference)
    - [add_lvalue_reference和add_rvalue_reference](#add_lvalue_reference和add_rvalue_reference)
    - [remove_exten和remove_all_extents](#remove_exten和remove_all_extents)
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
    - [disjunction](#disjunction)
# type_traits
**c++ 类型特性（type_traits）定义一个编译时基于模板的结构，以查询或修改类型的属性**
- 注意事项：在`type_traits`的实现中，有很多需要编译器支持，仅仅利用语言特性实现不了，如
  - `is_enum`
  - `is_union`
  - `is_class`
## 类型类别判断
### is_void
- 功能：检查是否为 void 类型
- 示例
```cpp
#include <iostream>
#include <type_traits>

int main()
{
	decltype(1, 2.2) d;
	std::cout << std::boolalpha;
	std::cout << std::is_void<void>::value << '\n';
	std::cout << std::is_void<int>::value << '\n';
}
```
- 源码分析:
  1. 移除类型cv限定符
  2. 使用[is_same](#is_same)判断是否是void
```cpp
template <class _Ty>
_INLINE_VAR constexpr bool is_void_v = is_same_v<remove_cv_t<_Ty>, void>;

template <class _Ty>
struct is_void : bool_constant<is_void_v<_Ty>> {};
```
### is_null_pointer
- 功能：检查类型是否为 std::nullptr_t
- 示例
```cpp
#include <iostream>
#include <type_traits>
//is_null_pointer
int main()
{
	std::cout << std::boolalpha
		<< std::is_null_pointer< decltype(nullptr) >::value << ' '
		<< std::is_null_pointer< int* >::value << '\n'
		<< std::is_pointer< decltype(nullptr) >::value << ' '
		<< std::is_pointer<int*>::value << '\n';
}
```
- 源码分析：原理同[is_void](#is_void)
```cpp
template <class _Ty>
_INLINE_VAR constexpr bool is_null_pointer_v =
    is_same_v<remove_cv_t<_Ty>, nullptr_t>; // determine whether _Ty is cv-qualified nullptr_t

template <class _Ty>
struct is_null_pointer : bool_constant<is_null_pointer_v<_Ty>> {};
```
### is_integral
- 功能：检查类型是否为整型( bool 、 char 、 char8_t 、 char16_t 、 char32_t 、 wchar_t 、 short 、 int 、 long 、 long long)
- 示例
```cpp
#include <iostream>
#include <type_traits>
 
class A {};
 
enum E : int {};
 
template <class T>
T f(T i)
{
    static_assert(std::is_integral<T>::value, "Integral required.");
    return i;
}
 
int main() 
{
    std::cout << std::boolalpha;
    std::cout << std::is_integral<A>::value << '\n';
    std::cout << std::is_integral<E>::value << '\n';
    std::cout << std::is_integral<float>::value << '\n';
    std::cout << std::is_integral<int>::value << '\n';
    std::cout << std::is_integral<bool>::value << '\n';
    std::cout << f(123) << '\n';
}
```
- 源码分析:原理同[is_void](#is_void);其中_Is_any_of_v间接使用了[disjunction_v](#disjunction)
```cpp
template <class _Ty, class... _Types>
_INLINE_VAR constexpr bool _Is_any_of_v = // true if and only if _Ty is in _Types
    disjunction_v<is_same<_Ty, _Types>...>;

template <class _Ty>
_INLINE_VAR constexpr bool is_integral_v = _Is_any_of_v<remove_cv_t<_Ty>, bool, char, signed char, unsigned char,
    wchar_t,
#ifdef __cpp_char8_t
    char8_t,
#endif // __cpp_char8_t
    char16_t, char32_t, short, unsigned short, int, unsigned int, long, unsigned long, long long, unsigned long long>;

template <class _Ty>
struct is_integral : bool_constant<is_integral_v<_Ty>> {};
```
### is_floating_point
- 功能：检查类型是否是浮点类型( float 、 double 、 long double)
- 示例
```cpp
#include <iostream>
#include <type_traits>
 
class A {};
 
int main() 
{
    std::cout << std::boolalpha;
    std::cout << std::is_floating_point<A>::value << '\n';
    std::cout << std::is_floating_point<float>::value << '\n';
    std::cout << std::is_floating_point<float&>::value << '\n';
    std::cout << std::is_floating_point<double>::value << '\n';
    std::cout << std::is_floating_point<double&>::value << '\n';
    std::cout << std::is_floating_point<int>::value << '\n';
}
```
- 源码分析:原理同[is_integral](#is_integral)
```cpp
template <class _Ty>
_INLINE_VAR constexpr bool is_floating_point_v = _Is_any_of_v<remove_cv_t<_Ty>, float, double, long double>;

template <class _Ty>
struct is_floating_point : bool_constant<is_floating_point_v<_Ty>> {};
```
### is_array
- 功能：检查类型是否是数组类型
- 示例
```cpp
#include <array>
#include <iostream>
#include <type_traits>

class A {};

int main()
{
	std::cout << std::boolalpha;
	std::cout << std::is_array<A>::value << '\n';
	std::cout << std::is_array<A[]>::value << '\n';
	std::cout << std::is_array<A[3]>::value << '\n';
	std::cout << std::is_array<float>::value << '\n';
	std::cout << std::is_array<int>::value << '\n';
	std::cout << std::is_array<int[]>::value << '\n';
	std::cout << std::is_array<int[3]>::value << '\n';
	std::cout << std::is_array<std::array<int, 3>>::value << '\n';
}
```
- 源码分析:针对数组特点，直接具体化`_Ty[]`来匹配数组，其它显然就不是数组
```cpp
template <class>
_INLINE_VAR constexpr bool is_array_v = false; // determine whether type argument is an array

template <class _Ty, size_t _Nx>
_INLINE_VAR constexpr bool is_array_v<_Ty[_Nx]> = true;

template <class _Ty>
_INLINE_VAR constexpr bool is_array_v<_Ty[]> = true;

template <class _Ty>
struct is_array : bool_constant<is_array_v<_Ty>> {};

```
### is_enum
- 功能：检查类型是否是枚举类型（enum class或enum均可）
- 示例
```cpp
#include <iostream>
#include <type_traits>

class A {};

enum E {};

enum class Ec : int {};
int main()
{
	std::cout << std::boolalpha;
	std::cout << std::is_enum<A>::value << '\n';
	std::cout << std::is_enum<E>::value << '\n';
	std::cout << std::is_enum<Ec>::value << '\n';
	std::cout << std::is_enum<int>::value << '\n';
}
```
- 源码分析:需要编译器支持
### is_union
- 功能：检查类型是否为联合体类型
- 示例
```cpp
#include <iostream>
#include <type_traits>
 
struct A {};
 
typedef union {
    int a;
    float b;
} B;
 
struct C {
    B d;
};
 
int main() 
{
    std::cout << std::boolalpha;
    std::cout << std::is_union<A>::value << '\n';
    std::cout << std::is_union<B>::value << '\n';
    std::cout << std::is_union<C>::value << '\n';
    std::cout << std::is_union<int>::value << '\n';
}
```
- 源码分析:需要编译器支持
### is_class
- 功能：检查类型是否非联合类类型（不能是union，enum class）
- 示例 
```cpp
#include <iostream>
#include <type_traits>
 
struct A {};
 
class B {};
 
enum class C {};
 
int main() 
{
    std::cout << std::boolalpha;
    std::cout << std::is_class<A>::value << '\n';
    std::cout << std::is_class<B>::value << '\n';
    std::cout << std::is_class<C>::value << '\n';
    std::cout << std::is_class<int>::value << '\n';
}
```
- 源码分析:先`is_union`排除是联合体，再使用`int T::*`作为类成员指针来确保`T`是一个类，`decltype`是不求值语境，所有模板函数`test`不需要实现
```cpp
namespace detail {
template <class T>
std::integral_constant<bool, !std::is_union<T>::value> test(int T::*);
 
template <class>
std::false_type test(...);
}
 
template <class T>
struct is_class : decltype(detail::test<T>(nullptr))
{};
```
### is_function
- 功能：
- 示例
```cpp
#include <iostream>
#include <type_traits>
 
struct A {
    int fun() const&;
};
 
template<typename>
struct PM_traits {};
 
template<class T, class U>
struct PM_traits<U T::*> {
    using member_type = U;
};
 
int f();
 
int main() 
{
    std::cout << std::boolalpha;
    std::cout << std::is_function<A>::value << '\n';
    std::cout << std::is_function<int(int)>::value << '\n';
    std::cout << std::is_function<decltype(f)>::value << '\n';
    std::cout << std::is_function<int>::value << '\n';
 
    using T = PM_traits<decltype(&A::fun)>::member_type; // T 为 int() const&
    std::cout << std::is_function<T>::value << '\n';
}
```
- 源码分析:
  - 借助语言特性：函数和引用不能被cv限定
  - 先使用`is_const_v`来判断`_Ty`是否能增加`const`限定（用于限定`_Ty`在函数和引用之间）
  - 再利用`is_reference_v`判断是否是`引用`（排除掉了引用，只剩下函数了）
```cpp
template <class _Ty>
_INLINE_VAR constexpr bool is_function_v = // only function types and reference types can't be const qualified
    !is_const_v<const _Ty> && !is_reference_v<_Ty>;

template <class _Ty>
struct is_function : bool_constant<is_function_v<_Ty>> {};
```
- 扩展：以上实现很巧妙，还有更务实的方法见[cppreference.com](https://zh.cppreference.com/w/cpp/types/is_function "https://zh.cppreference.com/w/cpp/types/is_function")
### is_pointer
- 功能：检查 T 是否为指向对象指针或指向函数指针（但不是指向成员/成员函数指针）
- 示例
```cpp
#include <iostream>
#include <type_traits>
 
class A {};
 
int main() 
{
    std::cout << std::boolalpha;
    std::cout << std::is_pointer<A>::value << '\n';
    std::cout << std::is_pointer<A *>::value << '\n';
    std::cout << std::is_pointer<A &>::value << '\n';
    std::cout << std::is_pointer<int>::value << '\n';
    std::cout << std::is_pointer<int *>::value << '\n';
    std::cout << std::is_pointer<int **>::value << '\n';
    std::cout << std::is_pointer<int[10]>::value << '\n';
    std::cout << std::is_pointer<std::nullptr_t>::value << '\n';
}
```
- 源码分析:
  - 针对cv限定和指针具体化不同版本
```cpp
template <class>
_INLINE_VAR constexpr bool is_pointer_v = false; // determine whether _Ty is a pointer

template <class _Ty>
_INLINE_VAR constexpr bool is_pointer_v<_Ty*> = true;

template <class _Ty>
_INLINE_VAR constexpr bool is_pointer_v<_Ty* const> = true;

template <class _Ty>
_INLINE_VAR constexpr bool is_pointer_v<_Ty* volatile> = true;

template <class _Ty>
_INLINE_VAR constexpr bool is_pointer_v<_Ty* const volatile> = true;

template <class _Ty>
struct is_pointer : bool_constant<is_pointer_v<_Ty>> {};
```
- 其它实现:
  - 去除cv限定，再具体化指针版本
```cpp
template<class T>
struct is_pointer_helper : std::false_type {};
 
template<class T>
struct is_pointer_helper<T*> : std::true_type {};
 
template<class T>
struct is_pointer : is_pointer_helper< typename std::remove_cv<T>::type > {};
```
- 上面2个版本分析：本质都是围绕指针和cv限定，一个是移除cv限定，一个是增加cv限定的具体化模板
### is_reference、is_lvalue_reference和is_rvalue_reference
- 功能：检查类型是否为引用或左值引用或右值引用
- 示例
```cpp
#include <iostream>
#include <type_traits>
 
class A {};
 
int main() 
{
    std::cout << std::boolalpha;
    std::cout << std::is_lvalue_reference<A>::value << '\n';
    std::cout << std::is_lvalue_reference<A&>::value << '\n';
    std::cout << std::is_lvalue_reference<A&&>::value << '\n';
    std::cout << std::is_rvalue_reference<A>::value << '\n';
    std::cout << std::is_rvalue_reference<A&>::value << '\n';
    std::cout << std::is_rvalue_reference<A&&>::value << '\n';
}
```
- 源码分析：
  - 具体化`T&`或`T&&`来实现
```cpp
// STRUCT TEMPLATE is_lvalue_reference
template <class>
_INLINE_VAR constexpr bool is_lvalue_reference_v = false; // determine whether type argument is an lvalue reference

template <class _Ty>
_INLINE_VAR constexpr bool is_lvalue_reference_v<_Ty&> = true;

template <class _Ty>
struct is_lvalue_reference : bool_constant<is_lvalue_reference_v<_Ty>> {};

// STRUCT TEMPLATE is_rvalue_reference
template <class>
_INLINE_VAR constexpr bool is_rvalue_reference_v = false; // determine whether type argument is an rvalue reference

template <class _Ty>
_INLINE_VAR constexpr bool is_rvalue_reference_v<_Ty&&> = true;

template <class _Ty>
struct is_rvalue_reference : bool_constant<is_rvalue_reference_v<_Ty>> {};

// STRUCT TEMPLATE is_reference
template <class>
_INLINE_VAR constexpr bool is_reference_v = false; // determine whether type argument is a reference

template <class _Ty>
_INLINE_VAR constexpr bool is_reference_v<_Ty&> = true;

template <class _Ty>
_INLINE_VAR constexpr bool is_reference_v<_Ty&&> = true;

template <class _Ty>
struct is_reference : bool_constant<is_reference_v<_Ty>> {};

```
### is_member_object_pointer
- 功能：检查类型是否为指向非静态成员对象的指针
- 示例
```cpp
#include <iostream>
#include <type_traits>

int main() {
	class cls {};
	std::cout << (std::is_member_object_pointer<int(cls::*)>::value
		? "T is member object pointer"
		: "T is not a member object pointer") << '\n';
	std::cout << (std::is_member_object_pointer<int(cls::*)()>::value
		? "T is member object pointer"
		: "T is not a member object pointer") << '\n';
}
```
- 源码分析：由于`T U::*`既能匹配类成员对象又能匹配类成员函数，所以在此基础上再判断是否是函数。
  1. 先去除cv限定符
  2. 再具体化`_Ty1 _Ty2::*`版本`_Is_member_object_pointer`
  3. 最后再使用`is_function_v`排除类成员函数
```cpp
template <class>
struct _Is_member_object_pointer {
    static constexpr bool value = false;
};

template <class _Ty1, class _Ty2>
struct _Is_member_object_pointer<_Ty1 _Ty2::*> {
    static constexpr bool value = !is_function_v<_Ty1>;
    using _Class_type           = _Ty2;
};
template <class _Ty>
_INLINE_VAR constexpr bool is_member_object_pointer_v = _Is_member_object_pointer<remove_cv_t<_Ty>>::value;

template <class _Ty>
struct is_member_object_pointer : bool_constant<is_member_object_pointer_v<_Ty>> {};
```
### is_member_function_pointer
- 功能：检查类型是否为指向非静态成员函数的指针
- 示例
```cpp
#include <type_traits>
class A {
public:
	void member() { }
};

int main()
{
	decltype(&A::member) pfun;//void(A::* pfun)()
	std::is_member_function_pointer<int>::value;//false
	std::is_member_function_pointer<int (A::*)(int)>::value;//true
	std::is_member_function_pointer<decltype(&A::member)>::value;//true
}
```
- 源码分析:由于`T U::*`既能匹配类成员对象又能匹配类成员函数，所以在此基础上再判断是否是函数。
  1. 具体化`T U::*`版模板且再继承自`is_function`来判断是类成员对象还是类成员函数
```cpp
template< class T >
struct is_member_function_pointer_helper : std::false_type {};

template< class T, class U>
struct is_member_function_pointer_helper<T U::*> : std::is_function<T> {};

template< class T >
struct is_member_function_pointer
	: is_member_function_pointer_helper< typename std::remove_cv<T>::type > {};
```
- 扩展：在上面的源码中使用了`Ret T::*`既能匹配类成员对象又能匹配类成员函数的原理，其实我们也可以使用`Ret (T::*)(Args...)`（类成员函数指针语法）来实现，代码如下
```cpp
#include <type_traits>
template< class T >
struct is_member_function_pointer_helper : std::false_type {};

template< class Ret, class U, class...Args>
struct is_member_function_pointer_helper<Ret(U::*)(Args...)> : std::true_type {};

template< class T >
struct is_member_function_pointer
	: is_member_function_pointer_helper< typename std::remove_cv<T>::type > {};
class A {
public:
	void member() { }
};

int main()
{
	is_member_function_pointer<int A::*>::value;//false
	is_member_function_pointer<int (A::*)(int,int)>::value;//true
	is_member_function_pointer<decltype(&A::member)>::value;//true
}
```
### is_member_pointer
- 功能：检查类型是否为指向非静态成员函数或对象的指针类型
- 示例
```cpp
#include <iostream>
#include <type_traits>
 
int main() {
    class cls {};
    std::cout << (std::is_member_pointer<int(cls::*)>::value
                     ? "T is member pointer"
                     : "T is not a member pointer") << '\n';
    std::cout << (std::is_member_pointer<int>::value
                     ? "T is member pointer"
                     : "T is not a member pointer") << '\n';
}
```
- 源码分析:在有了[is_member_object_pointer](#is_member_object_pointer)和[is_member_function_pointer](#is_member_function_pointer)后，直接利用或运算判断即可
```cpp
template <class _Ty>
_INLINE_VAR constexpr bool is_member_pointer_v = is_member_object_pointer_v<_Ty> || is_member_function_pointer_v<_Ty>;
struct is_member_pointer : bool_constant<is_member_pointer_v<_Ty>> {}; // determine whether _Ty is a pointer to member
```
- 扩展：上面或操作也可以使用`disjunction_v`来代替，如下
```cpp
template <class _Ty>
constexpr bool is_member_pointer_v = std::disjunction_v<std::is_member_object_pointer<_Ty>,std::is_member_function_pointer<_Ty>>;
```
### is_arithmetic
- 功能：检查类型是否为算术类型（即整数类型或浮点类型）
- 示例
```cpp
#include <iostream>
#include <type_traits>
 
class A {};
 
int main() 
{
    std::cout << std::boolalpha;
    std::cout << "A:           " <<  std::is_arithmetic<A>::value << '\n';
    std::cout << "bool:        " <<  std::is_arithmetic<bool>::value << '\n';
    std::cout << "int:         " <<  std::is_arithmetic<int>::value << '\n';
    std::cout << "int const:   " <<  std::is_arithmetic<int const>::value << '\n';
    std::cout << "int &:       " <<  std::is_arithmetic<int&>::value << '\n';
    std::cout << "int *:       " <<  std::is_arithmetic<int*>::value << '\n';
    std::cout << "float:       " <<  std::is_arithmetic<float>::value << '\n';
    std::cout << "float const: " <<  std::is_arithmetic<float const>::value << '\n';
    std::cout << "float &:     " <<  std::is_arithmetic<float&>::value << '\n';
    std::cout << "float *:     " <<  std::is_arithmetic<float*>::value << '\n';
    std::cout << "char:        " <<  std::is_arithmetic<char>::value << '\n';
    std::cout << "char const:  " <<  std::is_arithmetic<char const>::value << '\n';
    std::cout << "char &:      " <<  std::is_arithmetic<char&>::value << '\n';
    std::cout << "char *:      " <<  std::is_arithmetic<char*>::value << '\n';
}
```
- 源码分析:利用[is_integral](#is_integral)和[is_floating_point](#is_floating_point)进行或运算
```cpp
template <class _Ty>
_INLINE_VAR constexpr bool is_arithmetic_v = // determine whether _Ty is an arithmetic type
    is_integral_v<_Ty> || is_floating_point_v<_Ty>;

template <class _Ty>
struct is_arithmetic : bool_constant<is_arithmetic_v<_Ty>> {};

```
### is_fundamental
- 功能：检查是否是基础类型（算术类型+void+nullptr_t）
- 示例
```cpp
#include <iostream>
#include <type_traits>
 
class A {};
 
int main() 
{
    std::cout << std::boolalpha;
    std::cout << "A\t"      << std::is_fundamental<A>::value << '\n';
    std::cout << "int\t"    << std::is_fundamental<int>::value << '\n';
    std::cout << "int&\t"   << std::is_fundamental<int&>::value << '\n';
    std::cout << "int*\t"   << std::is_fundamental<int*>::value << '\n';
    std::cout << "float\t"  << std::is_fundamental<float>::value << '\n';
    std::cout << "float&\t" << std::is_fundamental<float&>::value << '\n';
    std::cout << "float*\t" << std::is_fundamental<float*>::value << '\n';
}
```
- 源码分析:利用[is_arithmetic](#is_arithmetic)和[is_void](#is_void)和[is_null_pointer](#is_null_pointer)进行或运算
```cpp
template <class _Ty>
_INLINE_VAR constexpr bool is_fundamental_v = is_arithmetic_v<_Ty> || is_void_v<_Ty> || is_null_pointer_v<_Ty>;

template <class _Ty>
struct is_fundamental : bool_constant<is_fundamental_v<_Ty>> {}; // determine whether _Ty is a fundamental type

```
### is_object
- 功能：检查是否是对象类型（即任何函数、引用或 void 类型外的可有 cv 限定的类型）
- 示例
```cpp
#include <iostream>
#include <type_traits>
 
int main() {
    class cls {};
    std::cout << std::boolalpha;
    std::cout << std::is_object<int>::value << '\n';
    std::cout << std::is_object<int&>::value << '\n';
    std::cout << std::is_object<cls>::value << '\n';
    std::cout << std::is_object<cls&>::value << '\n';
}
```
- 源码分析:利用函数和引用最顶层不能用cv限定的语言特来排除函数与引用，再排除void  
```cpp
template <class _Ty>
_INLINE_VAR constexpr bool is_object_v = // only function types and reference types can't be const qualified
    is_const_v<const _Ty> && !is_void_v<_Ty>;

template <class _Ty>
struct is_object : bool_constant<is_object_v<_Ty>> {};
```
扩展：以上实现还可这样
```cpp
template< class T>
struct is_object : std::integral_constant<bool,
                     std::is_scalar<T>::value ||
                     std::is_array<T>::value  ||
                     std::is_union<T>::value  ||
                     std::is_class<T>::value> {};
```
## 类型属性判断
### is_const
- 功能：检查类型是否为 const 限定（即 const 或 const volatile ）
- 示例
```cpp
#include <iostream>
#include <type_traits>
 
int main() 
{
    std::cout << std::boolalpha
        << std::is_const_v<int> << '\n' // false
        << std::is_const_v<const int> << '\n' // true
        << std::is_const_v<const int*> /*false*/
        << " because the pointer itself can be changed but not the int pointed at\n"
        << std::is_const_v<int* const> /*true*/ 
        << " because the pointer itself can't be changed but the int pointed at can\n"
        << std::is_const_v<const int&> << '\n' // false
        << std::is_const_v<std::remove_reference_t<const int&>> << '\n' // true
        ;
}
```
- 源码分析：具体化`const`版本的is_const_v用于匹配`const`
```cpp
template <class>
_INLINE_VAR constexpr bool is_const_v = false; // determine whether type argument is const qualified

template <class _Ty>
_INLINE_VAR constexpr bool is_const_v<const _Ty> = true;

template <class _Ty>
struct is_const : bool_constant<is_const_v<_Ty>> {};
```
### is_volatile
- 功能：检查类型是否为 volatile 限定
- 示例
```cpp
#include <iostream>
#include <type_traits>
 
int main() 
{
    std::cout << std::boolalpha;
    std::cout << std::is_volatile<int>::value << '\n';
    std::cout << std::is_volatile<volatile int>::value  << '\n';
}
```
- 源码分析：原理同[is_const](#is_const)
### extent
- 功能：获取数组类型在指定维度的大小
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
#### rank
- 功能：计算指定数组的维度，当非数组时结果为0
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
## 类型关系判断
### is_same
- 功能：检查两个类型是否相同
- 示例
```cpp
#include <iostream>
#include <type_traits>
int main()
{
	std::cout << std::boolalpha;
	// 'int' 为隐式的 'signed'
	std::cout << std::is_same<int, int>::value << "\n";          // true
	std::cout << std::is_same<int, unsigned int>::value << "\n"; // false
	std::cout << std::is_same<int, signed int>::value << "\n";   // true

	// 不同于其他类型， 'char' 既非 'unsigned' 亦非 'signed'
	std::cout << std::is_same<char, char>::value << "\n";          // true
	std::cout << std::is_same<char, unsigned char>::value << "\n"; // false
	std::cout << std::is_same<char, signed char>::value << "\n";   // false
}
```
- 源码分析：`is_same_v`是模板变量含2个模板参数，`is_same_v<_Ty, _Ty>`匹配同一类型类型的模板参数，`is_same`继承`bool_constant`,使其含有value成员变量。
```cpp
template <class, class>
_INLINE_VAR constexpr bool is_same_v = false; // determine whether arguments are the same type
template <class _Ty>
_INLINE_VAR constexpr bool is_same_v<_Ty, _Ty> = true;

template <class _Ty1, class _Ty2>
struct is_same : bool_constant<is_same_v<_Ty1, _Ty2>> {};
```
### is_base_of
- 功能：判断A是否是B的基类(基本类型如std::is_base_of<int, int>::value是false)
- 语法形式：`template< class Base, class Derived > struct is_base_of;`
- 示例
```cpp
#include <iostream>
#include <type_traits>
 
class A {};
 
class B : A {};
 
class C {};
 
int main() 
{
    std::cout << std::boolalpha;
    std::cout << "a2b: " << std::is_base_of<A, B>::value << '\n';
    std::cout << "b2a: " << std::is_base_of<B, A>::value << '\n';
    std::cout << "c2b: " << std::is_base_of<C, B>::value << '\n';
    std::cout << "same type: " << std::is_base_of<C, C>::value << '\n';
}
```
- 源码分析：`is_base_of`继承`integral_constant`，先后判断`is_class`，再通过`test_pre_is_base_of`来测试`D*`是否能转换成`B*`,不能就会转换成`void*`
```cpp
namespace details {
    template <typename B>
    std::true_type  test_pre_ptr_convertible(const volatile B*);
    template <typename>
    std::false_type test_pre_ptr_convertible(const volatile void*);
 
    template <typename, typename>
    auto test_pre_is_base_of(...) -> std::true_type;
    template <typename B, typename D>
    auto test_pre_is_base_of(int) ->
        decltype(test_pre_ptr_convertible<B>(static_cast<D*>(nullptr)));
}
 
template <typename Base, typename Derived>
struct is_base_of :
    std::integral_constant<
        bool,
        std::is_class<Base>::value && std::is_class<Derived>::value &&
        decltype(details::test_pre_is_base_of<Base, Derived>(0))::value
    > { };
```
- 扩展知识
  - `is_base_of<A,A>::value`也是ture？源码中`test_pre_ptr_convertible<B>(static_cast<D*>(nullptr))`这一段D与B一样当然没问题。
### is_convertible
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
### add_cv、add_const和add_volatile
- 功能：给类型添加cv限定符
- 示例
```cpp
#include <iostream>
#include <type_traits>
 
struct foo
{
    void m() { std::cout << "Non-cv\n"; }
    void m() const { std::cout << "Const\n"; }
    void m() volatile { std::cout << "Volatile\n"; }
    void m() const volatile { std::cout << "Const-volatile\n"; }
};
 
int main()
{
    foo{}.m();
    std::add_const<foo>::type{}.m();
    std::add_volatile<foo>::type{}.m();
    std::add_cv<foo>::type{}.m();
}
```
源码分析:原理很简单，直接在类型前增加`const`或`volatile`关键字。（多个const或volatile会自动解析成一个，即`const cosnt int i=2`依然是`const int i=2`）
```cpp
template <class _Ty>
struct add_const { // add top-level const qualifier
    using type = const _Ty;
};

template <class _Ty>
using add_const_t = typename add_const<_Ty>::type;

// STRUCT TEMPLATE add_volatile
template <class _Ty>
struct add_volatile { // add top-level volatile qualifier
    using type = volatile _Ty;
};

template <class _Ty>
using add_volatile_t = typename add_volatile<_Ty>::type;

// STRUCT TEMPLATE add_cv
template <class _Ty>
struct add_cv { // add top-level const and volatile qualifiers
    using type = const volatile _Ty;
};

template <class _Ty>
using add_cv_t = typename add_cv<_Ty>::type;

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
### remove_exten和remove_all_extents
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
### disjunction
- 功能：变参的逻辑或元函数
- 示例:disjunction_v实现is_member_pointer
```cpp
#include <iostream>
#include <type_traits>
template <class _Ty>
constexpr bool is_member_pointer_v = std::disjunction_v<std::is_member_object_pointer<_Ty>,std::is_member_function_pointer<_Ty>>;

template <class _Ty>
struct is_member_pointer : std::bool_constant<is_member_pointer_v<_Ty>> {}; 

int main() {
	
	class cls {};
	std::cout << (is_member_pointer<int(cls::*)>::value
		? "T is member pointer"
		: "T is not a member pointer") << '\n';
	std::cout << (is_member_pointer<int>::value
		? "T is member pointer"
		: "T is not a member pointer") << '\n';
}
```
- 源码分析：
  - `disjunction`2个版本，主模板用于适配无参输入，且返回false
  - `_Disjunction`2个1版本，主模板作为递归终止条件，当匹配到true或最后一个参数时结束
```cpp
template <bool _First_value, class _First, class... _Rest>
struct _Disjunction { // handle true trait or last trait
    using type = _First;
};

template <class _False, class _Next, class... _Rest>
struct _Disjunction<false, _False, _Next, _Rest...> { // first trait is false, try the next trait
    using type = typename _Disjunction<_Next::value, _Next, _Rest...>::type;
};

template <class... _Traits>
struct disjunction : false_type {}; // If _Traits is empty, false_type

template <class _First, class... _Rest>
struct disjunction<_First, _Rest...> : _Disjunction<_First::value, _First, _Rest...>::type {
    // the first true trait in _Traits, or the last trait if none are true
};

template <class... _Traits>
_INLINE_VAR constexpr bool disjunction_v = disjunction<_Traits...>::value;
```

