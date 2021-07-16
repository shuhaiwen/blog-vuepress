---
title: Linux命令
date: 2020-05-04
sidebarDepth: 2
tags:
 - Cmd
categories:
 - Linux
---
- [1. Linix 命令](#1-linix-命令)
  - [1.1. 基本操作](#11-基本操作)
    - [1.1.1. 命令连接符`&&`、`||`和`;`](#111-命令连接符和)
    - [1.1.2. 文件重定向符](#112-文件重定向符)
    - [1.1.3. echo](#113-echo)
  - [1.2. 文件修改操作](#12-文件修改操作)
    - [1.2.1. chmod](#121-chmod)
    - [1.2.2. chgrp](#122-chgrp)
    - [1.2.3. chown](#123-chown)
    - [1.2.4. tar](#124-tar)
      - [1.2.4.1. 打包、解包](#1241-打包解包)
      - [1.2.4.2. 解压包](#1242-解压包)
      - [1.2.4.3. 查看压缩包内容](#1243-查看压缩包内容)
      - [1.2.4.4. 附加文件](#1244-附加文件)
    - [1.2.5. mv](#125-mv)
    - [1.2.6. cp](#126-cp)
    - [1.2.7. touch](#127-touch)
    - [1.2.8. rm](#128-rm)
    - [1.2.9. rmdir](#129-rmdir)
    - [1.2.10. mkdir](#1210-mkdir)
    - [1.2.11. ln](#1211-ln)
      - [1.2.11.1. 软链接：](#12111-软链接)
      - [1.2.11.2. 硬链接：](#12112-硬链接)
  - [1.3. 文件查找操作](#13-文件查找操作)
    - [1.3.1. find](#131-find)
    - [1.3.2. file](#132-file)
    - [1.3.3. whereis](#133-whereis)
    - [1.3.4. which](#134-which)
    - [1.3.5. whatis](#135-whatis)
  - [1.4. 文本分析](#14-文本分析)
    - [1.4.1. awk](#141-awk)
    - [1.4.2. sed](#142-sed)
    - [1.4.3. cut](#143-cut)
  - [1.5. 显示信息操作](#15-显示信息操作)
    - [1.5.1. cat](#151-cat)
    - [1.5.2. ls](#152-ls)
    - [1.5.3. locale](#153-locale)
    - [1.5.4. pwd](#154-pwd)
    - [1.5.5. id](#155-id)
  - [1.6. 库相关](#16-库相关)
    - [1.6.1. ldconfig](#161-ldconfig)
    - [1.6.2. ldd](#162-ldd)
    - [1.6.3. nm](#163-nm)
      - [1.6.3.1. 查看.so文件导出函数](#1631-查看so文件导出函数)
  - [1.7. 系统相关](#17-系统相关)
    - [1.7.1. ps](#171-ps)
    - [1.7.2. kill](#172-kill)
    - [1.7.3. uname](#173-uname)
    - [1.7.4. hostname](#174-hostname)
    - [1.7.5. hostid](#175-hostid)
    - [1.7.6. getconf PAGE_SIZE](#176-getconf-page_size)
    - [1.7.7. lsattr](#177-lsattr)
  - [1.8. 远程操作](#18-远程操作)
    - [1.8.1. scp](#181-scp)
    - [1.8.2. ssh-keygen](#182-ssh-keygen)
    - [1.8.3. ssh](#183-ssh)
  - [1.9. 常用功能指令](#19-常用功能指令)
    - [1.9.1. seq](#191-seq)
    - [1.9.2. truncate](#192-truncate)
    - [1.9.3. dd](#193-dd)
    - [1.9.4. shuf](#194-shuf)
    - [1.9.5. xargs](#195-xargs)

# 1. Linix 命令
**以下所有命令都只描述了常用的选项，忽略了很少涉及到的选项**

## 1.1. 基本操作

### 1.1.1. 命令连接符`&&`、`||`和`;`
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

### 1.1.2. 文件重定向符
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

### 1.1.3. echo
- 功能：输出一行文本
- 语法：`echo [option] 文本字符`
  - `-e`:
  - `-n`:不输出末尾换行
- 示例
```shell
$ echo -e "a\nb"
a
b
$ echo  "a\nb"
a\nb
$ echo -n a
$ echo a
a
```

## 1.2. 文件修改操作

### 1.2.1. chmod
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
```shell
$ ls -l
总用量 0
-rw-r--r-- 1 xxx xxx 0 1月   3 13:30 1.md
$ chmod u=x 1.md
$ ls -l
总用量 0
---xr--r-- 1 xxx xxx 0 1月   3 13:30 1.md
总用量 0
```
```shell
$ chmod u+r 1.md
$ ls -l
总用量 0
-r-xr--r-- 1 xxx xxx 0 1月   3 13:30 1.md
```
- `chmod [01234567][file]`
  - 0 无权限
  - 1 `x`权限
  - 2 `w`权限
  - 4 `r`权限
```shell
$ chmod 0544 1.md
$ ls -l
总用量 0
-r-xr--r-- 1 xxx xxx 0 1月   3 13:30 1.md
```

### 1.2.2. chgrp
- 功能:改变文件所属组
- 语法形式:`chgrp [option] group file`
  - `-R`：如果是目录，则会递归到子文件
```shell
~/code/cpp$ ls -l 1.file 
-rw-r--r-- 1 shuhaiwen shuhaiwen 38 1月  23 10:49 1.file
~/code/cpp$ sudo chgrp root 1.file 
~/code/cpp$ ls -l 1.file 
-rw-r--r-- 1 shuhaiwen root 38 1月  23 10:49 1.file
```

### 1.2.3. chown
- 功能:改变文件拥有者或拥有组
- 语法形式:`chown [option] [OWNER][:[GROUP]] file`
  - `-R`：如果是目录，则会递归到子文件

示例1：改变文件拥有者
```shell
~/code/cpp$ ls -l 1.file 
-rw-r--r-- 1 shuhaiwen root 38 1月  23 10:49 1.file
~/code/cpp$ sudo chown root 1.file 
~/code/cpp$ ls -l 1.file 
-rw-r--r-- 1 root root 38 1月  23 10:49 1.file
```
示例2：改变文件拥有者和所属组
```shell
~/code/cpp$ ls -l 1.txt 
-rw-r--r-- 1 shuhaiwen shuhaiwen 0 1月  28 11:06 1.txt
~/code/cpp$ sudo chown root:root 1.txt 
~/code/cpp$ ls -l 1.txt 
-rw-r--r-- 1 root root 0 1月  28 11:06 1.txt

```

### 1.2.4. tar
`tar`本质上只具有打包功能，而不具有解压缩功能，其内部调用`gzip`或其它打包工具才能执行解压缩功能

#### 1.2.4.1. 打包、解包
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

#### 1.2.4.2. 解压包
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

#### 1.2.4.3. 查看压缩包内容
- `-t`查看压缩包内容
```shell
$ tar -cvf 1.tar 1.md
1.md
$ tar -tf 1.tar
1.md
```

#### 1.2.4.4. 附加文件
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

### 1.2.5. mv
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

### 1.2.6. cp
`cp`命令参数和`mv`中很相似,可以参考
- 语法形式：`cp [option] [原文件] [目标文件]`
- 功能：复制文件或目录
- `-r`:递归复制目录下所有文件，要复制目录必须指定
- `-b`当目标文件或目录存在时备份目标文件
- `-n`当目标文件或目录存在时不覆盖
- `-f`当目标文件或目录存在时覆盖，不提示(默认)
- `-i`当目标文件或目录存在时提示用户选择是否覆盖，y是，n否
- `-u`当目标文件或目录存在时，源文件比目标文件新时才覆盖
- 拷贝多个文件示例
```shell
# 拷贝多个文件到同一目录
cp file1 file2 dir
# 拷贝同一目录下文件到另一目录
cp dir1/{file1,file2} dir2
```

### 1.2.7. touch
`touch`实际上用用来修改文件时间属性的，但更多的用来新建文件。
- 语法形式：`touch [option] [文件]`
- 功能：
  - 改变文件的时间属性
  - 新建文件

### 1.2.8. rm
- 语法形式：`rm [option] [文件]`
- 功能：删除文件或目录
  - `-f`强制执行
  - `-r -R --recursive`递归删除目录及目录下文件
  - `-i`删除文件前提示
  - `-v`显示详细信息

### 1.2.9. rmdir
- 语法形式：`rm [option] [文件]`
- 功能：删除***空目录***，不能用来删除非空目录
  - `-p --parents`删除目录及其祖先，如`rmdir -p a/b/c`等价于`rmdir a/b/c a/b a`

### 1.2.10. mkdir
- 语法形式：`mkdir [option] [文件]`
- 功能：创建目录
  - `-p`如果目录存在则不创建，也不会报错
  - `-m`指定目录权限
```shell
~/code/sh$ mkdir fd1
~/code/sh$ mkdir -m=777 fd2
~/code/sh$ ls -lF
drwxr-xr-x 2 xxx xxx 4096 1月  23 15:06 fd1/
drwxrwxrwx 2 xxx xxx 4096 1月  23 15:06 fd2/
```

### 1.2.11. ln
- 语法形式：`ln [option] [原文件] [链接文件]`
- 功能：为文件或目录创建链接
  - `-b`如果链接名存在，备份此文件再覆盖
  - `-f`如果链接名存在强制执行，不提示
  - `-i`如果链接名存在则显示提示信息
  - `-P`硬链接（默认）
  - `-s`符号链接

#### 1.2.11.1. 软链接：
1. 软链接，以路径的形式存在。类似于Windows操作系统中的快捷方式
2. 软链接可以跨文件系统 ，硬链接不可以
3. 软链接可以对一个不存在的文件名进行链接
4. 原文件删除软链接也将失效，此时对软链接进行写操作，原文件会再次出现，但此原文件索引节点已经改变，也就是说此原文件之前的硬链接将不再指向它
5. 软链接可以对目录进行链接
6. 软链接与原文件索引节点不同

#### 1.2.11.2. 硬链接：
1. 硬链接，以文件副本的形式存在。但不占用实际空间。（理解c中指针，和原文件指向同一内存地址）
2. 原文件丢失，不影响硬链接数据访问
3. 不允许给目录创建硬链接（`-d`选项可强制给目录建立硬链接）
4. 硬链接只有在同一个文件系统中才能创建
5. 硬链接与原文件索引节点相同

## 1.3. 文件查找操作

### 1.3.1. find
- 语法形式：`find [path] -name [文件名] [option]`
- 功能：查找指定目录下文件
  - `-name fileName`：指定查找文件名如`find /opt -name 1.txt`,在/opt目录下查找1.txt文件
  - `-iname fileName`:同`-name`但忽略大小写
  - `-type fileType`:指定文件类型
  - `-size [+][-]fileSize`:指定文件大小，+大于，-小于
  - `-exec command {} \;`：查到文件后对文件执行命令，如`find /opt -name 1.txt -exec rm -f {} \;`,查找1.txt并删除
  - `-ok command {} \;`
- 示例
```shell
# 在.dir目录下查找 以file1或file2开头的文件
find ./dir -name "file[1,2]*"
```

### 1.3.2. file
- 语法形式：`file [option] [文件名]`
- 功能：打印文件信息
```shell
~/code/cpp$ file 1.file
1.file: ASCII text
~/code/cpp$ file locale.cpp
locale.cpp: C++ source, ASCII text
```

### 1.3.3. whereis
- 语法形式：`whereis [option] [文件名]`
- 功能：查找二进制文件、源码文件、man手册文件位置，查找路径在$PATH and $MANPATH环境变量
```shell
~/code/cpp$ whereis rm
rm: /usr/bin/rm /usr/share/man/man1/rm.1.gz
~/code/cpp$ whereis gcc
gcc: /usr/bin/gcc /usr/lib/gcc
``` 

### 1.3.4. which
- 语法形式：`which [option] [文件名]`
- 功能：查找可执行文件位置，查找路径在$PATH环境变量
```shell
~/code/cpp$ which rm
/usr/bin/rm
```

### 1.3.5. whatis
- 语法形式：`whatis [option] [命令名]`
- 功能：查询一个命令执行什么功能
```shell
fzbk@fzbk:~$ whatis rm
rm (1)               - remove files or directories
```

## 1.4. 文本分析

### 1.4.1. awk
- 参考[https://zhuanlan.zhihu.com/p/81123584](https://zhuanlan.zhihu.com/p/81123584)
- 语法形式：
  - awk [option] script files
  - awk [option] -f scriptfile files
- 功能：处理文本
  - `-F`:指定分割符（默认每行按空格分割）
  - `-f`:指定脚本文件取代script
- 示例
```shell
# 对test.txt文本每行按空格或TAB分割，打印第1项和第3项的值
awk '{print $1,$3}' test.txt
# 对test.txt文本每行按;分割，打印第1项和第3项的值
awk -F; '{print $1,$3}' test.txt
# -F; 或者-F ';'
awk -F ';' '{print $1,$3}' test.txt
#用awk脚本分析test.txt,test.awk脚本作用与上面中的script一致
awk -f test.awk test.txt
```
- 概念
1. 文件的一行称为 awk 的一个记录
2. 使用特定分隔符分开的单词称为字段

### 1.4.2. sed
- 功能：流文本处理
- 语法：`sed [选项]... {脚本(如果没有其他脚本)} [输入文件]`
  - 选项参数：
    - `-e script`:讲脚本指令添加到已有指令中
    - `-f scriptFile`:指定脚本文件
    - `-n`:不产生结果输出
  - 脚本符号
    - `s/pattern/replacement/flags`:替换字符，flags可选参数
      - `g`：全局匹配，默认只匹配第一次出现
      - `number`：匹配第number次匹配的
- 示例
```shell
$ echo "hello world"|sed "s/hello/hi/"
hi world
$ echo "hello world"|sed -e "s/hello/hi/;s/world/boy/"
hi boy
$ cat sed.script 
s/hello/hi/
s/world/boy/
$ echo "hello world"|sed -f sed.script 
hi boy
```

### 1.4.3. cut

## 1.5. 显示信息操作

### 1.5.1. cat
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

### 1.5.2. ls
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

### 1.5.3. locale
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

### 1.5.4. pwd
- 语法形式：`locale [option]`
- 功能：显示当前路径信息
```shell
~/code/sh$ pwd
/home/shuhaiwen/code/sh
```

### 1.5.5. id
- 语法形式：`id [option] username`
- 功能：查看用户相关信息
```shell
~$ id shuhaiwen
uid=1016(shuhaiwen) gid=1016(shuhaiwen) groups=1016(shuhaiwen)
```

## 1.6. 库相关

### 1.6.1. ldconfig
- 功能：设置运行时期动态链接，通常在向/lib和/usr/lib添加了新动态库后用来更新动态库
```shell
~/code/cpp$ sudo ldconfig
```

### 1.6.2. ldd
- 功能：打印动态库的依赖关系
```shell
shuhaiwen@shuhaiwen:~/code/cpp$ ldd liblocale.so
linux-vdso.so.1 (0x00007ffd5e582000)
libstdc++.so.6 => /lib/x86_64-linux-gnu/libstdc++.so.6 (0x00007f8ffeb07000)
libm.so.6 => /lib/x86_64-linux-gnu/libm.so.6 (0x00007f8ffe984000)
libgcc_s.so.1 => /lib/x86_64-linux-gnu/libgcc_s.so.1 (0x00007f8ffe96a000)
libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f8ffe7a9000)
/lib64/ld-linux-x86-64.so.2 (0x00007f8ffecb5000)
```
::: tip
ldd不是一个可执行程序而是一个shell脚本。
:::

### 1.6.3. nm
- 功能：查看obj文件符号信息
- 语法形式:`nm [option] filename`

#### 1.6.3.1. 查看.so文件导出函数
```shell
nm -D xxx.so | awk '{if($2=="T"){print $3}}'
```

## 1.7. 系统相关

### 1.7.1. ps
- 功能：查看系统进程信息
- 语法形式:`ps [option]`
  - `e`:显示所有进程
  - `-A`:显示所有进程
  - `-f`:显示完整格式列表
  - `-L`:显示进程线程
  - `-H`:以层级显示（显示父进程）
- 示例
```shell
#显示系统所有进程信息
ps -ef
# 
ps -aux
```

### 1.7.2. kill
- 功能：停止指定进程
- 语法形式:`kill PID`
```shell
#停止进程
kill 1201
#显示信号
kill -l
```

### 1.7.3. uname
- 功能：查询系统信息
- 语法形式：`uname [option]`
  - `-a`：打印系统所有信息
  - `-s`：打印内核名（默认）
  - `-m`：打印架构名
  - `-o`：打印操作系统名
  - `-n`：打印网络节点主机名
- 示例
```shell
$ uname 
Linux
$ uname -s
Linux
$ uname -m
x86_64
$ uname -o
GNU/Linux
$ uname -a
Linux web17 3.10.0-327.el7.x86_64 #1 SMP Thu Nov 19 22:10:57 UTC 2015 x86_64 x86_64 x86_64 GNU/Linux
$ uname -n
web17
```

### 1.7.4. hostname
- 功能：is used to display the system's DNS name, and to display or set its hostname or NIS domain name.
```shell
# 显示主机名
hostname
# 修改主机名
hostname newname
# 显示ip
hostname -i
# 显示所有ip
hostname -I
# 显示dns域名
hostname -d
```

### 1.7.5. hostid
- 功能：打印host id
```shell
hostid
```

### 1.7.6. getconf PAGE_SIZE
- 功能：获取系统页大小
- 示例
```shell
# 也大小4KB
$ getconf PAGE_SIZE
4096
```

### 1.7.7. lsattr
- 功能：查看文件扩展属性
- 示例
```shell
lsattr
```

## 1.8. 远程操作

### 1.8.1. scp
- 语法:`scp [option] 源文件 目标路径`
- 功能：主机之间复制文件和目录(类似cp)
  - `-r`:递归复制整个目录
  - `-p`:保留原文件的修改时间，访问时间和访问权限
- 示例:从本地复制到远程
```shell
#将本地用户目录下的test.txt文件复制到远程主机10.10.10.10上用户为user1的目录下
scp ~/test.txt user1@10.10.10.10:/home/user1/
```
- 示例:从远程复制到本地
```shell
scp user1@10.10.10.10:/home/urer1/test.txt /home/user1
```
::: warning
远程语法 `用户名@IP地址:路径`
:::

### 1.8.2. ssh-keygen
- 语法:`ssh-keygen [option]`
- 功能:用于为ssh生成、管理和转换认证密钥，它支持RSA和DSA两种认证密钥
  - `-t [rsa|dsa]`:指定密钥类型rsa(默认)或dsa
  - `-f file`:指定生成密钥的文件名
  - `-b number`:指定密钥长度（最小1024bit）
- 示例
```shell
ssh-keygen -t dsa -f key.file -b 1024
```

### 1.8.3. ssh
- 语法:`ssh 用户名@ip`
- 功能：用于远程登录
- 示例
```shell
ssh shw@192.168.32.32
```

## 1.9. 常用功能指令

### 1.9.1. seq
- 功能：指定首位数字和步长，输出数值
- 语法：`seq [option] [first] [step] last`
  - `-f 分隔符`:指定输出结果间的分割符（默认\n）
- 示例：
```shell
# 指定首数字1，尾数字10，步长2，输出结果被\n分割
$ seq 1 2 10
1
3
5
7
9
```

### 1.9.2. truncate
- 功能：将文件的大小缩小或扩展到指定的大小
- 语法：`truncate [option] file`
  - `-s size`:指定缩小或扩大文件的大小
- 示例
```shell
# 将file1文件大小变成1M
truncate -s 1M file1
```

### 1.9.3. dd
- 功能：用于复制文件并对原文件的内容进行转换和格式化处理
- 语法
  - `if=输入文件`：指定输入文件
  - `of=输出文件`：指定输出文件
  - `bs=n[c,w,b,k,M,G]`：指定块大小(c=1byte,w=2byte,b=512byte,k=1024byte,M=1024KB,G=1024MB)
  - `count=n`：指定被复制块数量
- 示例
```shell
# 输入文件/dev/zero 输出文件outfile 
dd if=/dev/zero of=outfile bs=1k count=1
```

### 1.9.4. shuf
- 功能：生成随机数
- 语法：
  - `-i LO-HI`:指定随机数生成的区间，如1-10，生成大于等于1小于等于10的数
  - `-n number`:生成几行数据
  - `-r`:表示生成的数据可以重复（默认不可以重复），当生成数可用总数小于需要生成数的数量时，需要打开，否则生成不了被-n指定的数据量
- 示例
```shell
# 输出数10，输出范围 1-3 ，数据可重复
$ shuf -n 10 -i 1-3 -r
2
3
2
1
1
1
3
3
3
1
# 输出数10，输出范围 1-3，数据不可重复（仅输出3个，因为数据不可重复）
$ shuf -n 10 -i 1-3
1
3
2
```

### 1.9.5. xargs
- 功能：从命令行标准输出中获取参数传递给命令执行
- 语法：`cmd1 | xargs cmd2`