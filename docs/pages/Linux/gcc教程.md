---
title: gcc教程
date: 2021-01-19
sidebarDepth: 2
tags:
 - gcc
categories:
 - Linux
---
- [gcc教程](#gcc教程)
  - [gcc介绍](#gcc介绍)
  - [gcc 常用指令](#gcc-常用指令)
    - [gcc预处理、编译、汇编和链接4大步骤](#gcc预处理编译汇编和链接4大步骤)
    - [选项-o指定生成文件名](#选项-o指定生成文件名)
    - [选项-l添加链接库](#选项-l添加链接库)
    - [编译多个文件](#编译多个文件)
    - [-std=支持标准范围](#-std支持标准范围)
    - [选项-save-temps保存中间文间(.i .s .o文件)](#选项-save-temps保存中间文间i-s-o文件)
  - [编译链接静态库动态库](#编译链接静态库动态库)
    - [c++ 动态库静态库后缀](#c-动态库静态库后缀)
    - [编译和链接静态库](#编译和链接静态库)
      - [生成](#生成)
      - [使用](#使用)
    - [编译和链接动态库](#编译和链接动态库)
      - [生成](#生成-1)
      - [使用](#使用-1)
  - [windows和Linux上导出动态库的一些区别](#windows和linux上导出动态库的一些区别)
  - [扩展](#扩展)
    - [ldd命令查看可执行程序依赖的共享库](#ldd命令查看可执行程序依赖的共享库)
# gcc教程
## gcc介绍
- GCC:GNU Compiler Collection，GNU编译器容器
</br>
gcc:gcc一般用来编译c文件，但也可以用来编译其它文件，默认以文件结尾来判断:
  - xxx.c：默认以编译 C 语言程序的方式编译此文件；
  - xxx.cpp：默认以编译 C++ 程序的方式编译此文件。
  - xxx.m：默认以编译 Objective-C 程序的方式编译此文件；
  - xxx.go：默认以编译 Go 语言程序的方式编译此文件；

gcc也能通过`-x`指定编译语言，如`gcc -xc++ -lstdc++ 1.cpp`

***建议***：虽然gcc可以编译其它语言，但还是以gcc编译c文件，以g++编译c++文件。因为gcc要编译c++文件需要设置多个编译选项，这样不仅麻烦还可能出错，如下所示
```cpp
//1.cpp
#include<iostream>
using namespace std;
int main(){
	cout<<"hello world!"<<endl;
}
```
- 使用gcc编译：`gcc -xc++ -lstdc++ 1.cpp`
- 使用g++编译：`g++ 1.cpp`
## gcc 常用指令
### gcc预处理、编译、汇编和链接4大步骤
- 预处理`-E`:`g++ -E xxx.c`,生成`xxx.i`预处理文件
- 编译`-S`:`g++ -S xxx.i`,生成`xxx.s`汇编文件
- 汇编`-c`:`g++ -c xxx.s`,生成`xxx.o`目标文件
- 链接`g++ xxx.o -o xxx.exe`,生成`xxx.exe`可执行文件
```shell
$ ls
1.cpp
$ cat 1.cpp 
#include<iostream>
using namespace std;
int main(){
        cout<<"hello world!"<<endl;
}
$ g++ -E 1.cpp
$ ls
1.cpp  1.i
$ g++ -S 1.i
$ ls
1.cpp  1.i  1.s
$ g++ -c 1.i
$ ls
1.cpp  1.i  1.o  1.s
$ g++ 1.o -o 1.exe
$ ls
1.cpp  1.exe  1.i  1.o  1.s
$ ./1.exe
hello world!
```
### 选项-o指定生成文件名
### 选项-l添加链接库
### 编译多个文件
假设有3个文件：main.cpp  print.cpp  print.h
- 方式一：直接生产可执行程序
```shell
$ ls
main.cpp  print.cpp  print.h
$ g++ main.cpp print.cpp -o main.exe
$ ls
main.cpp  main.exe  print.cpp  print.h
```
- 方式二：生产目标文件，再链接
```shell
$ ls
main.cpp  print.cpp  print.h
$ g++ -c main.cpp
$ g++ -c print.cpp
$ ls
main.cpp  main.o  print.cpp  print.h  print.o
$ g++ main.o print.o -o main.exe
$ ls
main.cpp  main.exe  main.o  print.cpp  print.h  print.o
```
### -std=支持标准范围
以下是gcc10.0.2支持的c++标准
- `-std=c++03`
- `-std=c++11`
- `-std=c++14`
- `-std=c++17`
- `-std=c++2a`
### 选项-save-temps保存中间文间(.i .s .o文件)
```shell
$ ls
main.cpp  print.cpp  print.h

$ g++ main.cpp  print.cpp -save-temps
$ ls
a.out     main.ii  main.s     print.h   print.o  main.cpp  main.o   print.cpp  print.ii  print.s

```
## 编译链接静态库动态库
Linux上库命名格式,以lib起始，xxx表示库名，.a结尾是静态库，.so结尾是动态库
- 静态库: `libxxx.a`
- 动态库: `libxxx.so`
### c++ 动态库静态库后缀
- Linux
  - 静态库:`xxx.a`(.a代表achieve)
  - 动态库:`xxx.so`(.so代表share object)
- Windows
  - 静态库:`xxx.lib`
  - 动态库:`xxx.dll`
### 编译和链接静态库
- `-L`选项指定库路径，不知道默认去系统/lib,/usr/lib等路径
#### 生成
1. 将源文件生产目标文件
2. 使用ar打包从静态库
```shell
$ g++ -c print.cpp 
$ ls
main.cpp  print.cpp  print.h  print.o
$ ar rcs libprint.a print.o
$ ls
libprint.a  main.cpp  print.cpp  print.h  print.o
```
#### 使用
- `-static`指定静态链接
- `-lxxx`指定静态库或`libxxx.a`

**注意：**`-o xxx.exe`应该放入最后，即libxxx.a不应该在xxx.exe后
```shell
$ g++ -static main.cpp libprint.a -o main.exe
$ ls
libprint.a  main.cpp  main.exe  print.cpp  print.h  print.o
shuhaiwen@shuhaiwen-PC:~/code/cpp$ ./main.exe
hello world!
```
```shell
$ g++ main.cpp -o main.exe -static -L /home/shuhaiwen/code/cpp/ -lprint
$ ls
libprint.a  main.cpp  main.exe  print.cpp  print.h  print.o
shuhaiwen@shuhaiwen-PC:~/code/cpp$ ./main.exe
hello world!
```
### 编译和链接动态库
#### 生成
```shell
$ g++ -fpic -shared print.cpp -o libprint.so
$ ls
libprint.a  libprint.so  main.cpp  print.cpp  print.h
```
#### 使用
- 方式一：在代码内使用`dlfcn.h`提供的函数动态导入需要的函数
  1. `dlopen`:打开动态库
  2. `dlsym`:获取库函数
  3. `dlclose`:关闭动态库
- 方式二：像静态库链接一样，但需要将动态库放入系统库目录下（例如 /usr/lib、/usr/lib64、/lib、/lib64）(不推荐)
## windows和Linux上导出动态库的一些区别
- 在Linux不需要使用`_declspec(dllexport)`和`__declspec(dllimport)`
- 在Windows上，导出动态库需要`_declspec(dllexport)`
- 在Windows上，导入动态库不使用`__declspec(dllimport)`可以正常使用函数类等，但要使用导出的变量需要加上`__declspec(dllimport)`;
## 扩展
### ldd命令查看可执行程序依赖的共享库
```shell
$ ldd libprint.so
        linux-vdso.so.1 (0x00007ffd48119000)
        libstdc++.so.6 => /lib/x86_64-linux-gnu/libstdc++.so.6 (0x00007f94c2660000)
        libm.so.6 => /lib/x86_64-linux-gnu/libm.so.6 (0x00007f94c24dd000)
        libgcc_s.so.1 => /lib/x86_64-linux-gnu/libgcc_s.so.1 (0x00007f94c24c3000)
        libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f94c2302000)
        /lib64/ld-linux-x86-64.so.2 (0x00007f94c2809000)
```