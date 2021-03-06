---
title: boost
date: 2020-06-07
sidebarDepth: 2
tags:
 - 编译
categories:
 - Boost
---
- [boost](#boost)
  - [boost库编译](#boost库编译)
    - [常用的boost库编译指令解释](#常用的boost库编译指令解释)
    - [示例](#示例)
    - [扩展：部分visual studio的msvc版本](#扩展部分visual-studio的msvc版本)
  - [boost库常用部分](#boost库常用部分)
# boost
## boost库编译
### 常用的boost库编译指令解释
- [常用的编译指令](#常用的编译指令)
- [示例](#示例)
- [扩展部分visual studio的msvc版本](#扩展:部分visual&nbsp;studio的msvc版本)
- `link=static|shared` 指boost生成的动态库还是静态库，如：生成regex库时是生成静态库还是动态库
  - `static`静态库
  - `shared`动态库
  - 默认值: `static`
- `runtime-link=static|shared` 指boost链接系统运行时库的方式，如：regex库需要其它库时，是使用静态链接还是动态链接
  - `static`静态库
  - `shared`动态库
  - 默认值: `shared`
- `--with--<library>` 指定哪一个库需要编译，如 `--with-regex` 则会指编译regex库，忽略 `--with-` 默认编译所以库
- `--without-<library>` 指定哪一个库不需要编译，如 ``--without-regex 则除了regex库外，编译其它所有库
- `threading=single|multi` 指定是否生成多线程库
  - `single` 生成单线程库
  - `multi` 生成多线程库
  - 默认值: `multi`
- `toolset=<toolset>`         指定编译库的工具集，如：`toolset=msvc-12.0`
- `variant=debug|release`   指定生成debug还是release版的库
- `install` 会同时生成lib和include文件
- `stage` 只会生成lib文件
- `--prefix=<INSTALLDIR>` 与`install`选项一起用，指定include和lib文件生成目录
- `--stagedir=<STAGEDIR>` 与`stage`选项一起用，指定lib文件生成目录
  - 默认值：`./stage`
### 示例
* 常用的编译命令
```shell
b2 stage --with-regex toolset=msvc-14.2 link=static runtime-link=shared --stagedir="E:\boost\lib"
```
* 查询需要编译的库
```shell
b2 --show-libraries
```
以上命令会在E:\boost\lib目录下生成静态、多线程、适用vs2019的32|64位、debug|release版的regex库。
### 扩展：部分visual studio的msvc版本
- msvc-14.2是vs2019 
- msvc-14.1是vs2017
- msvc-14.0是vs2015
- msvc-12.0是vs2013
- msvc-10.0是vs2010
## boost库常用部分
- [ ] Asio (Portable networking and other low-level I/O, including sockets, timers, hostname resolution, socket iostreams, serial ports, file descriptors and Windows HANDLEs.)
- [ ] Compute (Parallel/GPU-computing library)
- [ ] DLL (Library for comfortable work with DLL and DSO.)
- [ ] format 字符串的格式化
- [ ] filesystem 文件系统（c++17）
- [ ] Interprocess (进程间通讯)
- [ ] JSON (JSON parsing, serialization, and DOM in C++11)
- [ ] lexical_cast 字符串与数值的转换
- [ ] log 日志
- [ ] Timer (Event timer, progress timer, and progress display classes.)
- [ ] Pool (Memory pool management.)
- [ ] Parameter (Boost.Parameter Library - Write functions that accept arguments by name)
- [x] Process 可移植创建进程
- [x] Serialization (序列化)
- [ ] Stacktrace (Gather, store, copy and print backtraces.)
- [ ] System (错误处理)
- [ ] Timer (Event timer, progress timer, and progress display classes.) 
- [ ] Units (Zero-overhead dimensional analysis and unit/quantity manipulation and conversion.)
