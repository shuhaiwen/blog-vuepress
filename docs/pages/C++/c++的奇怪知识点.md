---
title: C++的奇怪知识点
date: 2020-09-30
sidebarDepth: 2
tags:
 - C++的奇怪知识点
categories:
 - C++
---
- [c++的奇怪知识点](#c的奇怪知识点)
  - [函数](#函数)
    - [函数中定义类或结构](#函数中定义类或结构)
    - [函数类型、函数指针](#函数类型函数指针)
    - [函数引用](#函数引用)
    - [函数只声明不定义可以使用吗](#函数只声明不定义可以使用吗)
  - [类](#类)
    - [强制类型转换如何实现](#强制类型转换如何实现)
    - [类成员指针`A::*`的使用](#类成员指针a的使用)
    - [成员函数引用限定](#成员函数引用限定)
    - [类中巧用`using`](#类中巧用using)
      - [改变基类成员私用性](#改变基类成员私用性)
      - [继承基类构造](#继承基类构造)
  - [匿名联合体`union`](#匿名联合体union)
  - [布置new（Placement new）](#布置newplacement-new)
  - [`*&`的使用](#的使用)

# c++的奇怪知识点
## 函数
### 函数中定义类或结构
```c++
//1.函数中定义类或结构
void func() {
    struct MyStruct
    {
        int a;
    };
    MyStruct s{2};
    cout <<"s.a=" <<s.a << endl;
}
int main()
{
    func();//s.a=2
}
```
-------------------
### 函数类型、函数指针
- 写法：函数类型是由2部分组成，函数返回值类型和参数类型。(将函数声明式的函数名和参数名去掉就是函数类型的写法)

```c++
int func(int, int) {
    return 0;
}
int main()
{  
    cout<< typeid(func).name();//输出结果 int __cdecl(int,int) ，这就是函数的类型，其中__cdecl是一种函数声明方式，将影响函数名符号表示
    //decltype(func) objFunc=func;//error,func是一个函数指针，不能给一个函数对象
    decltype(func)* pFunc = func;

    using pFunc1 = int(*)(int, int);
    using objFunc1 = int(int, int);

    typedef int objFunc2(int, int);
    typedef int(*pFunc2)(int, int);
}
```
-----
### 函数引用
- 函数引用和函数指针类似，函数引用需要声明时初始化(和引用变量一样)
```c
int fun(int i)
{
	return i;
}
int main()
{
    int(&pFun)(int)=fun;
    pFun(2);//==2
}
```
-------------------
### 函数只声明不定义可以使用吗
一般情况下函数只声明不定义时函数是不能用的，但当处于*不求值语境*下，是可以使用的。例如，`decltype`推导数据类型时，是不需要计算表达式的值的。
```c++
template<class T>
T Func() {
    cout << "done" << endl;
    return T();
}
template<class T>
T Func1();
int main()
{
    decltype(Func<int>()) a=2;
    decltype(Func1<int>()) a1 = 2;//正确，因为decltype不需要执行表达式，因此函数是否定义无所谓
    //Func1<int>();//编译不过，因为没有定义，无法执行  
}
```
-------------------
## 类
### 强制类型转换如何实现
在类中实现转换函数，形如`operator Type ();`
```c++
class A
{
public:
    A() :m_a(0) {}
    A(const int& a) { m_a = a; }
    //用户定义转换函数 int转换函数,当指定了explicit时，转换需显式转换
    explicit operator int() {
        return this->m_a;
    }
    //or
    //operator int& () {
    //    return this->m_a;
    //}
    operator int* () {
        return &this->m_a;
    }
    operator bool() {
        if (m_a > 0)
            return true; 
        else 
            return false; 
    }
private:
    int m_a;
};
int main()
{
    A a(2);
    bool b = a;//隐式调用 operator bool 
    if (a) {}//if 块中默认bool，故也是显式调用operator bool
    //int转换函数
    int i = (int)(a);//显式调用 operator int 
    int i1 = a;//由于未显式指定int，隐式调用 operator bool 
    i = static_cast<int>(a);//显式调用 operator int 
    int* pi = (int*)(a);//显式调用 operator int* 
}
```
-------------------
### 类成员指针`A::*`的使用
- 语法分析
  - 成员变量指针`T A::*`
    - `A::*`：指类型`A`的成员变量指针或成员函数
    - `T`是A类中成员变量类型
  - 成员函数指针`typedef Ret (A::* pFun)(Args);`
    - `Ret`是函数返回值类型
    - `Args`是函数参数类型
- 功能：用来重定向某一类成员变量或成员函数
- 示例
```c++
class A {
public:
    A() :a1(1), a2(2), a3(3) {
        pa1 = new int(5);
        pa2 = new int(6);
    }
    ~A() {
        if (pa1 != nullptr) {
            delete pa1;
            pa1 = nullptr;
        }
        if (pa2 != nullptr) {
            delete pa2;
            pa2 = nullptr;
        }
    }
    int a1;
    int a2;
    int a3;
    
    int* pa1;
    int* pa2;
};


class B {
public:
    int b;
};
template <class T>
void fun1(int T::*) {
    cout << "";
}
int main() {
    //1. 类成员变量指针
    fun1(&A::a2);
    fun1<A>(0);
    fun1<A>(NULL);
    fun1<A>(nullptr);

    int A::* p1 = &A::a1;
    int A::* p2 = &A::a2;
    int A::* p3 = &A::a3;
    A* pa = new A;
    pa->*p1 = 5;
    pa->*p2 = 6;
    pa->*p3 = 7;

    int* A::* pp1 = &A::pa1;
    delete pa->pa1;
    pa->*pp1 = new int(3);
    //2. 类成员函数指针
    typedef int(A::* pFun)();
    pFun fun = &A::sum;
    (pa->*fun)();
    A a;
    (a.*fun)();
}
```
-------------------
### 成员函数引用限定
- 功能：限定成员函数只能从左值或右值调用
- 示例
```c++
#include <iostream>
struct Test {
    //引用限定只能用在非静态成员函数中
    //static void TestSRef()& {
    //    std::cout << " work only if object was a lvalue\n";
    //}
    void TestLRef()& {
        std::cout << "左值"<<std::endl;
    }
    void TestRRef()&& {
        std::cout << " work only if object was a rvalue\n";
    }
};

int main() {
    Test t;
    t.TestLRef();     //ok
    //t.TestRRef();     //不能编译

    //Test{}.TestLRef();//不能编译
    Test{}.TestRRef();//ok
}
```
### 类中巧用`using`
#### 改变基类成员私用性
```c++
class Base {
protected:
    void print(double d) {
        printf("Base");
    }
    double d;
};
class Derived : public Base{
public:
//使继承Base中保护成员并在Derived中成公有成员
    using Base::print;
    using Base::d;
    void print() {
        printf("Derived");
    }
};
int main() {
    Derived d;
    //通过Derived直接访问
    d.print(1.1);//success
    d.d;//success
    //以下编译错误，通过基类作用域符访问不了基类保护成员
    d.Base::print(1.1);//error
    d.Base::d;//error
}
```
#### 继承基类构造
```c++
class Base {
public:
    Base() :m_i(1), m_d(1.1) {}
    Base(int i, double d):m_i(i),m_d(d) {}
private:
    int m_i;
    double m_d;
};
class Derived : public Base {
public:
//声明使用Base中构造函数
    using Base::Base;
};
int main() {
    //调用Base::Base(1,1.1)，如果Derived没有声明using Base::Base;将会编译报错
    Derived d(1,1.1);
  
}
```
## 匿名联合体`union`
- 语法形式：`union { 成员说明 };`
- 功能：匿名联合体的成员被注入到其外围作用域中
- 注意事项：
  - 联合体内成员名不能与外层作用域中其它声明的名称相同
  - 它们不能有成员函数，不能有静态数据成员，且所有数据成员必须为公开。
  - 仅允许非静态数据成员和 static_assert 声明
  - 命名空间作用域的匿名联合体必须声明为 static，除非它们出现于无名命名空间
  - 全局匿名联合体必须声明为 static
- 示例
```c++
namespace nm {
class A 
{
public:
    union
    {
        int i;
        double d;
    };
};
static union
{
    float f=2.3;
};
}
static union
{
    int i1;
};
int main() {
    
    nm::A a;
    a.i = 2;
    nm::f = 1.2;
    i1=3;
}
```
## 布置new（Placement new）
- 语法形式：`new (address) type (initializer)`
- 功能：使用预先分配的内存空间去分配给待分配对象
- 注意事项：保证预先分配的内存大小大于待分配对象所需内存大小
- 示例
```c++
#include<iostream> 
using namespace std;
int main()
{
    // initial value of X 
    int X = 10;

    cout << "Before placement new :" << endl;
    cout << "X : " << X << endl;
    cout << "&X : " << &X << endl;

    // 将X的内存分配给mem，即mem==&X 
    int* mem = new (&X) int{ 100 };

    cout << "\nAfter placement new :" << endl;
    cout << "X : " << X << endl;
    cout << "mem : " << mem << endl;
    cout << "&X : " << &X << endl;

    return 0;
}
```
- 输出结果
```
Before placement new :
X : 10
&X : 010FF8C8

After placement new :
X : 100
mem : 010FF8C8
&X : 010FF8C8
```
## `*&`的使用
- `*&`：指针的引用，功能和作用与`**`指针的指针类型相似
- 解释：`*&`指针的引用，是一个特殊的引用，常见的引用是直接指向对象，而这个引用是执行指针，具有引用所有功能，因此在一定场合可以替代指针的指针`**`使用。
- 示例
```c++
void pass_by_point(int* p)
{
	//Allocate memory for int and store the address in p
	p = new int;
}
void pass_by_point_point(int** p)
{
	//Allocate memory for int and store the address in p
	*p = new int;
}
void pass_by_point_reference(int*& p)
{
	p = new int;
}

int main()
{
	int* p1 = NULL;
	int* p2 = NULL;
	int* p3 = NULL;

	pass_by_point(p1); //p1 is null
	pass_by_point_point(&p2); 
	pass_by_point_reference(p3); 

	return 0;
}
```

