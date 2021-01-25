---
title: fmt教程
date: 2021-01-18
sidebarDepth: 2
tags:
 - fmt
categories:
 - C++库
---
- [fmt教程](#fmt教程)
  - [安装编译](#安装编译)
    - [头文件包含使用](#头文件包含使用)
    - [编译lib使用](#编译lib使用)
  - [入门](#入门)
  - [基础](#基础)
  - [进阶](#进阶)
# fmt教程
## 安装编译
**注意**：fmt可以以加载lib库形式使用或者仅仅包含头文件，若包含头文件使用需要额外包含src目录下文件
- fmt源码目录如下
```
├─.github
├─doc
├─include
├─src
├─support
└─test
```
### 头文件包含使用
1. 将src目录及其子文件移动到include目录下
2. 在项目中包含include项目，如vs中操作:项目->右键属性->c++->附加包含目录->键入fmt include路径
3. 项目中使用fmt前包含头文件`#include<src/format.cc>`、`#include<fmt/core.h>`和其它所需要头文件

注意：头文件`#include<src/format.cc>`一定要包含
```cpp
#include<fmt/core.h>
//不是用lib则需要额外包含src目录下format.cc文件，否则会编译报错
#include<src/format.cc>
int main()
{
	std::string str = fmt::format("hello {}!", "world");
	fmt::print("hello {}!", "world");
}
```
### 编译lib使用
- 编译lib库
  1. 进入fmt项目，执行以下指令
  2. `mkdir build&&cd build`
  3. `make ..`
  4. 如果是windows且安装vs，则会在build目录下生成FMT.sln文件，使用vs打开
  5. 进入FMT项目，在fmt项目上点击生成，将会生成lib文件 
- 使用lib库
  1. 在项目中包含include路径
  2. 载入lib库,`#pragma comment(lib,"../lib/fmtd.lib")`
  3. 包含头文件`#include<fmt/core.h>`以及其它所需要文件
```cpp
#pragma comment(lib,"../lib/fmtd.lib")
#include<fmt/core.h>
int main()
{
	std::string str = fmt::format("hello {}!", "world");
	fmt::print("hello {}!", "world");
}
```
## 入门
- fmt::format格式化字符串
- fmt::print 打印到标准输出
- fmt使用花括号`{}`来代替一个可插入字符串
```cpp
#include<fmt/core.h>
#include<src/format.cc>
int main()
{
  //花括号中可选填0 1 2...用来标记参数索引
  fmt::print("{},{}{}", "hello", "world", "!");
  fmt::print("{0},{1}{2}", "hello", "world", "!");
  fmt::format("{},{}{}", "hello", "world", "!");
}
```
## 基础
- fmt有一系列的格式化标志，详见[官方文档](https://fmt.dev/latest/syntax.html#format-examples 'fmt')
## 进阶
- fmt支持自定义格式化器，详见[官方文档](https://fmt.dev/latest/syntax.html#format-examples 'fmt')