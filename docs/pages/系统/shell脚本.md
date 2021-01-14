---
title: shell脚本
date: 2021-01-12
sidebarDepth: 2
tags:
 - shell脚本
categories:
 - Linux
---
- [shell脚本](#shell脚本)
  - [set参数设置](#set参数设置)
  - [变量和常量](#变量和常量)
    - [局部变量](#局部变量)
    - [变量替换](#变量替换)
    - [特殊变量($$ $1 $* $@ $@ $n)](#特殊变量-1----n)
  - [读取命令结果](#读取命令结果)
  - [运算符](#运算符)
    - [算术运算符](#算术运算符)
    - [关系运算符](#关系运算符)
  - [字符串操作](#字符串操作)
  - [数组](#数组)
  - [条件语句](#条件语句)
    - [if条件语句](#if条件语句)
    - [case条件语句](#case条件语句)
  - [循环](#循环)
    - [for 循环](#for-循环)
    - [for in循环](#for-in循环)
    - [while循环](#while循环)
    - [until循环](#until循环)
  - [break和continue](#break和continue)
    - [break](#break)
    - [continue](#continue)
  - [函数](#函数)
  - [包含其它shell文件](#包含其它shell文件)
# shell脚本
## set参数设置
- `set -u`：如果有不存在的变量，打印错误信息，并退出
- `set -x`：在执行命令前，打印执行的命令
- `set -e`：如果命令执行错误，打印错误信息，并退出（不适合管道）
- `set -o pipefail`：对`set -e`的补充，管道命令执行错误，打印报错信息，并退出

以上命令可以整合一起写，如`set -uxe`
## 变量和常量
命名规范：常量全大写，变量小写
- 常量：`readonly`+变量名
- 删除变量：`unset`+常量名（不能删除常量）
- 读变量：
  - ${变量名}
  - $变量名
- 修改变量值：变量名=变量新值
```sh
#!/bin/bash
# 变量

str="hello world!"
echo ${str}

# 常量
readonly IVALUE=10
echo "常量"${IVALUE}

# 取消变量
unset str
echo ${str}
```
### 局部变量
- 局部变量用`local`标识，一般用于函数
```sh
hello() {
  local str="hello"
  echo $str
}
hello
echo "\$str=$str"
```
### 变量替换
- `${var:-word}` 如果变量 var 为空或已被删除(unset)，那么返回 word，但不改变 var的值。
- `${var:=word}` 如果变量 var 为空或已被删除(unset)，那么返回 word，并将 var 的值设置为 word。
- `${var:?message}`	如果变量 var 为空或已被删除(unset)，那么将消息 message 送到标准错误输出，可以用来检测变量 var 是否可以被正常赋值。若此替换出现在Shell脚本中，那么脚本将停止运行。
- `${var:+word}` 如果变量 var 被定义，那么返回 word，但不改变 var 的值。
### 特殊变量($$ $1 $* $@ $@ $n)
```sh
#!/bin/bash
# 特殊变量
echo "\$0脚本名 "$0
echo "\$$脚本进程ID "$$
echo "\$n脚本第n个参数,\$1脚本第一个参数 "$1
echo "\$#脚本参数个数"$#
echo "\$*脚本所有参数 "$*
echo "\$@脚本所有参数 "$@
echo "\$?上一个脚本执行结果"$?
```
**当`$*`被双引号包裹时，将是一个整体，这时与`$@`有点不同**
```sh
#!/bin/bash
# test.sh
for val in "$@"
do
  echo val
done
for val in "$*"
do
  echo val
done
```
执行脚本结果如下`$*`被当成一个整体被输出
```sh
$ ./test.sh 1 2 3 4 5
1
2
3
4
5
1 2 3 4 5
```
## 读取命令结果
- $(命令)
- \`命令\`
```sh
echo $(cat 1.txt)
str=`cat 1.txt`
echo ${str}
```
## 运算符
### 算术运算符
- 整形计算：利用`((表达式))`语法计算，或者使用linux上安装的可执行计算文件，如`expr`
- 浮点运算：使用`bc`计算
  - `scale`指定精度，如`scale=6`,代表保留小数点后6位
```sh
#!/bin/bash
#算术运算

##整形运算
a=$((1 + 2))
((b = 1 + 2))
echo "a=\$((1+2)),a=$a"
echo "((b=1+2))=$b"

##浮点型运算 使用echo+管道给bc传表达式
echo "scale=6;3.12*4.65/3" | bc
a=$(echo "scale=6;3.12*4.65/3" | bc)
echo $a
```
### 关系运算符
- 使用`[]`或`[[]]`（`[]`即test指令的符号表示，`[[]]`是`[]`的加强版）
  - 表达式与`[]`之间要空格隔开
  - 比较符如`-lt -ge`需要与比较数用空格隔开
  - `[]`也可以测试文件属性，具体请看`test`文档
```sh
#!/bin/bash
#关系运算

##整形数值比较
a=1
b=3
if [ $a -lt $b ]; then
  echo "$a<$b=true"
else
  echo "$a<$b=false"
fi
##字符串比较
str1="hello"
str2="world"
if [ $str1 != $str2 ]; then
  echo "$str1!=$str2=true"
else
  echo "$str1!=$str2=false"
fi
## bool运算符-a且，-o或，!非
if [ $a -lt $b -a $str1 != $str2 ]; then
  echo "$a -lt $b -a $str1 != $str2 条件全真"
else
  echo "非全真"
fi
```
## 字符串操作
- `${#str}`和`${str:1:3}`分别求字符串长度和截取字符串子串
- `test`也可以操作字符串，功能更多
```sh
#!/bin/bash
#字符串操作

str="hello"
echo "${str}长度=${#str}"
echo "${str}从索引1开始3字符串=${str:1:3}"
echo "${str}从索引1开始子串=${str:1}"
```
## 数组
*数组索引从0开始*
- 数组赋值
  - `array=(val1 val2  ... valn)`
  - `array[0]=val1;array[1]=val2;...;array[n-1]=valn`
  - 注意事项：数组值之间用空格隔开
- 数组大小
  - `${#array[@]}`
  - `${#array[*]}`
- 数组全部数据
  - `${array[@]}`
  - `${array[*]}`
- 某一索引数据
  - `${array[0]}`
```sh
#!/bin/bash
set -xeu
# 数组

array1=(1 2 3 4 5)
echo ${#array1[@]}
echo "${array1[3]}"
echo "${array1[*]}"
echo "${array1[@]}"

array2=(
  1
  2
  3
  4
  5
)
array3[0]=1
array3[3]=4
array3[4]=5
echo "${#array3[*]}"
echo "${array3[0]}"
echo "${array3[1]}"
```
## 条件语句
### if条件语句
- `if...then...elif...then...else...fi`,其中`if`和`elif`语句块由`then`引导
```sh
#!/bin/bash

str="hello"
if [[ -z $str ]]; then
  echo "$str为空"
elif [[ $str = "hello" ]]; then
  echo "${str}=hello"
else
  echo "$str非空"
fi
```
### case条件语句
- `case...in...esac`
- `case`由`esac`结尾（case反序）
- 每一个条件的语句块`;;`结束
```sh
#!/bin/bash

printf "请输入数字1—4\n"
# -e 开启转义
echo -e '你输入的数字是:\c'
read -r NUMBER

case $NUMBER in
1)
  echo "你输入的数字是1"
  ;;
2)
  echo "你输入的数字是2"
  ;;
3)
  echo "你输入的数字是3"
  ;;
4)
  echo "你输入的数字是4"
  ;;
*)
  echo "请输入正确数字，你输入的是$NUMBER"
  ;;
esac
```
## 循环
- `break`:跳出整个循环体（参考c，java等语言）
- `continue`:跳出当前循环，继续下一循环（参考c，java等语言）
### for 循环
- `for ((i = 0; i < 10; i++));do ... done`
```sh
#!/bin/bash

array=(
  1
  2
  3
  4
  5
)
for ((i = 0; i < ${#array[*]}; i++)); do
  echo "${array[i]}"
done
```
### for in循环
- `for ... in ... do ... done`
```sh
#!/bin/bash

array=(
  1
  2
  3
  4
  5
)
echo "循环数组"
for i in ${array[*]}; do
  echo "$i"
done
for i in 1 2 3 4 5; do
  echo "$i"
done
echo "打印当前路径下文件名"
i=0
for fl in ./*; do
  echo "文件$((++i))$fl"
done
if [[ $# -gt 0 ]]; then
  echo "你输入参数如下："
  for i in "$@"; do
    echo "$i"
  done
else
  echo "你没有输入任意参数"
fi
```
### while循环
- `while command do ... done`，与c中`while`一样，当条件假时退出循环
```sh
#!/bin/bash

echo -e "请输入任意整形值，输入0结束:\c"

while read -r NUM; do
  echo "你输入了$NUM"
  if [ $NUM -eq 0 ]; then
    echo "退出shell"
    #或者exit 0
    break
  fi
done
```
### until循环
- `until command do ... done`,与c中`do while`一样,当条件真时退出循环
```sh
#!/bin/bash

a=0
b=4
until [ $((++a)) -gt $b ]; do
  echo "$a <= $b"
done
```
## break和continue
- `break`和`continue`不同于c语言，可以指定跳出那一层循环，**其中`continue n+1`等价于`break n`,跳出第n层循环**。（n的含义是从当前循环层从里往外数，第几层，当前层为1）
### break
- `break n`：跳出第n层循环，如空3层循环，2表示跳出第2层循环，3表示跳出最外层循环，1表示跳出当前层循环，默认n就是1
```sh
#!/bin/bash

#跳出循环break
for i in 0 1 2; do
  if [ $i -gt 1 ]; then
    break
  else
    echo $i
  fi
done
#跳出任意层循环 break n
for z in 0 1 2; do
  for i in 0 1 2; do
    for j in 0 1 2 3 4; do
      if [ $i -eq 1 ] && [ $j -eq 3 ]; then
        break 2
      else
        echo "$z $i $j"
      fi
    done
  done
done
```
### continue
- `continue`:从此循环体中断，继续下一循环，类似c
- `continue n`:继续到第n层循环，类似break （n-1；n>1）
```sh
#!/bin/bash

#继续下一循环
for i in 0 1 2; do
  if [ $i -eq 1 ]; then
    continue
  else
    echo $i
  fi
done
#继续到任意层循环 continue n
for z in 0 1 2 3 4; do
  for i in 0 1 2 3 4; do
    for j in 0 1 2 3 4; do
      if [ $z -eq $i ] && [ $i -eq $j ]; then
        echo "$z $i $j全等继续最外层循环"
        continue 3
      else
        echo "$z $i $j"
      fi
    done
  done
done
```
## 函数
- 函数`()`中不能有形参，但函数内部可通过`$1 $2 ... $9 ${10} ... ${n}`获取参数,**当参数多余10个时，参数要由`${n}`而不是`$n`获取**
- 调用函数不需要带`()`，传参接着函数名后写，如:`fun_name 1 2 "3"`,表示调用函数fun_name并且传给函数3个参数
- 函数中也能使用`return`,但只能返回整形数值，如:`return 2`,能不能`return "2"`
- `function`标识可有可无，如`function add(){}`等价于`add(){}`
```sh
#!/bin/bash

add() {
  #计算参数总和
  all=0
  for i in "$@"; do
    all=$((all + i))
  done
  return $all
}
add 1 2 3 4
#$?获取上一指令结果，此处为add函数返回值
echo "函数add 1 2 3 4返回值:$?"
```
## 包含其它shell文件
**包含文件类似与c语言中的include，可以将外部脚本合并到当前脚本文件中**
- 方式一:`. file.sh`,其中`.`与文件名间有一空格
- 方式二:`source file.sh`
```sh
#!/bin/bash

# shellcheck disable=SC1091
. ./str.sh
# 使用str.sh中定义的str
echo "$str"
source ./function.sh

```