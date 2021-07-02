---
title: MakeFile教程
date: 2021-01-21
sidebarDepth: 2
tags:
 - MakeFile
categories:
 - Linux
---

- [1. MakeFile教程](#1-makefile教程)
  - [1.1. 入门](#11-入门)
    - [1.1.1. 一个简单的makefile示例](#111-一个简单的makefile示例)
  - [1.2. 基础](#12-基础)
    - [1.2.1. Makefile的工作流程](#121-makefile的工作流程)
    - [1.2.2. 伪目标.PHONY](#122-伪目标phony)
    - [1.2.3. @不显示命令](#123-不显示命令)
    - [1.2.4. -忽略命令执行错误](#124--忽略命令执行错误)
    - [1.2.5. 变量](#125-变量)
      - [1.2.5.1. 变量赋值](#1251-变量赋值)
      - [1.2.5.2. 变量的使用](#1252-变量的使用)
      - [1.2.5.3. override 变量](#1253-override-变量)
      - [1.2.5.4. export unexport变量](#1254-export-unexport变量)
      - [1.2.5.5. define 多行变量（仿函数实现方式）](#1255-define-多行变量仿函数实现方式)
      - [1.2.5.6. undefine 取消变量](#1256-undefine-取消变量)
      - [1.2.5.7. `$`和`$$`的使用区别](#1257-和的使用区别)
    - [1.2.6. 自动化变量](#126-自动化变量)
      - [1.2.6.1. 内置变量](#1261-内置变量)
  - [1.3. 进阶](#13-进阶)
    - [1.3.1. VPATH和vpath的使用](#131-vpath和vpath的使用)
      - [1.3.1.1. VPATH](#1311-vpath)
      - [1.3.1.2. vpath](#1312-vpath)
    - [1.3.2. 条件语句](#132-条件语句)
    - [1.3.3. 函数](#133-函数)
      - [1.3.3.1. 函数调用](#1331-函数调用)
      - [1.3.3.2. 自定义函数](#1332-自定义函数)
      - [1.3.3.3. 库函数](#1333-库函数)
    - [1.3.4. include引用其它makefile文件](#134-include引用其它makefile文件)
  - [1.4. make选项](#14-make选项)
    - [1.4.1. 选项-f指定文件](#141-选项-f指定文件)
    - [1.4.2. 选项-s不显示执行输出](#142-选项-s不显示执行输出)
    - [1.4.3. 选项-C指定makefile所在目录](#143-选项-c指定makefile所在目录)
  - [1.5. 参考资料](#15-参考资料)

# 1. MakeFile教程
- Makefile是默认make执行的文本
- make原理本质上是执行一系列shell指令来编译源代码，同时它增加了额外功能，比如：判断是否需要重新编译生成目标文件，或者清理编译产生的中间文件。
- Makefile文本格式如下
  - targets：规则的目标，可以是 Object File（一般称它为中间文件），也可以是可执行文件，还可以是一个标签；
  - prerequisites：是我们的依赖文件，要生成 targets 需要的文件或者是目标。可以是多个，也可以是没有；
  - command：make 需要执行的命令（任意的 shell 命令）。可以有多条命令，每一条命令占一行。
```shell
targets : prerequisites
    command
```
***注意***:其中command前必须要有一个tab，即如下语法会导致错误
```makefile
test:test.c
gcc -o test test.c
```
执行make，报错如下
```shell
~/code/makefile$ make
makefile:2: *** 遗漏分隔符 (null)。 停止。
```
正确语法如下
```makefile
test:test.c
    gcc -o test test.c
```

## 1.1. 入门

### 1.1.1. 一个简单的makefile示例
使用make编译c++源码，目录结构如下
```shell
~/code/makefile$ tree
.
├── makefile
└── src
    ├── include
    │   ├── math.cpp
    │   └── math.h
    └── main.cpp
```
其中makefile文件内容如下,第一行main是最终生成的目标文件，是一个可执行文件，倒数2行是用来清理中间文件的;
```makefile
main:main.o math.o
        g++ main.o math.o -o math
main.o:src/main.cpp src/include/math.h
        g++ -c src/main.cpp -o main.o
math.o:src/include/math.cpp src/include/math.h
        g++ -c src/include/math.cpp -o math.o
clean:
        rm -rf *.o
```
使用make来构建生成目标文件，make也可以指定makefile文件名,指令如`make -f filename`
```shell
~/code/makefile$ make
g++ -c src/main.cpp -o main.o
g++ -c src/include/math.cpp -o math.o
g++ main.o math.o -o math
~/code/makefile$ ls
main.o  makefile  math  math.o  src
```
指定make的执行目标，如使用make clean命令删除中间文件
```shell
~/code/makefile$ make clean
rm -rf *.o
~/code/makefile$ ls
makefile  math  src
```

## 1.2. 基础

### 1.2.1. Makefile的工作流程
假设一个makefile文件内容如下
```makefile
main:main.o math.o
        g++ main.o math.o -o math
main.o:src/main.cpp src/include/math.h
        g++ -c src/main.cpp -o main.o
math.o:src/include/math.cpp src/include/math.h
        g++ -c src/include/math.cpp -o math.o
clean:
        rm -rf *.o
```
在执行make命令时，主要做如下操作
</br>
1. 查找目录下makefile文件，将第一行指定的目标作为最终生成的目标，然后去查找它的依赖文件main.o和math.o，通过比较main和main.o和math.o修改时间顺序来决定是否需要执行后面的命令。
2. 如果目标的依赖不存在，则会去找依赖文件是否作为另一个目标，比如，main的依赖main.o不存在，则查找main.o作为目标的那一行，即第3行`main.o:src/main.cpp src/include/math.h`,然后又去查找main.o的依赖是否存在，以此类推。
3. 当main的依赖都存在后执行main的命令`g++ main.o math.o -o math`,产生main可执行程序

### 1.2.2. 伪目标.PHONY
- 功能：伪目标关联的命令总是被执行
- 语法：`.PHONY: target1 target2 ...`
- 示例
```makefile
.PHONY:clean
clean:
	rm -rf *.o
```
- 解释：伪目标的作用是，伪目标后的命令总是会被执行;因为makefile规则中是否去执行一条命令是需要根据依赖的文件是否比目标文件新特征来决定的，假设上例makefile文件所在目录下存在clean文件，而目标clean并没有依赖，也就说明目标永远比依赖新，所以当没有指定clean是伪目标时，clean将永远不会执行。

### 1.2.3. @不显示命令
假设makefile文件如下：
```makefile
.PHONY:clean
clean:
	rm -rf *.o
```
当执行一条命令时，控制台会打印当前执行的命令，如下
```shell
~/code/makefile$ make clean
rm -rf *.o
```
而当我们给命令前增加`@`符号时，makefile如下：
```makefile
.PHONY:clean
clean:
	@rm -rf *.o
```
执行clean，命令不会打印出来
```shell
~/code/makefile$ make clean
```

### 1.2.4. -忽略命令执行错误
比如当我们执行mkdir创建目录时，如果已经存在目录，那么执行mkdir时会出错，但这并不应该导致make执行失败，因此`-`用来处理这类情况。
```makefile
.PHONY:clean
clean:
	-rm -rf *.o
```
上面这条rm指令不管失败还是成功，并不会影响make继续执行

### 1.2.5. 变量

#### 1.2.5.1. 变量赋值
变量的赋值有4种符号，如下
- 简单赋值 `:=` 编程语言中常规理解的赋值方式，只对当前语句的变量有效。
- 递归赋值 `=`赋值语句可能影响多个变量，所有目标变量相关的其他变量都受影响。
- 条件赋值 `?=` 如果变量未定义，则使用符号中的值定义变量。如果该变量已经赋值，则该赋值语句无效。
- 追加赋值 `+=`原变量用空格隔开的方式追加一个新值。

其中`=`允许等号右边的变量在后面出现，且赋值像C++中引用赋值一样，而`:=`赋值就像C++中的复制赋值；
- `:=`赋值
```makefile
x:=foo
y:=$(x)b
x:=new
test：
      @echo "y=>$(y)"
      @echo "x=>$(x)"
```
结果：
```
y=>foob
x=>new
```
- `=`赋值
```makefile
x=foo
y=$(x)b
x=new
test：
      @echo "y=>$(y)"
      @echo "x=>$(x)"
```
结果：
```
y=>newb
x=>new
```

#### 1.2.5.2. 变量的使用
变量使用可以用3种语法,相较于shell，make中可以使用`$(VAR)`格式
- `$VAR`
- `$(VAR)`
- `${VAR}`

#### 1.2.5.3. override 变量
- 功能：当在执行make时，变量赋值在命令行参数中设置，此时这个变量再次在makefile文件中被重新赋值不会覆盖命令行设置的变量值，除非在makefile文件中给变量增加override指示符。
- 示例:
1. make命令行
```shell
# make 命令行指令,变量赋值被单引号包裹
make print 'VAR1=hello'
```
2. makefile文件
```makefile
# makefile 文件部分内容
override VAR1=world
print:
  echo $(VAR1)
```
3. 执行结果,设置override后VAR1被makefile重新赋值了，如果没有override，输出结果会是hello
```shell
$ make print 'VAR1=hello'
echo world
world
```

#### 1.2.5.4. export unexport变量
- 功能：
  - `export`:导出变量使子makefile中能够使用
  - `unexport`:取消导出指定变量
- 示例：假设当前目录下有子目录subdir，且subdir中有makefile文件
```makefile
# 父makefile ,-C 指定目录
export VAR1=hello
build:
  $(MAKE) -C subdir
# 子makefile,可以使用VAR1变量
build:
  echo $(VAR1)
```

#### 1.2.5.5. define 多行变量（仿函数实现方式）
- 功能：定义多行变量，自定义函数的实现方式
- 示例
```makefile
define printparam
	@echo "param is"
	@echo $1
endef
.PHONY: print
print:
	$(call printparam , hello)
```
- 执行结果
```shell
$ make print
param is
hello
```

#### 1.2.5.6. undefine 取消变量
- 功能：使之前定义的变量不再生效
- 示例
```makefile
VAR=123
undefine VAR
```

#### 1.2.5.7. `$`和`$$`的使用区别
`$(variable)`用在makefile变量，而`$$(variable)`用在shell变量中
- 示例
```makefile
var1=hello
test:
  echo $var1
  var2=2;echo $$var2
```
::: info 为什么使用$$
因为在makefile文件中`$`具有特殊函数字符，当我们需要`$`这个字符时，需要通过`$$`来达到转义作用，类似c语言中转义字符`\`。
:::

### 1.2.6. 自动化变量
- `$@`:表示目标文件名
- `$<`:表示依赖的第一个文件名
- `$^`:表示所有依赖文件(每一个文件名之间用空格分隔)，会去除重复文件名
- `$+`:与`$^`类似，但会保留重复文件名

```makefile
main:main.o math.o
	g++ $^ -o $@
main.o:main.cpp math.h
	g++ -c $< -o main.o
```
上面示例中，`$^`指的是`main.o math.o`,`$@`指的是`main`,`$<`指`main.cpp`

#### 1.2.6.1. 内置变量
1. `SHELL`:一般是`/bin/sh`
2. 
## 1.3. 进阶

### 1.3.1. VPATH和vpath的使用
在使用VPATH或vpath时，命令中指定的源文件名不能显示指定而需要通过自动化变量来指定，如`$@`或`$^`或`$<`等等取代真实文件名如`math.cpp`

#### 1.3.1.1. VPATH
`VPATH`用来指定文件的搜索路径
- 语法形式：路径之间可以用`:`分割，也可以用空格分割
  - `VPATH=dir1:dir2`
  - `VPATH=dir1 dir2`
</br>
假设源文件结构层次如下
</br>
```shell
~/code/makefile$ tree
.
├── makefile
└── src
    ├── include
    │   ├── math.cpp
    │   └── math.h
    └── main.cpp
```
多个文件分布在不同目录下，如果不使用`VPATH`则需要编写如下的makefile，需要给源文件指定路径
```makefile
main:main.o math.o
	g++ main.o math.o -o math
main.o:src/main.cpp src/include/math.h
	g++ -c src/main.cpp -o main.o
math.o:src/include/math.cpp src/include/math.h
	g++ -c src/include/math.cpp -o math.o
clean:
	rm -rf *.o
```
如果使用`VPATH`，执行make指令会先在当前目录下查，没找到就会按顺讯去指定的目录下查找文件，当我们写makefile文件时就可以忽略路径信息
```makefile
VPATH=src:src/include
main:main.o math.o
	g++ $^ -o math
main.o:main.cpp math.h
	g++ -c $< -o main.o
math.o:math.cpp math.h
	g++ -c $< -o math.o
clean:
	rm -rf *.o
```

#### 1.3.1.2. vpath
- 语法形式
  1. `vpath PATTERN DIRECTORIES`:在DIRECTORIES下查找PATTERN
  2. `vpath PATTERN`：清除PATTERN搜索路径，使其不再使用方式1中定义的搜索路径
  3. `vpath`：清除所有搜索路径，使方式1中定义的搜索路径失效

其中PATTERN指待寻找文件(可由通配符组合)，DIRECTORIES指查找路径
</br>
假设源文件结构层次如下
```shell
~/code/makefile$ tree
.
├── makefile
└── src
    ├── include
    │   ├── math.cpp
    │   └── math.h
    └── main.cpp
```
使用vpath格式写的makefile内容如下
```makefile
vpath math.% src/include
vpath main.cpp src
main:main.o math.o
	g++ $^ -o math
main.o:main.cpp math.h
	g++ -c $< -o main.o
math.o:math.cpp math.h
	g++ -c $< -o math.o
clean:
	rm -rf *.o
```
其中`vpath math.% src/include`指定以`math.`开头的文件在`src/include`目录下查找，百分号符`%`表示匹配任意字符且不限长度，`vpath main.cpp src`则表明`math.cpp`文件在`src`目录下查找

### 1.3.2. 条件语句
- 语法形式
```makefile
ifeq 条件
...
else
...
endif
```
- 示例
```makefile
libs_for_gcc = -lgnu
normal_libs =

foo: $(objects)
ifeq ($(CC),gcc)
    $(CC) -o foo $(objects) $(libs_for_gcc)
else
    $(CC) -o foo $(objects) $(normal_libs)
endif
```
make规则中有4个用条件判断的关键字
|  关键字  | 解释         | 语法规则                                                                                                            |
| :------: | ------------ | ------------------------------------------------------------------------------------------------------------------- |
|  `ifeq`  | 判断是否相等 | `ifeq (ARG1, ARG2)` or `ifeq 'ARG1' 'ARG2'` or `ifeq "ARG1" "ARG2"` or `ifeq "ARG1" 'ARG2'` or `ifeq 'ARG1' "ARG2"` |
| `ifneq`  | 判断是否相等 | 同`ifeq`                                                                                                            |
| `ifdef`  | 判断是否有值 | `ifdef VARIABLE-NAME`                                                                                               |
| `ifndef` | 判断是否有值 | 同`ifndef`                                                                                                          |

### 1.3.3. 函数
makefile有系统提供的库函数，却本质上不支持自定义函数，但可以使用`define`定义具有类似函数特性的多行变量。

#### 1.3.3.1. 函数调用
- 函数调用语法形式
  - `$(<function> <arguments>)`
  - `${<function> <arguments>}`
```makefile
OBJ=$(subst ee,EE,feet on the street)
all:
    @echo $(OBJ)
```
上例中表示将`feet on the street`字符串中`ee`字符串替换为`EE`，echo输出结果为`fEEt on the strEEt`。

#### 1.3.3.2. 自定义函数
使用`define`定义多行变量，具有函数特性，但与库函数调用还是有区别的，相比
```makefile
define func1
    @echo "My name is $(0)"
endef
var := $(call func1)
```

#### 1.3.3.3. 库函数
详见[参考资料](#参考资料)

### 1.3.4. include引用其它makefile文件
- 语法形式：`include filenames...`
  - `-include`:在`include`前加上符号`-`会忽略不存在的make文件，而不报错
- 示例
```shell
# 包含sub.make文件
include sub1.make sub2.make
```

## 1.4. make选项

### 1.4.1. 选项-f指定文件
- 功能：指定make执行的文件
- 示例：`make -f make1`

### 1.4.2. 选项-s不显示执行输出
- 功能：执行make后不显示执行结果输出
- 示例：`make -s`

### 1.4.3. 选项-C指定makefile所在目录
- 功能：指定执行make的makefile所在目录
- 示例：`make -C dir`

## 1.5. 参考资料
- https://blog.csdn.net/weixin_38391755/article/details/80380786
- http://c.biancheng.net/view/7139.html