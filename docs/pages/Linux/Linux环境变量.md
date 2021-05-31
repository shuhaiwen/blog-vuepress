---
title: Linux环境变量
date: 2021-01-25
sidebarDepth: 2
tags:
 - 环境变量
categories:
 - Linux
---

# Linux环境变量
## PATH
PATH环境变量冒号`:`作用是作为分割符,如`PATH=/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games:/sbin:/usr/sbin`。

**注意：但这并不意味着其它环境变量也是以冒号:来作为分隔符，其它也可以有分号;等等来作为分隔符，只要使用它的能按规则正确解析即可**
### 关于环境变量的指令
- `env`：显示当前系统环境变量
- `export`：导入环境变量（临时，只对当前shell有效）
- `set`：显示shell变量
- `unset`：清除环境变量

### 环境变量文件/etc/profile和~/.profile
- 系统环境变量文件`/etc/profile`
- 用户环境变量文件`~/.profile`

读取设置环境变量方式：
1. 首先读入的是全局环境变量设定档/etc/profile，然后根据其内容读取额外的设定的文档，如/etc/profile.d和/etc/inputrc
2. 然后根据不同使用者帐号，去其家目录读取~/.bash_profile，如果这读取不了就读取~/.bash_login，这个也读取不了才会读取~/.profile，这三个文档设定基本上是一样的, 读取有优先关系.
3. 然后在根据用户帐号读取~/.bashrc

#### 系统变量文件/etc/profile
`/etc/profile`文件中导出了PATH变量
```shell
$ cat /etc/profile
# /etc/profile: system-wide .profile file for the Bourne shell (sh(1))
# and Bourne compatible shells (bash(1), ksh(1), ash(1), ...).

if [ "`id -u`" -eq 0 ]; then
  PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
else
  PATH="/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games:/sbin:/usr/sbin"
fi
export PATH

if [ "$PS1" ]; then
  if [ "$BASH" ] && [ "$BASH" != "/bin/sh" ]; then
    # The file bash.bashrc already sets the default PS1.
    # PS1='\h:\w\$ '
    if [ -f /etc/bash.bashrc ]; then
      . /etc/bash.bashrc
    fi
  else
    if [ "`id -u`" -eq 0 ]; then
      PS1='# '
    else
      PS1='$ '
    fi
  fi
fi

if [ -d /etc/profile.d ]; then
  for i in /etc/profile.d/*.sh; do
    if [ -r $i ]; then
      . $i
    fi
  done
  unset i
fi
tty | egrep -q tty[1-6] && export LC_ALL=C
```
但这个文件也可以导出其它变量，如下例导出自定义变量`HELLO`
```shell
shuhaiwen@shuhaiwen:/etc$ cat /etc/profile
# /etc/profile: system-wide .profile file for the Bourne shell (sh(1))
# and Bourne compatible shells (bash(1), ksh(1), ash(1), ...).

if [ "`id -u`" -eq 0 ]; then
  PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
else
  PATH="/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games:/sbin:/usr/sbin"
fi
export PATH
export HELLO=hello world

# 省略下面部分
...
```
要使新增加的变量生效，使用source命令
```shell
$ source /etc/profile
$ echo $HELLO
hello
```
#### 用户变量文件~/.profile与~/.bashrc
~/.profile可以设定本用户专有的路径，环境变量，等，它只能登入的时候执行一次. ~/.bashrc也是某用户专有设定文档，可以设定路径，命令别名，每次shell script的执行都会使用它一次。

用户变量文件只对当前用户有效，使用和系统变量文件/etc/profile一样。设置后依然需要用`source`命令进行更新
### export临时导入环境变量
使用export向PATH中导入变量hello
```shell
$ export PATH=hello:$PATH
$ echo $PATH
hello:/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games:/sbin:/usr/sbin
```
但这只对当前shell有效，打开另一个bash，再次打印PATH,hello不存在了
```shell
~$ echo $PATH
/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games:/sbin:/usr/sbin
```
### 重要的环境变量统计
- 命令行提示符$PS1
## LD_LIBRARY_PATH
`LD_LIBRARY_PATH`是程序加载动态链接库(.so)文件查找的路径。如果你的程序需要加载非默认加载路径的.so文件时，你必须要将其路径通过`LD_LIBRARY_PATH`导出否则程序会报找不到库错误
