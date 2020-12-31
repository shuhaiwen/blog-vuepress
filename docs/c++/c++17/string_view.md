---
title: string_view
date: 2020-12-18
sidebarDepth: 2
tags:
 - string_view
categories:
 - C++17
---

# string_view
- 功能：
  - 提供字符串的视图，即提供对字符串的可读操作，不可修改字符串的内容。
  - 避免大内存拷贝，在只需要读操作时使用效率高于`string`。
- 实现原理：
  - `string_view`只有2个数据成员，指向常 CharT 的指针和大小，拷贝时不涉及内存的分配
  - 实现`string`中读操作函数，且这些操作仅仅会更改指向的CharT指针和大小
- 使用场景：在不修改字符串内容，仅仅操作字符串只读函数时使用。
- 注意事项：
  - `string_view`可以从c风格字符初始化，但不能从c++string初始化
  - 由于`string_view`仅由指针和大小表示字符串，并不由终止符`\0`结束，所以如`data()`操作返回字符串实际范围可能更大（因为匹配到最近一个`\0`）。
  - 由于`string_view`仅仅是引用字符串，故要保证`string_view`指向的字符串生命周期要长于`string_view`
- 示例
```cpp
#include <iostream>
#include <string>
#include <string_view>
std::string_view fun_suc()
{
	static std::string strpp = "akjsdjkasd";//
	std::string_view strView(strpp);
	return strView;//strpp静态对象生命周期长于string_view可以返回
}
std::string_view fun_err()
{
	std::string strpp = "akjsdjkasd";
	std::string_view strView(strpp);
	return strView;//strpp对象生命周期短于string_view，不可作为返回值
}
int main() {
	std::string strpp = "akjsdjkasd";
	std::string_view strView(strpp.c_str(),6);
  //data返回指向的字符串头指针，字符串会寻找\0终止符，因此数据将会是akjsdjkasd而不是akjsdj
  std::cout <<"strView.data() : "<< strView.data() << std::endl;;
	std::cout <<"strView.substr(0, 3) : "<< strView.substr(0, 3) << std::endl;
}
//输出结果
//strView.data() : akjsdjkasd
//strView.substr(0, 3) : akj
```