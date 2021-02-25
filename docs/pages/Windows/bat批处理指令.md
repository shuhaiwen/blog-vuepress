---
title: bat批处理指令
date: 2020-05-21
sidebarDepth: 2
tags:
 - Bat
 - Cmd
categories:
 - Windows
---
# bat批处理指令
- dir 　　　列文件名 
- cd　　　　改变当前目录 
- ren 　　　改变文件名 
- copy　　　拷贝文件 
- del 　　　删除文件 
- md　　　　建立子目录 
- rd　　　　删除目录 
- deltree　 删除目录树 
- format　　格式化磁盘 
- edit　　　文本编辑 
- type　　　显示文件内容 
- mem 　　　查看内存状况 
----------
*以下是新增加的命令* 
- help　　　显示帮助提示 
- cls 　　　清屏 
- move　　　移动文件，改目录名 
- more　　　分屏显示 
- xcopy 　　拷贝目录和文件 

## 修改执行批处理工作路径
- 问题场景：当通过外部程序调用（如c++）调用bat时，此程序exe所在路径会成为bat执行时工作路径，而我们需要的bat执行时工作路径是bat所在文件
- 处理方法：在bat文件中增加基础路径设置信息
- 原bat文件
```shell
dir > test.txt
```
- 修改后bat文件
```shell
set base_dir=%~dp0  
%base_dir:~0,2%  
pushd %base_dir%  
dir > test.txt
popd  
```