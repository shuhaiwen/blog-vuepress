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
    - [chmod](#chmod)
    - [tar](#tar)
      - [打包、解包](#打包解包)
      - [解压包](#解压包)
      - [查看压缩包内容](#查看压缩包内容)
      - [附加文件](#附加文件)
    - [cat](#cat)
    - [mv](#mv)
    - [cp](#cp)
    - [touch](#touch)
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
## 常用命令
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
### cat
- 功能：打印文件内容到控制台
- `-n`和`-b`输出行号，`-b`会忽略空行
```
$ cat -n 1.txt 
     1  hello
     2
     3  world
$ cat -b 1.txt 
     1  hello

     2  world
```
- `-T`将tab以`^I`符号表示
### mv
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
- 功能：复制文件或目录
- `-r`:递归复制目录下所有文件，要复制目录必须指定
- `-b`当目标文件或目录存在时备份目标文件
- `-n`当目标文件或目录存在时不覆盖
- `-f`当目标文件或目录存在时覆盖，不提示(默认)
- `-i`当目标文件或目录存在时提示用户选择是否覆盖，y是，n否
- `-u`当目标文件或目录存在时，源文件比目标文件新时才覆盖
### touch
`touch`实际上用用来修改文件时间属性的，但更多的用来新建文件。
- 功能：
  - 改变文件的时间属性
  - 新建文件
## Linux命令学习步骤

1. pwd 显示当前所在路径 
2. cd
3. ls  显示指定目录下文件及其属性
4. cp
5. mkdir rmdir
6. cat
7. 