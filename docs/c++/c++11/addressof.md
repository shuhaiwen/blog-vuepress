---
title: addressof
date: 2020-12-07
sidebarDepth: 2
tags:
 - addressof
categories:
 - C++11
---
# std::addressof
- 功能：获取传入对象或函数的地址
- 使用场景
  - 获取函数指针，但函数不能有重载(即同名函数)
  - 当对象已实现了`operator&`取地址运算符时，且此取地址返回的不是该对象实际地址时
- 示例
```c++
#include <memory>
void fun() {
    printf("fun");
}
int main()
{
    int i = 2;
    auto pFun=std::addressof(fun);
    pFun();
    auto pi=std::addressof(i);
}
```
- 源码分析：
  - `addressof`函数有2种重载，一种针对对象类型，一种针对非对象类型
    - 针对对象版：将传入对象先强制转换char&，在取char&地址，最后强制转换T*,这样就不会调用对象的重载版本`operator&`
    - 针对非对象版，直接取地址即可
  - 将`addressof(const _Ty&&)`右值重载删除，禁止临时对象的传入
```c++
//以下是可能的实现方式
//通过enable_if来决定调用哪一个addressof的实现
//函数1 当T是对象时，调用这个实现，返回类型是T*
template<class T>
typename std::enable_if<std::is_object<T>::value, T*>::type  addressof(T& arg) noexcept
{
    return reinterpret_cast<T*>(
               &const_cast<char&>(
                   reinterpret_cast<const volatile char&>(arg)));
}
 //函数2 当T是非对象类型时，调用这个实现
template<class T>
typename std::enable_if<!std::is_object<T>::value, T*>::type addressof(T& arg) noexcept
{
    return &arg;
}
//删除右值重载，禁止临时对象的传入，即addressof(2)这种类型会编译报错
template <class _Ty>
const _Ty* addressof(const _Ty&&) = delete;
```

## 与取地址运算符`operator&`比较
- 区别：当对象实现了自定义的`operator&`取地址运算符时，且，返回的地址不是本对象的实际地址，这时运用`&T`将会得到非预期的T类型对象地址，而`addressof`将始终返回实际的对象地址
- 示例
```c++
#include <iostream>
#include <memory>
 
template<class T>
struct Ptr {
    T* pad; // 增加填充以显示‘ this ’和‘ data ’的区别
    T* data;
    Ptr(T* arg) : pad(nullptr), data(arg) 
    {
        std::cout << "Ctor this = " << this << std::endl;
    }
 
    ~Ptr() { delete data; }
    T** operator&() { return &data; }
};
 
template<class T>
void f(Ptr<T>* p) 
{
    std::cout << "Ptr   overload called with p = " << p << '\n';
}
 
void f(int** p) 
{
    std::cout << "int** overload called with p = " << p << '\n';
}
 
int main() 
{
    Ptr<int> p(new int(42));
    f(&p);                 // 调用 int** 重载
    f(std::addressof(p));  // 调用 Ptr<int>* 重载，（ = this ）
}
```
- 输出结果
```
Ctor this = 00EFFB80
int** overload called with p = 00EFFB84
Ptr   overload called with p = 00EFFB80
```