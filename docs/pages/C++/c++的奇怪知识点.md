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
  - [函数中定义类或结构](#函数中定义类或结构)
  - [函数类型、函数指针](#函数类型函数指针)
  - [函数只声明不定义可以使用吗](#函数只声明不定义可以使用吗)
  - [强制类型转换如何实现](#强制类型转换如何实现)
  - [`T A::*`的使用](#t-a的使用)
  - [成员函数引用限定](#成员函数引用限定)

# c++的奇怪知识点
## 函数中定义类或结构
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
## 函数类型、函数指针
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
-------------------
## 函数只声明不定义可以使用吗
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
## 强制类型转换如何实现
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
## `T A::*`的使用
- 语法分析
  - `A::*`：指类型`A`的成员指针
  - `T`是指类型`A`中成员的类型，可以是是指针或引用类型
- 功能：用来重定向某一类成员变量
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
    fun1(&A::a2);
    fun1<A>(0);
    fun1<A>(NULL);
    fun1<A>(nullptr);

    int A::* p1 = &A::a1;//用p1指向类A的成员a1
    int A::* p2 = &A::a2;
    int A::* p3 = &A::a3;
    A* pa = new A;
    pa->*p1 = 5;//通过*p1访问类A中成员a1，并赋值5
    pa->*p2 = 6;
    pa->*p3 = 7;

    int* A::* pp1 = &A::pa1;//用pp1指向类A中成员pa1
    delete pa->pa1;
    pa->*pp1 = new int(3);

}
```
-------------------
## 成员函数引用限定
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

