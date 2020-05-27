---
title: C++异常
date: 2019-06-09
sidebarDepth: 2
tags:
 - 异常
categories:
 - C++
---
# C++异常
## 1.用<code>throw</code>抛出异常
在需要抛异常的地方使用throw
- throw +基本类型
- throw +对象或指针
```c++
class badMesg
{
public:
	void operator ()() {
		cout << "异常badMesg" << endl;
	}
};
bool fun(int val)
{
	if (val == 0)
		throw "异常0";
	else if (val == 1)
		throw 1;
	else if (val == 2)
		throw badMesg();
	else if (val == 3)
		throw new badMesg();
	return true;
	
}
```
## 2.用<code>try catch</code>语句捕获异常
```c++
int main(int argc, char* argv[])
{
	vector<int> vi{ 0,1,2,3 };
	for (auto& elm : vi)
	{
		try {
			bool b = fun(elm);
		}
		catch (const char* m)
		{
			cout << m << endl;
		}
		catch (int& m)
		{
			cout << m << endl;;
		}
		catch (badMesg & m)
		{
			m();
			//m.operator();
		}
		catch (badMesg * m)
		{
			cout << "指针:";
			(*m)();
			//m->operator();
		}

	}
}
```
以上代码执行或打印出如下信息
```
异常0
1
异常badMesg
指针:异常badMesg
```
## 继承<code>exception</code>类实现自己的异常类
1. 继承<code>exception</code>类
2. 重写<code>what</code>方法
```c++
class myException:public exception
{
	const char* what(){return "抛出myException异常";}
};
bool fun(int val)
{
	if (val == 0)
		throw myException();
	else if (val == 1)
		throw new myException();
	return true;
	
}
int main(int argc, char* argv[])
{
	vector<int> vi{ 0,1,2,3 };
	for (auto& elm : vi)
	{
		try {
			bool b = fun(elm);
		}
		catch (exception& e)
		{
			cout << e.what() << endl;
		}
		catch (exception* e)
		{
			cout << e->what() << endl;
		}
	}
}
```
----------------
- [我的GitHub](https://github.com/shuhaiwen "https://github.com/shuhaiwen") 
- [我的CSDN](https://blog.csdn.net/u014140383 "https://blog.csdn.net/u014140383")
- [我的Gitee](https://gitee.com/shuhaiwen "https://gitee.com/shuhaiwen")