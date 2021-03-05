---
title: Linux软件安装
date: 2021-01-15
sidebarDepth: 2
tags:
 - Linux软件安装
categories:
 - Linux
---
- [Linux软件安装](#linux软件安装)
  - [手动安装gcc](#手动安装gcc)
    - [下载安装依赖文件失败问题](#下载安装依赖文件失败问题)
    - [配置编译选项(自定义安装位置)后符号链接gcc方法](#配置编译选项自定义安装位置后符号链接gcc方法)
    - [删除gcc](#删除gcc)
# Linux软件安装
## 手动安装gcc
**主要设计以下操作,以gcc-10.2.0为例**
1. 解压包：`tar -xzvf gcc-10.2.0.tar.gz`
2. 下载安装依赖性：`cd gcc-10.2.0;./contrib/download_prerequisites`
3. 创建编译文件夹：`mkdir build && cd build`
4. 配置编译选项(自定义安装路径)：`../configure --prefix=/opt/gcc-10.2.0 --enable-checking=release --enable-languages=c,c++ --disable-multilib`
5. 编译：`make`
6. 安装：`sudo make install`
7. 创建符号链接
**注意：在步骤4配置选项中指定了安装路径/opt/gcc-10.2.0，这个路径可以任意，便于后期删除**
### 下载安装依赖文件失败问题
- 问题：文件gmp-6.1.0.tar.bz2  isl-0.18.tar.bz2  mpc-1.0.3.tar.gz  mpfr-3.1.4.tar.bz2下载失败
- 解决方法：
  1. 手动下载并放入gcc-10.2.0文件夹中
  2. 再次执行`./contrib/download_prerequisites`
### 配置编译选项(自定义安装位置)后符号链接gcc方法
注意：以下内容用`src`代替安装路径`/opt/gcc-10.2.0`
1. 执行步骤2时，指定gcc安装位置：`../configure --prefix=/opt/gcc-10.2.0`指定了gcc安装位置在`/opt/gcc-10.2.0`下
2. 在执行完步骤5,6或，创建符号链接,在`/opt/gcc-10.2.0/bin`下新建`gcc-ln.sh`文件，输入以下内容
```shell
#!/bin/bash
#将/opt/gcc-10.2.0/bin/下二进制文件 符号链接到/usr/local/bin下，并且都加上后缀-10，
for file in *; do
  sudo ln -s /opt/gcc-10.2.0/bin/${file} /usr/local/bin/${file}-10
done
```
3. 执行`gcc-ln.sh`文件
```shell
chmod u+x gcc-ln.sh
```
4. 使用gcc-10 或g++-10指令来编译c或c++文件
```shell
$ g++-10 1.cpp
$ ./a.out
hello world!
```
### 删除gcc
因为安装时指定了安装位置，也使用了符号链接二进制文件，因此只需要删除安装文件`/opt/gcc-10.2.0`，同时创建的二进制符号链接也会消失