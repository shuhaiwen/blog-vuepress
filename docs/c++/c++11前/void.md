---
title: void
date: 2020-09-28
sidebarDepth: 2
tags:
 - void
categories:
 - C++
---

# void 
- 功能
  - 函数返回值void
  - void* 指针
  - void表达式
- 使用场景
  - 当作函数返回值时，指示此函数无返回值类型
  - 当作void*指针时，任意类型指针都可隐式转换void类型
  - 当作void表达式时，如(void)0,可指示此表达式无返回值，是一个不完整类型，不可作为左值或右值使用
- 示例
```c++
struct A
{

};
//1.函数返回值void
void FUN()
{
    //不能使用return
}
bool b1()
{
    cout << "false" << endl;
    return false;
}
bool b2()
{
    cout << "true" << endl;
    return true;
}
int main()
{    
    int i = 2;
    //2.任何类型指针可隐式转换void*
    void* pv = &i;
    int* pi = static_cast<int*>(pv);
    //3.任意对象和表达式都可以强制void，作用表达式无返回值
    (void)i;
    A a;
    (void)a;
    void(1 + 2);
    (void)(b1() || b2());//执行表达式，void使表达式结果成为void类型，不能作为左值或右值
}
```