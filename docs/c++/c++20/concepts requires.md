---
title: concepts requires
date: 2020-10-28
sidebarDepth: 2
tags:
 - concepts
 - requires
categories:
 - C++20
---
- [concepts 和 requires](#concepts-和-requires)
  - [requires](#requires)
    - [requires 子句](#requires-子句)
    - [requires 表达式](#requires-表达式)
      - [简单要求](#简单要求)
      - [类型要求](#类型要求)
      - [复合要求](#复合要求)
      - [嵌套要求](#嵌套要求)
  - [concepts](#concepts)
    - [变量概念](#变量概念)
    - [函数概念](#函数概念)
    - [使用概念](#使用概念)
# concepts 和 requires
这2个关键字的出现可以很好的限制模板参数中参数类型。在此之前，我们对模板参数类型的限制只能在内部处理，现在通过`concepts` 和 `requires`可以限制参数，并在编译期判断模板参数是否符合限制要求。
## requires
requires的语法形式主要2种，分别是Requires clauses（requires 子句）和Requires expressions（requires 表达式）
### requires 子句
- 语法规则：
  - 初等表达式，例如 Swappable<T>、std::is_integral<T>::value、(std::is_object_v<Args> && ...) 或任何带括号表达式
  - 以运算符 && 联结的初等表达式的序列
  - 以运算符 || 联结的前述表达式的序列
- 注意：关键词 `requires` 必须后随某个常量表达式（故可以写为 requires true）,因此才能实现编译期判断
- 示例
```cpp
#include <type_traits>
#include <iostream>

template<typename T>                                  // (1)
concept Integral = std::is_integral<T>::value;       

template<typename T>                                  // (2)
requires std::is_integral<T>::value
T gcd(T a, T b){
    if( b == 0 ) return a;
    else return gcd(b, a % b);
}
template<typename T>                                  // (2)
requires Integral<T>
T gcd1(T a, T b){
    if( b == 0 ) return a;
    else return gcd1(b, a % b);
}
template<typename T>                                  // (2)
T gcd2(T a, T b)requires Integral<T>{
    if( b == 0 ) return a;
    else return gcd2(b, a % b);
}
template<Integral T>                                  // (2)
T gcd3(T a, T b){
    if( b == 0 ) return a;
    else return gcd3(b, a % b);
}
template<typename T>                                  // (5)
requires Integral<T>&&(sizeof(T)==4)
T gcd4(T a, T b){
    if( b == 0 ) return a;
    else return gcd4(b, a % b);
}
int main(){

    std::cout << std::endl;

    std::cout << "gcd(100, 1)= "  <<  gcd(100l, 1l)  << std::endl; 
    std::cout << "gcd1(100, 2)= " <<  gcd1(100, 2)  << std::endl;
    std::cout << "gcd2(100, 3)= " <<  gcd1(100, 3)  << std::endl;
    std::cout << "gcd3(100, 4)= " <<  gcd1(100, 4)  << std::endl;
    std::cout << "gcd4(100, 5)= " <<  gcd4(100, 5)  << std::endl;
}
```
### requires 表达式
- 语法规则
  - `requires ( 形参列表(可选) ) { 要求序列 }`
  - 要求序列包含4种类型
    - 简单要求（simple requirement）
    - 类型要求（type requirement）
    - 复合要求（compound requirement）
    - 嵌套要求（nested requirement）
- 注意：因为要求序列中的表达式是不求值的，只是检查表达式是否合法，因此，如
#### 简单要求
- 规则：要求序列是不含`requires`关键字的表达式语句，如表达式是`a+b;`，而不能是`requires (a+b);`.
- 注意：它断言该表达式合法。该表达式是不求值操作数；只检查语言正确性。而且表达式可以有多个，之间用分号`;`隔开。
- 示例
```cpp
template<typename T>
concept Addable =
requires (T a, T b) {
    a + b; // “表达式 a + b 是可编译的合法表达式”
};
 
template <class T, class U = T>
concept Swappable = requires(T&& t, U&& u) {
    swap(std::forward<T>(t), std::forward<U>(u));
    swap(std::forward<U>(u), std::forward<T>(t));
};
```
#### 类型要求
- 规则：要求`typename`关键字后接类型名，用来判断指定类型名是否合法
```cpp

#include <type_traits>
#include <vector>
 
int main(){
    static_assert( 
        requires(std::vector<int> v){  
            typename std::vector<int>::value_type;   //Type Requirement
        }  
   );
```
#### 复合要求
- 语法：`{ 表达式 } noexcept(可选) ->返回类型要求(可选) ;`
- 示例
```C++
template<typename T> concept C2 =
requires(T x) {
    {*x} -> std::convertible_to<typename T::inner>; // 表达式 *x 必须合法
                                                    // 并且 类型 T::inner 必须合法
                                                    // 并且 *x 的结果必须可以转换为 T::inner
    {x + 1} -> std::same_as<int>; // 表达式 x + 1 必须合法
                                  // 并且 std::Same<decltype((x + 1)), int> 必须被满足
                                  // 亦即，(x + 1) 必须为 int 类型的纯右值
    {x * 1} -> std::convertible_to<T>; // 表达式 x * 1 必须合法
                                       // 并且其结果必须可以转换为 T
};
```
#### 嵌套要求
- 语法：`requires 约束表达式 ;`
- 示例
```cpp

#include <type_traits>
#include <vector>
 
int main(){
    static_assert( 
        requires(std::vector<int> v, int i){  
            v.at(i);  //Simple Requirement
            typename std::vector<int>::value_type;   //Type Requirement
            (sizeof(int)==5);  //这个结果是false，表达式合法，依然检查通过
            requires (sizeof(int)==5);  //嵌套要求，这个结果为false，约束不能通过
        }  
   );

```
## concepts
`concepts`是约束的集合，概念有2种形式，以函数模板定义（称为函数概念），以变量模板定义（称为变量概念）。
### 变量概念
- 语法:`template < 模板形参列表 > concept 概念名 = 约束表达式;`
- 规则：
  - 约束表达式可以`requires`
  - 必须有类型 bool
  - 不允许 constexpr ，变量自动为 constexpr
- 示例
```cpp
// 来自标准（范围 TS ）的变量概念
template <class T, class U>
concept bool Derived = std::is_base_of<U, T>::value//满足概念库中定义的T是U的基类
&&requires(T t){++t;}//t满足++运算
||(sizeof(T)>4); //T类型大小大于4
```
### 函数概念
- 规则
  - 不允许 inline 与 constexpr ，函数自动为 inline 与 constexpr
  - 不允许 friend 与 virtual
  - 不允许异常规定，函数自动为 noexcept(true) 。
  - 不能声明并延迟定义，不能重声明
  - 返回类型必须是 bool
  - 不允许返回类型推导
  - 参数列表必须为空
  - 函数体必须仅由一条 return 语句组成，其参数必须是一条制约表达式（谓词制约、其他制约的
  - 合取/析取或 requires 表达式，见后述）
```cpp
// 来自标准（范围 TS ）的函数概念
template <class T>
concept bool EqualityComparable() { 
    return requires(T a, T b) { {a == b} -> Boolean; {a != b} -> Boolean; };
}
```
### 使用概念
有三种使用概念的方式
```cpp
//Requires Clause
template<typename Cont>
    requires Sortable<Cont>
void sort(Cont& container);
//Trailing Requires Clause
template<typename Cont>
void sort(Cont& container) requires Sortable<Cont>;
//Constrained Template Parameters
template<Sortable Cont>
void sort(Cont& container);
```