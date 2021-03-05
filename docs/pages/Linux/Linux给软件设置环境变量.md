---
title: Linux给软件设置环境变量
date: 2020-09-25
sidebarDepth: 2
tags:
 - 环境变量
categories:
 - Linux
---

# Linux给软件设置环境变量
1. 打开环境变量配置文件
```shellsession
sudo vim /etc/profile
```
2. 新增环境变量
```shellsession
# 在 export PATH 下一行新增如下命令,(假设将vscode可执行文件路径设为环境变量)
export VSCODE=/opt/apps/com.visualstudio.code/files/share/code/bin
export PATH=$PATH:$VSCODE
# /opt/apps/com.visualstudio.code/files/share/code/bin是vscode可执行文件路径
```
3. 更新配置文件
```shellsession
source /etc/profile
```
4. 直接使用命令打开软件
```shellsession
# code是/opt/apps/com.visualstudio.code/files/share/code/bin路径下的可执行文件名
code .
```