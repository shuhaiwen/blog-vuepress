---
title: constexpr consteval constinit
date: 2020-10-28
sidebarDepth: 2
tags:
 - constexpr
 - consteval
 - constinit
categories:
 - C++11
 - C++20
---
# constexp consteval constinit
## constexp
- `constexpr`说明符声明可以在编译时或在运行时求得函数或变量的值
- 示例
```cpp
#include <iostream>
#include <stdexcept>

// C++11 constexpr 函数使用递归而非迭代
// （C++14 constexpr 函数可使用局部变量和循环）
constexpr int factorial(int n)
{
	return n <= 1 ? 1 : (n * factorial(n - 1));
}
// 输出要求编译时常量的函数，用于测试
template<int n>
struct constN
{
	constN() { std::cout << n << '\n'; }
};

int main()
{
	std::cout << "4! = ";
	constN<factorial(4)> out1; // 在编译时计算

	volatile int k = 8; // 不允许使用 volatile 者优化
	std::cout << k << "! = " << factorial(k) << '\n'; // 运行时计算
}
```
## consteval
- `consteval`说明符声明函数或函数模板为立即函数，即该函数的每次潜在求值的调用（即不求值语境外的调用）必须（直接或间接）产生编译时常量表达式
- 示例
```cpp
consteval int sqr(int n) {
	return n * n;
}
constexpr int r = sqr(100);  // OK

int x = 100;
//int r2 = sqr(x);  // 错误：调用不产生常量

consteval int sqrsqr(int n) {
	return sqr(sqr(n)); // 在此点非常量表达式，但是 OK
}

//constexpr int dblsqr(int n) {
//	return 2 * sqr(n); // 错误：外围函数并非 consteval 且 sqr(n) 不是常量
//}
int main()
{
	constexpr auto val=sqrsqr(2);
}
```
## constinit
- constinit 说明符声明拥有静态或线程存储期的变量,在编译期初始化（即初始化时需要常量），但可在运行期改变。
- 示例
```cpp
#include <iostream>
constinit int constinitVal = 1000;
int main() {
    static constinit int constinitVal2 = 10;
    //constinit int constinitVal3 = 100;// error 只能静态或线程局部中使用
    std::cout << "++constinitVal++: " << ++constinitVal << std::endl;    
    std::cout << "++constinitVal++: " << ++constinitVal2 << std::endl;    
}
```
## constexpr、consteval、constint比较
- 编译期&运行期
  - constexpr编译器或运行期生成
  - consteval编译期生成
  - constinit编译期初始化，运行期可改变
- 常量特性
  - constexpr、consteval隐含常量特性，不可改变
  - constinit编译器常量初始化，运行期可以改变吧，不含常量特性
- 示例
```cpp
#include <iostream>

constexpr int constexprVal = 1000;
constinit int constinitVal = 1000;

int incrementMe(int val){ return ++val;}

int main() {

    auto val = 1000;
    const auto res = incrementMe(val);                                      // (1)                         
    std::cout << "res: " << res << std::endl;
    
    // std::cout << "res: " << ++res << std::endl;                       ERROR (2)
    // std::cout << "++constexprVal++: " << ++constexprVal << std::endl; ERROR (2)
    std::cout << "++constinitVal++: " << ++constinitVal << std::endl;       // (3)

    constexpr auto localConstexpr = 1000;                                   // (4)
    // constinit auto localConstinit = 1000; ERROR
    
}
```