---
title: Linux命令
date: 2020-05-04
sidebarDepth: 2
tags:
 - Cmd
categories:
 - Linux
---
# Linix 命令
## 常用命令
### 命令连接符`&&`、`||`和`;`
- `&&`连接的多条命令会按顺序执行，直到命令出现错误就停止执行后面命令
- `||`连接的命令直到正确执行了一条命令就会终止后续命令的执行
- `;`连接的命令会按顺序一直执行，不管命令是否有误都不影响后续的命令执行
```cmd
~$: llk && echo "hello"
bash: llk：未找到命令
~$: llk || echo "hello" || echo "world"
bash: llk：未找到命令
hello

~$: llk ; echo "hello"
bash: llk：未找到命令
hello
```
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
~/code/test$ ls -l
总用量 0
-rw-r--r-- 1 shuhaiwen shuhaiwen 0 1月   3 13:30 1.md
~/code/test$ chmod u=x 1.md
~/code/test$ ls -l
总用量 0
---xr--r-- 1 shuhaiwen shuhaiwen 0 1月   3 13:30 1.md
总用量 0
```
```cmd
~/code/test$ chmod u+r 1.md
~/code/test$ ls -l
总用量 0
-r-xr--r-- 1 shuhaiwen shuhaiwen 0 1月   3 13:30 1.md
```
- `chmod [0124567][file]`
  - 0 无权限
  - 1 x权限
  - 2 w权限
  - 4 r权限
```cmd
~/code/test$ chmod 0544 1.md
~/code/test$ ls -l
总用量 0
-r-xr--r-- 1 shuhaiwen shuhaiwen 0 1月   3 13:30 1.md
```
### `tar`
- `tar`分打包解包，再分解压包
#### 打包、解包
- -c或--create 建立新的备份文件
```cmd
~/code/test$ tar -cvf 1.tar 1.md
1.md
~/code/test$ ls
1.md 1.tar
```
```cmd
~/code/test$ ls
1.tar
~/code/test$ tar -xvf 1.tar
1.md
~/code/test$ ls
1.md  1.tar
```
#### 解压包
- -z使用gzip压缩或解压
- -x执行解压
```cmd
~/code/test$ tar -cvzf 1.tar.gz 1.md
1.md
~/code/test$ ls
1.md  1.tar.gz
```
```cmd
~/code/test$ ls 
1.tar.gz
~/code/test$ tar -xzvf 1.tar.gz
1.md
~/code/test$ ls
1.md  1.tar.gz
```
### 查看压缩包内容
- -t查看压缩包内容
```cmd
~/code/test$ tar -cvf 1.tar 1.md
1.md
~/code/test$ tar -tf 1.tar
1.md
```
### 附加文件
- -r或--append 新增文件到已存在的备份文件的结尾部分
```cmd
~/code/test$ tar -cvf 1.tar 1.md
1.md
~/code/test$ tar -tf 1.tar
1.md
~/code/test$ tar -rvf 1.tar 2.md
2.md
~/code/test$ tar -tvf 1.tar
-r-xr--r-- shuhaiwen/shuhaiwen 0 2021-01-03 13:30 1.md
-rw-r--r-- shuhaiwen/shuhaiwen 0 2021-01-03 14:16 2.md
```
## Linux命令学习步骤

1. pwd 显示当前所在路径 
2. cd
3. ls  显示指定目录下文件及其属性
4. cp
5. mkdir rmdir
6. cat
7. 