---
title: C++引用和指针运用多态特性
date: 2019-06-11
sidebarDepth: 2
tags:
 - 多态
categories:
 - C++
---
# c++ 引用和指针运用多态特性
- [指针方式](#指针方式)
- [引用方式](#引用方式)
## 指针方式
将子类对象赋给基类指针
```c++
class A
{
public:
	virtual void operator ()()
	{
		cout<< "A";
	};
};
class B:public A {
	virtual void operator ()()
	{
		cout << "B";
	};
};
int main()
{
    A* aP = new B();
	(*aP)();
	delete aP;
	aP = nullptr;
}
```
上面代码执行<code>(*aP)();</code>之后打印出B，而不是A,说明是执行了子类方法。
## 引用方式
将子类对象赋给基类引用
```c++
class A
{
public:
	virtual void operator ()()
	{
		cout<< "A";
	};
};
class B:public A {
	virtual void operator ()()
	{
		cout << "B";
	};
};
int main()
{
    B b;
	A& aRef = b;
	aRef();
}
```
上面代码执行<code>aRef();</code>之后打印出B，而不是A，说明是执行了子类方法。
-----------
- [我的GitHub](https://github.com/shuhaiwen "https://github.com/shuhaiwen") 
- [我的CSDN](https://blog.csdn.net/u014140383 "https://blog.csdn.net/u014140383")
- [我的Gitee](https://gitee.com/shuhaiwen "https://gitee.com/shuhaiwen")