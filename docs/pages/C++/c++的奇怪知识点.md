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


