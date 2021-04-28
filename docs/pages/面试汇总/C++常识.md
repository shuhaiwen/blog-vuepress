---
title: C++常识
date: 2021-03-08
sidebarDepth: 2
tags:
 - C++常识
categories:
 - 面试汇总
---
- [C++常识](#c常识)
	- [位运算](#位运算)
	- [预处理、编译、汇编、链接](#预处理编译汇编链接)
	- [5大内存区](#5大内存区)
	- [内存对齐](#内存对齐)
	- [大端、小端](#大端小端)
	- [逗号运算符](#逗号运算符)
	- [虚函数virtual](#虚函数virtual)
		- [纯虚函数](#纯虚函数)
		- [虚函数表](#虚函数表)
			- [概述](#概述)
			- [获取虚函数表方式](#获取虚函数表方式)
			- [虚函数表内存布局](#虚函数表内存布局)
	- [构造函数与析构函数](#构造函数与析构函数)
		- [构造析构顺序](#构造析构顺序)
		- [构造函数、析构函数注意事项](#构造函数析构函数注意事项)
		- [构造函数初始化列表](#构造函数初始化列表)
	- [C++中成员函数能否同时用static和const进行修饰？](#c中成员函数能否同时用static和const进行修饰)
	- [const函数与同名的非const函数是重载函数](#const函数与同名的非const函数是重载函数)
		- [const 对象不能调用非const成员函数](#const-对象不能调用非const成员函数)
	- [this](#this)
		- [this是一个const指针](#this是一个const指针)
	- [private、protected、public](#privateprotectedpublic)
	- [友元](#友元)
	- [override、final、import、module](#overridefinalimportmodule)
	- [返回函数的函数](#返回函数的函数)
	- [函数调用栈](#函数调用栈)
	- [const常量的编译器优化](#const常量的编译器优化)
	- [常量折叠](#常量折叠)
	- [static](#static)
	- [禁止类在栈或堆上分配内存的方法](#禁止类在栈或堆上分配内存的方法)
		- [禁止栈上分配](#禁止栈上分配)
		- [禁止堆上分配](#禁止堆上分配)
	- [数组](#数组)
		- [数组指针、指针数组](#数组指针指针数组)
	- [野指针、悬空指针](#野指针悬空指针)
	- [new 和 malloc 的对比](#new-和-malloc-的对比)
	- [内存泄漏检测工具](#内存泄漏检测工具)
	- [main函数执行前操作](#main函数执行前操作)
	- [编译时多态性，运行时多态性](#编译时多态性运行时多态性)
	- [模板的实现原理](#模板的实现原理)
	- [异常机制](#异常机制)
	- [IO缓存区](#io缓存区)
		- [缓冲区的刷新条件](#缓冲区的刷新条件)
		- [Cache（缓存）和 Buffer（缓冲）区别](#cache缓存和-buffer缓冲区别)
	- [strcpy和memcpy区别](#strcpy和memcpy区别)
	- [运算符优先级](#运算符优先级)
# C++常识
## 位运算
- 按位或运算(|)：2数按位其中任意一个为1得1,2数都为0得0
- 按位与运算(&)：2数按位都为1得1，否则得0
- 按位异或运算(^)：2数按位不同得1，相同得0
## 预处理、编译、汇编、链接
![](https://cdn.jsdelivr.net/gh/shuhaiwen/image-host/Img/c++/%E7%BC%96%E8%AF%91%E6%AD%A5%E9%AA%A4.png)
## 5大内存区
1. 栈区（stack） --编译器自动分配释放，主要存放函数的参数值，局部变量值等；
2. 堆区（heap） --由程序员分配释放；
3. 全局区或静态区 --存放全局变量和静态变量；程序结束时由系统释放，分为全局初始化区和全局未初始化区；
4. 字符常量区 --常量字符串放于此处，程序结束时由系统释放；
5. 程序代码区--存放函数体的二进制代码。

## 内存对齐
规则如下，[详解](https://levphy.github.io/2017/03/23/memory-alignment.html)：
1. 对于结构体的各个成员，第一个成员的偏移量是0，排列在后面的成员其当前偏移量必须是当前成员类型的整数倍
2. 结构体内所有数据成员各自内存对齐后，结构体本身还要进行一次内存对齐，保证整个结构体占用内存大小是结构体内最大数据成员的最小整数倍
3. 如果结构体（联合体）中还有结构体（联合体），子结构体也按相同规则处理
4. 先处理子成员结构，再处理基本成员；子成员结构中最大成员基本数据大小作为类对齐大小。
5. 如程序中有#pragma pack(n)预编译指令，则所有成员对齐以n字节为准(即偏移量是n的整数倍)，不再考虑当前类型以及最大结构体内类型。
::: tip
虚函数表指针也参与内存对齐，内存地址在首位，并且遵守上述规则。
:::
## 大端、小端
大端：低地址存数据高位
小端：低地址存数据低位
判断算法：
```cpp
bool checkCPU()
{//true 小端，fasle 大端
	union MyUnion
	{
		int i;
		char c;
	}u;
	u.i=1;
	return u.c == 1;
}
```
或者
```cpp
	int ix = 0x12345678;
	std::cout << (0x78 == *((char*)&ix) ? "小端" : "大端") << std::endl;
```
::: tip
在x86上是小端，网络上是大端
:::
## 逗号运算符
规则如下：
1. 逗号运算符优先级最低
2. 从左往右依次计算
3. 最后一个计算值作为逗号表达式的返回值
示例1如下：
```cpp
int x, y, z;
x = y = 1;
z = x++, y++, ++y;
printf("%d,%d,%d\n", x, y, z); // 2,3,1
```
解释如下：
1. 由于规则1，`z=x++`优先执行，`x++`结果是1，x变成2，z结果是1;
2. 再计算y++,最后++y,y结果是3，整个表达式结果是++y的结果，即也是3。

示例2如下：
```cpp
int a, b;
a = 1, a + 1, a++;
b = (a = 1, a + 1, a++);
printf("%d,%d\n", a, b);// 2,1
```
解释如下：
1. 小括号运算符>等号运算符>逗号运算符，先进行`a=1`运算，`a+1`结果不影响a的值，再计算`a++`后，a等于2，`a++`表达式返回1，根据规则3，`a++`结果作为`(a = 1, a + 1, a++)`表达式的结果，即`b=1`。
## 虚函数virtual
虚函数要么定义
```cpp
virtual void test(){};
```
要么是纯虚函数
```
virtual void test()=0;
```
但不能只声明
```cpp
virtual void test();//错误的
```
virtual函数是动态绑定，而缺省参数值却是静态绑定，下例输出结果B->1。
```cpp
#include<iostream>
using namespace std;
class A
{
public:
    virtual void func(int val = 1)
    { std::cout<<"A->"<<val <<std::endl;}
    virtual void test()
    { func();}
};
class B : public A
{
public:
    void func(int val=0)
	{std::cout<<"B->"<<val <<std::endl;}
};
int main(int argc ,char* argv[])
{
    B*p = new B;
    p->test();
	return 0;
}
```

::: tip 为什么C++不支持内联成员函数为虚函数？
内联函数就是为了在代码中直接展开，减少函数调用花费的代价，虚函数是为了在继承后对象能够准确的执行自己的动作，这是不可能统一的。（再说了，inline函数在编译时被展开，虚函数在运行时才能动态的邦定函数
:::
::: tip 为什么C++不支持静态成员函数为虚函数？
这也很简单，静态成员函数对于每个类来说只有一份代码，所有的对象都共享这一份代码，也没有动态邦定的必要性。
:::
::: tip 为什么C++不支持友元函数为虚函数？
C++不支持友元函数的继承，对于没有继承特性的函数没有虚函数的说法。
:::
### 纯虚函数
1. 定义了纯虚函数的类是抽象类，派生的具体类需要实现
2. 纯虚函数是只声明未定义的，形如`virtual ~Base()=0;`
3. 析构函数也可以是纯虚的
### 虚函数表
详见[https://cloud.tencent.com/developer/article/1599283](https://cloud.tencent.com/developer/article/1599283)
#### 概述
虚函数表就是存放着当前类中所有***虚函数地址***的表。 在实例化一个具有虚函数的类时，这个表也被分配到这个实例对象的内存中，通过虚函数表可以找到所要调用的虚函数的位置。
1. 类有虚函数，类就会有一个指针指向虚函数表。
2. 在多继承子类里，每一个父类含有虚函数，子类会分别生成一个虚函数表指针指向不同的虚函数表。
3. 虚函数表结构上如一个数组，存储虚函数指针。
4. 虚函数表指针大小由32/64位程序影响，大小占4/8字节。
5. 虚函数表在类内存的首位地址上。
6. 如果子类没有重写虚函数，子类父类虚函数表中指向相同的虚函数地址。
#### 获取虚函数表方式
```cpp
class Base {
public:
	virtual void a() { cout << "Base a()" << endl; }
	virtual void b() { cout << "Base b()" << endl; }
	virtual void c() { cout << "Base c()" << endl; }
};

class Derive : public Base {
public:
	virtual void b() { cout << "Derive b()" << endl; }
};
Derive* p = new Derive;
long* tmp = (long*)p;             // 先将p强制转换为long类型指针tmp
// 由于tmp是虚函数表指针，那么*tmp就是虚函数表
long* vptr = (long*)(*tmp);//vptr就是虚函数表（数组结构）的首地址
typedef void(*vpFun)();//定义虚函数指针
for (int i = 0; i < 3; i++) {//3个虚函数
	printf("vptr[%d] : %p\n", i, vptr[i]);//数组形式访问表中下一个虚函数地址
    vpFun fun=(vpFun)vptr[i];
    fun();//调用虚函数
}
```
#### 虚函数表内存布局
1. 派生类对象在首地址存放虚函数表指针；
2. 虚函数表类似数组，每一个数组元素是虚函数的指针；
3. 虚函数表中先按父类虚函数声明顺序排列，如果派生类重写了虚函数，虚函数指针这指向派生类的虚函数地址；
4. 派生类增加的虚函数，放在虚函数表末尾；
5. 在多重继承情况下，会有多个虚函数表（前提每一个父类都是由虚函数的，没虚函数不产生）；
6. 在多重继承下按继承顺序（如class A : public B,public C{};则第一个虚函数指针指向B，第二个指向C）；
7. 在多重继承下，派生类新增的虚函数，放在第一个虚函数表末尾。

参考[https://www.shuzhiduo.com/A/MAzAp8Ged9/](https://www.shuzhiduo.com/A/MAzAp8Ged9/)
## 构造函数与析构函数
### 构造析构顺序
知识点：
1. 先调用基类构造，再调用本身；先调用本身析构，再调用基类析构。
2. 如果类含有成员，按成员出现的顺序先调用成员构造。
::: tip
不建议在构造函数中抛出异常。构造函数抛出异常时，析构函数将不会被执行，需要手动的去释放内存；
析构函数不应该抛出异常。当析构函数中会有一些可能发生异常时，那么就必须要把这种可能发生的异常完全封装在析构函数内部，决不能让它抛出函数之外。因为如果对象抛出异常了，异常处理模块为了维护系统对象数据的一致性，避免资源泄露，有必要调用析构函数释放资源，这时如果析构过程又出现异常，那么谁来保证新对象的资源释放呢？前面的异常还没处理完又来了新的异常，这样可能会陷入无限的递归嵌套中。所以，从析构函数抛出异常，C++运行时系统会处于无法决断的境遇，因此C++语言担保，当处于这一点时，会调用 terminate()来杀死进程。
:::
### 构造函数、析构函数注意事项
1. 构造函数不能是虚函数
2. 需要继承的类析构函数最好设置为虚的
::: tip 为什么构造函数不能是虚函数？
1. 虚函数表指针是存在对象中的，构造函数还没调用，类对象还没有，也就无法使用虚函数表，这样是矛盾的。
2. 虚函数的作用是使运行时调用函数，但构造函数构造的类对象是在编译期就确定的，所以构造函数不需要虚的。
:::
::: tip 虚析构函数作用
可以通过delete父类而调用派生类的析构，从而避免内存泄漏，资源释放不干净。
:::
### 构造函数初始化列表
- 成员初始化顺序按**类中出现顺序**进行，与**初始化列表顺序无关**。
- 需要在初始化列表中进行初始化的情况
  - 非static const成员
  - 引用成员
  - 成员对象不含默认构造函数

示例[https://www.nowcoder.com/questionTerminal/da5c9884bc824b72a345c8fdfb53b79b](https://www.nowcoder.com/questionTerminal/da5c9884bc824b72a345c8fdfb53b79b)
## C++中成员函数能否同时用static和const进行修饰？
不行！这是因为C++编译器在实现const的成员函数的时候为了确保该函数不能修改类的中参数的值，会在函数中添加一个隐式的参数const this*。但当一个成员为static的时候，该函数是没有this指针的，也就是说此时const的用法和static是冲突的。
## const函数与同名的非const函数是重载函数
类的const对象只能调用const函数，非const对象可以调用const函数和非const成员函数

### const 对象不能调用非const成员函数
```cpp
int main()
{
	class A
    {
		public:
		A() :i(0){}
		A(int j) :i(j) {}
		virtual ~A() {}
		void fun1() {};
		void fun2() const{};
		int i;
	};
	const A a;
	a.fun1();//error
	a.fun2();//successful
}
```
## this
### this是一个const指针
- 为什么`this`需要是`const`呢？假设`this`不是`const`，则`this`可以被赋值如`this=NULL;`,显然这是不能出现的
## private、protected、public
- 成员关系
  - private、protected成员在类外都不可访问
  - protected在派生类中可访问，private派生类中不可访问
- 继承关系
  - public继承，派生类继承的成员可见性与父类一致；
  - protected继承，将基类的公有成员和保护成员变成自己的保护成员
  - private继承，将基类的公有成员和保护成员变成自己的私有成员。
## 友元
1. 友元关系是单向的，即A是B的友元，但B不是A的友元。
2. 友元关系不能被继承，即父类A是B的友元，但子类C不是B的友元。
## override、final、import、module
- `override`：用于说明虚函数重写
- `final`：用于类表示此类将不再能被继承；用于虚函数表示此虚函数不再被重写。
- 示例1
```cpp
struct Base
{
    virtual void foo();
};
 
struct A : Base
{
    virtual void foo() final; // A::foo is final
    void bar() final; // Error: non-virtual function cannot be final
};
 
struct B final : A // struct B is final
{
    void foo(); // Error: foo cannot be overridden as it's final in A
};
 
struct C : B // Error: B is final
{
};
```
- 示例2
```cpp
struct A
{
    virtual void foo();
    void bar();
};
 
struct B : A
{
    void foo() const override; // Error: B::foo does not override A::foo
                               // (signature mismatch)
    void foo() override; // OK: B::foo overrides A::foo
    void bar() override; // Error: A::bar is not virtual
};
```
::: warning
override、final、import、module不是保留字（关键字），而是标识符。
:::
## 返回函数的函数
- 返回函数的函数
```cpp
int (*F(int))(int , int);
```
- 返回函数的函数指针
```cpp
//F是函数指针，函数含1个int参数，返回值是一个函数指针，这个函数指针含2个int参数，返回值是int
int (*(*F)(int))(int , int);
```
## 函数调用栈
程序在运行期间，内存中有一块区域，用来实现程序的函数调用机制。这块区域是一块LIFO的数据结构区域，我们可以叫函数栈（调用栈）。每个未退出的函数都会在函数栈中拥有一块数据区，我们叫函数的栈帧。函数的调用栈帧中，保存了相应的函数的一些重要信息：函数中使用的局部变量，函数的参数，另外还有一些维护函数栈所需要的数据，比如EBP指针，函数的返回地址。
- 入栈顺序
  1. 参数
  2. 返回地址
  3. 局部变量

参考[https://zhuanlan.zhihu.com/p/59479513](https://zhuanlan.zhihu.com/p/59479513)
## const常量的编译器优化
代码如下：
```cpp
const int a = 1;
const int* p = &a;
auto q = const_cast<int*>(p);
cout << a << endl;
*q = 2;
cout << a << endl;
cout << *q << endl;

volatile const int b = 1;
volatile const int* t = &b;
auto r = const_cast<int*>(t);
cout << b << endl;
*r = 2;
cout << b << endl;
cout << *r << endl;
```
输出结果如下：
```
1
1
2
1
2
2
```
解释：
1. 通过p确实间接修改了a内存地址上的数据，但由于编译器优化，a在编译阶段其在上下文中已经被替换，等同于 宏，因此a输出依然是1。
2. 给const前加上volatile，编译器将不会对a进行优化，因此a的值被改变了。
## 常量折叠
概念：常量折叠说的是，在编译阶段，对该变量进行值替换，同时，该常量拥有自己的内存空间，并非像宏定义一样不分配空间。
如下示例输出结果：a = 10, *p = 20
```cpp
#include <iostream> 
using namespace std;
int main(void)
{
	const int a = 10;
	int* p = (int*)(&a);
	*p = 20;
	cout << "a = " << a << ", *p = " << *p << endl;
	return 0;
}
```
## static
1. 静态函数和全局静态变量的作用域是当前文件
2. 静态函数和全局静态变量会覆盖外部同名函数或变量
3. 静态变量或函数放在头文件会导致包含它的文件都有相同的拷贝（功能一致，但地址不一样）
::: tip
非静态函数默认是extern的
:::
::: tip
静态函数和静态变量可以达到避免链接时报重复链接错误。
:::
::: tip 是否在头文件定义静态函数或静态变量？
在头文件放静态函数或静态变量没有实际意义，如果其他文件包含了这个头文件，这些文件都会有一份这个拷贝，这和inline一样，放入源文件才能真正达到原本的目的。
:::
## 禁止类在栈或堆上分配内存的方法
### 禁止栈上分配
原理：栈上构造对象时，编译器会坚持类析构是否可访问；故将析构设为`private`或`protected`;类中实现专门调用析构的函数
```cpp
class A
{
protected:
    A(){}
    ~A(){}
public:
    static A* create()
    {
        return new A();
    }
    void destory()
    {
        delete this;
    }
};
```
### 禁止堆上分配
原理：在堆上分配内存会调用类中operate new,重写operate new并将其设为私用。
```cpp
class A
{
private:
    void* operator new(size_t t){}     // 注意函数的第一个参数和返回值都是固定的
    void operator delete(void* ptr){}  // 重载了new就需要重载delete
public:
    A(){}
    ~A(){}
};
```
## 数组
1. 不能作自增、自减等操作，如++、--，但能+n或-n
2. 数组名指代数组首地址
3. 数组作为参数会自动转换为指针，不管数组元素多少个。
- 数组坑1，看示例
```cpp
int a[5]={1,2,3,4,5};
int *ptr=(int *)(&a+1);
printf("%d",*(ptr-1));
```
解释如下：这里 &a+1 并不是数组的首地址a+1，因为 &a 是指向数组的指针，其类型为int(* )[5]。而指针加1要根据指针类型加上一定的值，不同类型的指针+1之后增加的大小不同，a是长度为5的int数组指针，所以要加5 * sizeof(int)，所以ptr指向的位置是a+5。但是ptr与（&a+1）类型是不一样的，所以ptr-1只会减去sizeof(int*)。
::: tip 数组是const指针
char a[]等价于char *const a,这也是为什么数组不能自加自减的原因
:::
### 数组指针、指针数组
- 数组指针：一个指针指向数组
- 指针数组：一个数组存储的是指针
```cpp
char (*p_Arr)[]={'a',1,2};//数组指针
char *Arr_p[]={"helle","world"};//指针数组
```
::: tip 数组指针、指针数组判断技巧
1. 首先 `[]`优先级大于`*`
2. char `*Arr_p[]`中先`Arr_p[]`是一个数组，数组元素是`char*`
3. char `(*p_Arr)[]`中先`*p_Arr`是一个指针，指向`char []`数组
:::
## 野指针、悬空指针
- 野指针：是指向“垃圾”内存的指针，产生原因如下
  - 指针创建时未初始化，指针会指向一个不合法的内存
  - delete指针后，未设置指针为NULL
  - 指针操作超越了变量的作用域范围
- 悬空指针：指针指向一块已被释放了的内存，如局部变量指针赋值给全局指针，出了局部变量作用域，全局指针指向的内存已被释放。

## new 和 malloc 的对比
1. new/delete是C++操作符(运算符)，malloc/free是C/C++函数。
2. 使用new操作符申请内存分配时无须指定内存块的大小，编译器会根据类型信息自行计算，而malloc则需要显式地指出所需内存的大小。
3. new/delete会调用对象的构造函数/析构函数以完成对象的构造/析构，而malloc只负责分配空间。
4. new 操作符内存分配成功时，返回的是对象类型的指针，类型严格与对象匹配，无须进行类型转换，故new是符合类型安全性的操作符。而malloc内存分配成功则是返回void * ，需要通过强制类型转换将 void* 指针转换成我们需要的类型。
5. 效率上：malloc的效率高一点，因为只分配了空间。
6. operator new /operator delete 可以被重载，而 malloc/free 并不允许重载。
## 内存泄漏检测工具
1. valgrind
2. mtrace
## main函数执行前操作
1. 全局对象的构造函数在main函数之前调用，析构函数在main函数之后调用。
2. 局部栈对象在定义的时候调用构造函数，出了可见范围的时候调用析构函数。
3. 堆对象在new的时候调用构造函数，delete的时候调用析构。
4. 全局静态对象和全局对象一样。
5. 局部静态对象在定义的时候调用构造，main函数之后调用析构
## 编译时多态性，运行时多态性
1. 编译时多态性（静态多态）：通过重载函数实现：先期联编early binding.
2. 运行时多态性（动态多态）：通过虚函数实现：滞后联编late binding.
## 模板的实现原理
模板是编译器支持实现的。编译器识别具体化模板后生成相应的类或函数，当没有一个模板被实例化时，编译器也不会产生任何类或函数。
## 异常机制
参考1[https://blog.csdn.net/lyrebing/article/details/36186721](https://blog.csdn.net/lyrebing/article/details/36186721)
</br>参考2[https://www.jianshu.com/p/dc61f1dc0ec8](https://www.jianshu.com/p/dc61f1dc0ec8)

## IO缓存区
- 缓冲区(buffer)，它是内存空间的一部分。 也就是说，在内存空间中预留了一定的存储空间，这些存储空间用来缓冲输入或输出的数据，这部分预留的空间就叫做缓冲区，显然缓冲区是具有一定大小的。 
- 缓冲区根据其对应的是输入设备还是输出设备，分为输入缓冲区和输出缓冲区。
### 缓冲区的刷新条件
1. 缓冲区满时
2. 执行flush语句
3. 执行endl语句
4. 关闭文件
### Cache（缓存）和 Buffer（缓冲）区别
1. cache 是为了弥补高速设备和低速设备的鸿沟而引入的中间层，最终起到**加快访问速度**的作用。而 buffer 的主要目的进行流量整形，把突发的大数量较小规模的 I/O 整理成平稳的小数量较大规模的 I/O，以**减少响应次数**（比如从网上下电影，你不能下一点点数据就写一下硬盘，而是积攒一定量的数据以后一整块一起写，不然硬盘都要被你玩坏了）
2. A buffer is something that has yet to be "written" to disk.A cache is something that has been "read" from the disk and stored for later use.
3. buffer是用于存放将要输出到disk（块设备）的数据，而cache是存放从disk上读出的数据。二者都是为提高IO性能而设计的。
参考[https://www.zhihu.com/question/26190832](https://www.zhihu.com/question/26190832)
## strcpy和memcpy区别
1. 复制的内容不同。strcpy只能复制字符串，而memcpy可以复制任意内容，例如字符数组、整型、结构体、类等。
2. 复制的方法不同。strcpy不需要指定长度，它遇到被复制字符的串结束符"\0"才结束，所以容易溢出。memcpy则是根据其第3个参数决定复制的长度。
3. 用途不同。通常在复制字符串时用strcpy，而需要复制其他类型数据时则一般用memcpy
## 运算符优先级
![](https://cdn.jsdelivr.net/gh/shuhaiwen/image-host/Img/c++/%E8%BF%90%E7%AE%97%E7%AC%A6%E4%BC%98%E5%85%88%E7%BA%A7-%E8%A1%A81.png)
![](https://cdn.jsdelivr.net/gh/shuhaiwen/image-host/Img/c++/%E8%BF%90%E7%AE%97%E7%AC%A6%E4%BC%98%E5%85%88%E7%BA%A7-%E8%A1%A82.png)