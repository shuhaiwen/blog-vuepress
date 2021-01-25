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
  - [文件操作](#文件操作)
    - [chmod](#chmod)
    - [tar](#tar)
      - [打包、解包](#打包解包)
      - [解压包](#解压包)
      - [查看压缩包内容](#查看压缩包内容)
      - [附加文件](#附加文件)
    - [mv](#mv)
    - [cp](#cp)
    - [touch](#touch)
    - [rm](#rm)
    - [rmdir](#rmdir)
    - [mkdir](#mkdir)
    - [ln](#ln)
      - [软链接：](#软链接)
      - [硬链接：](#硬链接)
  - [显示信息操作](#显示信息操作)
    - [cat](#cat)
    - [ls](#ls)
    - [locale](#locale)
    - [pwd](#pwd)
  - [Linux命令学习步骤](#linux命令学习步骤)
# Linix 命令
**以下所有命令都只描述了常用的选项，忽略了很少涉及到的选项**
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
**重定向符`>`,`>>`和`<`,`<<`;其中`>>`是以追加方式写入目标，而`>`是直接覆盖目标;`<`将源作为输入传给命令，而`<<`将多段以分隔符标识的范围数据传给命令**
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
## 文件操作
### chmod
- `chmod [ugoa][+-=][rwx][file]`
  - `u`  用户user，表现文件或目录的所有者
  - `g`  用户组group，表现文件或目录所属的用户组
  - `o`  其他用户other
  - `a`  所有用户all
  - `+`  增加权限（附加）
  - `-`  移除权限
  - `=`  重赋值权限（覆盖之前的权限）
  - `r`  读权限
  - `w`  写权限
  - `x`  可执行权限
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
  - 1 `x`权限
  - 2 `w`权限
  - 4 `r`权限
```cmd
$ chmod 0544 1.md
$ ls -l
总用量 0
-r-xr--r-- 1 xxx xxx 0 1月   3 13:30 1.md
```
### tar
`tar`本质上只具有打包功能，而不具有解压缩功能，其内部调用`gzip`或其它打包工具才能执行解压缩功能
#### 打包、解包
- `-c`或`--create` 建立新的备份文件
- `-f`指定文件名
- `-v`生成详细执行信息
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
- `-z`使用gzip压缩或解压
- `-x`执行解压
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
#### 查看压缩包内容
- `-t`查看压缩包内容
```shell
$ tar -cvf 1.tar 1.md
1.md
$ tar -tf 1.tar
1.md
```
#### 附加文件
- `-r`或`--append` 新增文件到已存在的备份文件的结尾部分
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
### mv
- 语法形式：`mv [option] [原文件] [目标文件]`
- 功能：
  - 文件或文件夹改名:`mv oldname newname`
  - 文件或文件夹移动
- `-b`当目标文件存在时备份目标文件
- `-n`当目标文件存在时不覆盖
- `-f`当目标文件存在时覆盖，不提示(默认)
- `-i`当目标文件存在时提示用户选择是否覆盖，y是，n否
- `-u`当目标文件存在时，源文件比目标文件新时才覆盖
```shell
~/code/sh$ ls
1.txt  2.txt
~/code/sh$ mv -b 1.txt 2.txt
~/code/sh$ ls
1  2.txt  2.txt~
```
上例由于目标文件已存在，指定了`-b`选项后会生成备份文件2.txt~
```shell
~/code/sh$ ls
1.txt  2.txt
~/code/sh$ mv -n 1.txt 2.txt
~/code/sh$ ls
1.txt  2.txt
```
上例由于目标文件已存在，指定了`-n`选项后不会执行移动操作
```shell
~/code/sh$ ls
1.txt  2.txt
~/code/sh$ mv -f 1.txt 2.txt
~/code/sh$ ls
2.txt
```
上例由于目标文件已存在，指定了`-f`直接覆盖
```shell
~/code/sh$ mv -i 1.txt 2.txt
mv：是否覆盖'2.txt'？ n
~/code/sh$ ls
1.txt  2.txt
```
上例由于目标文件已存在，指定了`-i`生成了提示信息，选择n不覆盖
### cp
`cp`命令参数和`mv`中很相似,可以参考
- 语法形式：`cp [option] [原文件] [目标文件]`
- 功能：复制文件或目录
- `-r`:递归复制目录下所有文件，要复制目录必须指定
- `-b`当目标文件或目录存在时备份目标文件
- `-n`当目标文件或目录存在时不覆盖
- `-f`当目标文件或目录存在时覆盖，不提示(默认)
- `-i`当目标文件或目录存在时提示用户选择是否覆盖，y是，n否
- `-u`当目标文件或目录存在时，源文件比目标文件新时才覆盖
### touch
`touch`实际上用用来修改文件时间属性的，但更多的用来新建文件。
- 语法形式：`touch [option] [文件]`
- 功能：
  - 改变文件的时间属性
  - 新建文件
### rm
- 语法形式：`rm [option] [文件]`
- 功能：删除文件或目录
  - `-f`强制执行
  - `-r -R --recursive`递归删除目录及目录下文件
  - `-i`删除文件前提示
  - `-v`显示详细信息
### rmdir
- 语法形式：`rm [option] [文件]`
- 功能：删除***空目录***
  - `-p --parents`删除目录及其祖先，如`rmdir -p a/b/c`等价于`rmdir a/b/c a/b a`
### mkdir
- 语法形式：`mkdir [option] [文件]`
- 功能：创建目录
  - `-p`如果目录存在不创建，也不会报错
  - `-m`指定目录权限
```shell
~/code/sh$ mkdir fd1
~/code/sh$ mkdir -m=777 fd2
~/code/sh$ ls -lF
drwxr-xr-x 2 xxx xxx 4096 1月  23 15:06 fd1/
drwxrwxrwx 2 xxx xxx 4096 1月  23 15:06 fd2/
```
### ln
- 语法形式：`ln [option] [原文件] [链接文件]`
- 功能：为文件或目录创建链接
  - `-b`如果链接名存在，备份此文件再覆盖
  - `-f`如果链接名存在强制执行，不提示
  - `-i`如果链接名存在则显示提示信息
  - `-P`硬链接（默认）
  - `-s`符号链接
#### 软链接：
1. 软链接，以路径的形式存在。类似于Windows操作系统中的快捷方式
2. 软链接可以跨文件系统 ，硬链接不可以
3. 软链接可以对一个不存在的文件名进行链接
4. 原文件删除软链接也将失效，此时对软链接进行写操作，原文件会再次出现，但此原文件索引节点已经改变，也就是说此原文件之前的硬链接将不再指向它
5. 软链接可以对目录进行链接
6. 软链接与原文件索引节点不同
#### 硬链接：
1. 硬链接，以文件副本的形式存在。但不占用实际空间。（理解c中指针，和原文件指向同一内存地址）
2. 原文件丢失，不影响硬链接数据访问
3. 不允许给目录创建硬链接（`-d`选项可强制给目录建立硬链接）
4. 硬链接只有在同一个文件系统中才能创建
5. 硬链接与原文件索引节点相同
## 显示信息操作
### cat
- 语法形式：`cat [option] [文件]`
- 功能：打印文件内容到控制台
- `-n`和`-b`输出行号，`-b`会忽略空行
- `-T`将tab以`^I`符号表示
- `-E`行尾显示`$`符号
- `-A`等价于`-vET`
```
$ cat -n 1.txt 
     1  hello
     2
     3  world
$ cat -b 1.txt 
     1  hello

     2  world
$ cat -A 1.file
C$
C.UTF-8$
en_US.utf8$
POSIX$
zh_CN.utf8$
```
### ls
- 语法形式：`ls [option]`
- 功能：列出目录内容
  - `-a --all`列出所有文件或目录，包括`.`和`..`
  - `-A`列出所有文件或目录，不包括`.`和`..`
  - `-l`以一行列表格式显示（显示信息多）
  - `-1`按行显示文件
  - `-m`按列列出文件，文件间用`,`分割
  - `-i --inode`显示文件的索引节点号
  - `-R --recursive`子目录文件也会显示出来
  - `-s --size`显示文件大小
  - `-F`在文件或目录结尾添加指示符(one of */=>@|)
  - 排序选项
    - `-S`按文件大小排序，大->小
    - `-t`按修改时间排序，新->旧
    - `-X`按扩展名字母排序
### locale
- 语法形式：`locale [option]`
- 功能：给出区域特定的信息
  - `-a`显示可用locale信息
  - `locale`显示当前locale信息
```shell
~/code/sh$ locale
LANG=zh_CN.UTF-8
LANGUAGE=zh_CN
LC_CTYPE="zh_CN.UTF-8"
LC_NUMERIC="zh_CN.UTF-8"
LC_TIME="zh_CN.UTF-8"
LC_COLLATE="zh_CN.UTF-8"
LC_MONETARY="zh_CN.UTF-8"
LC_MESSAGES="zh_CN.UTF-8"
LC_PAPER="zh_CN.UTF-8"
LC_NAME="zh_CN.UTF-8"
LC_ADDRESS="zh_CN.UTF-8"
LC_TELEPHONE="zh_CN.UTF-8"
LC_MEASUREMENT="zh_CN.UTF-8"
LC_IDENTIFICATION="zh_CN.UTF-8"
LC_ALL=
~/code/sh$ locale -a
C
C.UTF-8
en_US.utf8
POSIX
zh_CN.utf8
```
### pwd
- 语法形式：`locale [option]`
- 功能：显示当前路径信息
```shell
~/code/sh$ pwd
/home/shuhaiwen/code/sh
```
## Linux命令学习步骤

1. pwd 显示当前所在路径 
2. cd
3. ls  显示指定目录下文件及其属性
4. cp
5. mkdir rmdir
6. cat
7. 