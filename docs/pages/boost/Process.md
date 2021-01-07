---
title: Process
date: 2021-01-06
sidebarDepth: 2
tags:
 - Process
categories:
 - Boost
---
- [Process 可移植创建进程](#process-可移植创建进程)
	- [`system`和`spawn`](#system和spawn)
	- [参数风格](#参数风格)
	- [进程的输入输出流](#进程的输入输出流)
# Process 可移植创建进程
## `system`和`spawn`
- 使用`boost::process::system()`阻塞创建进程
- 使用`boost::process::spawn()`不阻塞创建进程
- 简单示例
```cpp
#include <boost/process.hpp>
using namespace boost::process;
int main()
{
	//功能：使用gcc 编译hello.cpp文件
	boost::process::system("g++ hello.cpp", boost::process::std_out >"gcc_out.log" );
	//功能:打开Code.exe（vscode）
	boost::process::system("Code");
	//spawn不阻塞调用
	boost::process::spawn("Code");
	//search_path用于查找可执行程序路径
	boost::process::spawn(boost::process::search_path("Code"));
}
```
## 参数风格
- system和spawn函数参数风格分2大类cmd和Exe/Args，可细分3类
  - 风格1：一条字符串包含所有信息，如`bp::system("gcc --version");`
  - 风格2：多条字符串分割可执行程序路径和参数信息，如`bp::system("D:/MinGW/bin/gcc.exe", "--version");`
  - 风格3：使用命名参数指定参数,如`bp::system(bp::exe = "D:\\MinGW\\bin\\gcc.exe", bp::args = "--version");`
- 注意事项：
  - 当采用风格2和3时，可执行程序路径要全，如gcc路径`D:\\MinGW\\bin\\gcc.exe`，不能仅仅指示可执行程序名，如`gcc`
- 示例：system和spawn具有相同规则
```cpp
#include <boost/process.hpp>
using namespace boost::process;
int main()
{
	//风格1：一条字符串包含所有信息
	bp::system("gcc --version");
	//风格2：多条字符串分割可执行程序路径和参数信息 ；注意事项：gcc.exe路径要填写
	bp::system("D:/MinGW/bin/gcc.exe", "--version");
	//风格3：使用命名参数指定参数 ，参数顺序无限制；注意事项：bp::cmd路径信息可只写gcc，但bp::exe路径要写D:\\MinGW\\bin\\gcc.exe
	bp::system(bp::cmd = "gcc --version");
	bp::system(bp::exe = "D:\\MinGW\\bin\\gcc.exe", bp::args = "--version");
	bp::system(bp::args = "--version",bp::exe = "D:\\MinGW\\bin\\gcc.exe");	
}
```
## 进程的输入输出流
- 输出流 `std_out` 和 `std_err`
- 输入流 `std_in`
- 简单示例
```cpp
#include <boost/process.hpp>
#include <boost/process/windows.hpp>
#include <string>
#include <iostream>
namespace bp = boost::process;
using namespace boost::process;
using namespace std;
int main()
{
	//把gcc版本信息输出到文件gcc_version.txt中
	bp::system("gcc --version", bp::std_out > "gcc_version.txt");
	//把gcc版本信息输出到文件ipstream管道流中
	{
		bp::ipstream ips;
		std::string line,info;
		bp::system("gcc --version", bp::std_out > ips);		
		while (std::getline(ips,line))
		{
			info += line+"\n";
		}
		std::cout << info;
	}
}
```