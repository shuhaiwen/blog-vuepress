---
title: variant
date: 2020-12-25
sidebarDepth: 2
tags:
 - variant
categories:
 - C++17
---
- [variant](#variant)
  - [`variant`赋值运算符`=`](#variant赋值运算符)
  - [`variant`成员函数`emplace](#variant成员函数emplace)
  - [`variant`成员函数`index`](#variant成员函数index)
  - [非成员函数`get`](#非成员函数get)
  - [非成员函数`visit`](#非成员函数visit)
# variant
- 功能：`variant`是一个联合体类型，可保持多个类型（同一类型可重复），但任意时刻只能保存一种类型数据
- 注意事项
  - `variant`不容许保有引用、数组，或类型 void 
  - 默认构造的`variant`保有其首个选项的值,如`std::variant<int, float> v;`,v存有int类型0值。
- 示例
```c
#include <variant>
#include <string>
int main()
{

	std::variant<int, float> v,u;
	std::variant<int,std::string> w;
	int ii=std::get<int>(w);//m默认0值
	v.emplace<0>(100);//v含int，值100
	int i1 = std::get<int>(v);
	v.emplace<float>(100.0);//v含float，值100.0
	try
	{
		int i2 = std::get<int>(v);//由于v已经被赋值成float，故取int会失败
	}
	catch (const std::bad_variant_access& e)
	{
		printf(e.what());
	}
	
	float f1 = std::get<1>(v);
	v = 12; // v 含 int
	int i3 = std::get<0>(v);
	u = v;
	//v = w;//error,v和w需要相同
}
```
## `variant`赋值运算符`=`
- `variant`赋值`variant`
  - `variant`参数必须匹配，否则报错
- 任意类型`T`赋值`variant`
  - `T`类型匹配`variant`参数列表中类型
  - `T`类型能转换成`variant`参数列表中类型
- 示例
```c
#include <variant>
#include <string>
int main()
{
	std::variant<std::string> v1;
	v1 = "abc"; // OK
	std::variant<std::string, std::string> v2;
	//v2 = "abc"; // 错误,编译器无法判断是传给参数1还是参数2的string
	v2.emplace<0>("abc");//正确，指示传给参数1指定的string
	std::variant <std::string, bool> v3;
	v3 = "abc"; // OK ：选择 string ； bool 不是候选
}
```
## `variant`成员函数`emplace
- 功能：给`variant`对象赋值
- 注意事项：`emplace`模板参数可以是0值开始的索引值也可以是具体类型
  - 当`variant`保有多个相同类型参数时，不能使用具体类型模板参数，因为编译器不知道你需要赋值给具体哪一个
- 示例
```c
#include <iostream>
#include <string>
#include <variant>
 
int main()
{
    std::variant<std::string> v1;
    v1.emplace<0>("abc"); // OK
    std::cout << std::get<0>(v1) << '\n';
    v1.emplace<std::string>("def"); // OK
    std::cout << std::get<0>(v1) << '\n';
 
    std::variant<std::string, std::string> v2;
    v2.emplace<1>("ghi"); // OK
    std::cout << std::get<1>(v2) << '\n';
    // v2.emplace<std::string>("abc"); -> 错误,编译器无法判断是传给参数1还是参数2的string
}
```
## `variant`成员函数`index`
- 功能：返回 `variant` 当前所保有的可选项的零基下标
- 示例
```c
#include <variant>
#include <string>
#include <iostream>
int main()
{
    std::variant<int, std::string> v = "abc"; 
    std::cout << "v.index = " << v.index() << '\n'; 
    v = {};  
    std::cout << "v.index = " << v.index() << '\n';
}
//输出结果
//v.index = 1
//v.index = 0
```
## 非成员函数`get`
- 功能：获取`variant`中保存的值，用法同从`tuple`中查询数据
- 注意事项：
  - 基于下标访问或基于类型访问必须要确保`variant`中存的是对应下标的数据或对应类型的数据
  - 当`variant`含有多个相同类型时，基于类型的访问不能访问这种含有多个相同类型的数据
- 示例
```c
#include <variant>
#include <string>
 
int main()
{
    std::variant<int, float> v{12}, w;
    int i = std::get<int>(v);
    w = std::get<int>(v);
    w = std::get<0>(v); // 效果同前一行
 
//  std::get<double>(v); // 错误： [int, float] 中无 double
//  std::get<3>(v);      // 错误：合法的 index 值是 0 和 1
 
    try {
      std::get<float>(w); // w 含有 int ，非 float ：将抛出异常
    }
    catch (std::bad_variant_access&) {}
}
```
## 非成员函数`visit`
- 语法形式`template <class R, class Visitor, class... Variants> constexpr R visit(Visitor&& vis, Variants&&... vars);`
- 功能：以variant对象vars作为参数，调用可调用对象vis（函数），相当于调用`std::invoke(std::forward<Visitor>(vis), std::get<is>(std::forward<Variants>(vars))...)`
- 注意事项：
  - 可调用对象`vis`中函数参数应该是具体数据类型中一种，而不是`variant`类型
- 示例
```c
#include <variant>
#include <string>
#include <iostream>
int main()
{
	std::variant<int, std::string> v{ "123" };
	std::visit([](auto&& arg)->void {
		using T = std::decay_t<decltype(arg)>;
		T value;
		if (std::is_same_v<T, int>)
		{
			std::cout << "int value:" << arg << std::endl;;
		}
		else if(std::is_same_v<T,std::string>)
		{
			std::cout << "string value:" << arg << std::endl;;
		}
	}, v);
}
//输出结果：
//string value:123
```
- 可调用对象的其它形式
```c
#include <variant>
#include <string>
#include <iostream>
struct AddVisitor {
	void operator() (int& i) const {
		std::cout <<"int value:"<< i << std::endl;
	}
	void operator() (float& f) const {
		std::cout << "float value:" << f << std::endl;
	}
	void operator() (std::string& s) const {
		std::cout << "string value:" << s << std::endl;
	}
};
int main()
{
	using IntFloatString = std::variant<int, float, std::string>;
	IntFloatString v = 100;
	std::visit(AddVisitor(), v);

	v = 200.0f;
	std::visit(AddVisitor(), v);

	v = "hello world";
	std::visit(AddVisitor(), v);
}
//输出结果
//int value:100
//float value:200
//string value:hello world
```