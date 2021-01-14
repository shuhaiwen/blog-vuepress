---
title: Linux命令
date: 2020-05-04
sidebarDepth: 2
tags:
 - Cmd
categories:
 - Linux
---
- [Linix 命令](#linix-命令)
  - [基本操作](#基本操作)
    - [命令连接符`&&`、`||`和`;`](#命令连接符和)
    - [文件重定向符](#文件重定向符)
  - [常用命令](#常用命令)
    - [`chmod`](#chmod)
    - [`tar`](#tar)
      - [打包、解包](#打包解包)
      - [解压包](#解压包)
    - [查看压缩包内容](#查看压缩包内容)
    - [附加文件](#附加文件)
  - [Linux命令学习步骤](#linux命令学习步骤)
# Linix 命令
## 基本操作
### 命令连接符`&&`、`||`和`;`
- `&&`连接的多条命令会按顺序执行，直到命令出现错误就停止执行后面命令
- `||`连接的命令直到正确执行了一条命令就会终止后续命令的执行
- `;`连接的命令会按顺序一直执行，不管命令是否有误都不影响后续的命令执行
```shell
$ llk && echo "hello"
bash: llk：未找到命令
$ llk || echo "hello" || echo "world"
bash: llk：未找到命令
hello

$ llk ; echo "hello"
bash: llk：未找到命令
hello
```
### 文件重定向符
**重定向符`>`,`>>`和`<`,`<<`;其中`>>`是以追加方式写入目标，而`>`是直接覆盖目标;`<`将源作为输入传给命令，而`<<`讲多段以分隔符标识的范围数据传给命令**
- 文件修饰符：
  - `stdin`标准输入流为0
  - `stdout`标准输出流为1
  - `stderr`标准错误流为2
- `command 1>file1 2>file2`表示将command执行结果的正确结果重定向到file1，错误结果重定向到file2(如果未指定文件标识符，默认为1，即标准输出流)
```shell
$ ls
test.sh
$ cat -n test.sh 
     1  #!/bin/bash
     2
     3  echo "hello world!"
     4  # 这是一条错误指令
     5  error
     6  date
$ bash test.sh 1>1.out 2>2.err
$ cat 1.out
hello world!
2021年 01月 14日 星期四 17:06:17 CST
$ cat 2.err
test.sh:行5: error：未找到命令
```
- `command 2>file 1>&2`或者`command >file 2>&1`：其中`1>&2`表示标准输出流合并到标准错误流中，`2>&1`反之
```shell
$ ls
test.sh
$ bash test.sh 2>2.err 1>&2
$ cat 2.err
hello world!
test.sh:行5: error：未找到命令
2021年 01月 14日 星期四 17:26:58 CST
$ bash test.sh >1.out 2>&1
$ cat 1.out
hello world!
test.sh:行5: error：未找到命令
2021年 01月 14日 星期四 17:28:44 CST
```
- `command <<del data1 date2 del`:表示将del分隔符范围的数据作为输入
```shell
shuhaiwen@shuhaiwen-PC:~/code/sh/test$ echo <<del
> 123
> 456
> end
> del

```
## 常用命令
### `chmod`
- `chmod [ugoa][+-=][rwx][file]`
  - u  用户user，表现文件或目录的所有者
  - g  用户组group，表现文件或目录所属的用户组
  - o  其他用户other
  - a  所有用户all
  - +  增加权限（附加）
  - -  移除权限
  - =  重赋值权限（覆盖之前的权限）
  - r  读权限
  - w  写权限
  - x  可执行权限
```cmd
$ ls -l
总用量 0
-rw-r--r-- 1 xxx xxx 0 1月   3 13:30 1.md
$ chmod u=x 1.md
$ ls -l
总用量 0
---xr--r-- 1 xxx xxx 0 1月   3 13:30 1.md
总用量 0
```
```cmd
$ chmod u+r 1.md
$ ls -l
总用量 0
-r-xr--r-- 1 xxx xxx 0 1月   3 13:30 1.md
```
- `chmod [0124567][file]`
  - 0 无权限
  - 1 x权限
  - 2 w权限
  - 4 r权限
```cmd
$ chmod 0544 1.md
$ ls -l
总用量 0
-r-xr--r-- 1 xxx xxx 0 1月   3 13:30 1.md
```
### `tar`
- `tar`分打包解包，再分解压包
#### 打包、解包
- -c或--create 建立新的备份文件
```shell
$ tar -cvf 1.tar 1.md
1.md
$ ls
1.md 1.tar
```
```shell
$ ls
1.tar
$ tar -xvf 1.tar
1.md
$ ls
1.md  1.tar
```
#### 解压包
- -z使用gzip压缩或解压
- -x执行解压
```shell
$ tar -cvzf 1.tar.gz 1.md
1.md
$ ls
1.md  1.tar.gz
```
```shell
$ ls 
1.tar.gz
$ tar -xzvf 1.tar.gz
1.md
$ ls
1.md  1.tar.gz
```
### 查看压缩包内容
- -t查看压缩包内容
```shell
$ tar -cvf 1.tar 1.md
1.md
$ tar -tf 1.tar
1.md
```
### 附加文件
- -r或--append 新增文件到已存在的备份文件的结尾部分
```shell
$ tar -cvf 1.tar 1.md
1.md
$ tar -tf 1.tar
1.md
$ tar -rvf 1.tar 2.md
2.md
$ tar -tvf 1.tar
-r-xr--r-- xxx/xxx 0 2021-01-03 13:30 1.md
-rw-r--r-- xxx/xxx 0 2021-01-03 14:16 2.md
```
## Linux命令学习步骤

1. pwd 显示当前所在路径 
2. cd
3. ls  显示指定目录下文件及其属性
4. cp
5. mkdir rmdir
6. cat
7. 