---
title: GO和C的语法对比
date: 2020-11-27
sidebarDepth: 2
tags:
 - GO和C++的语法对比
categories:
 - GO
---
# GO和C++的语法对比
## 基本常识
### 程序入口main
GO
- 包名为main
- 入口函数为main

C++
- 入口函数为main
  
```GO
//GO代码
package main

func main()  {
	
}
```
```c++
//C++代码
int main(){

}
```
### 语句结尾分号
GO
- 以分号`;`作为语句结尾
- 可不写分号`;`，但以换行区分

C++
- 必须以分号`;`作为语句结尾

```GO
package main

import (
	"fmt"
)

func main()  {
  fmt.Println("hello world!")
  fmt.Println("hello world!");fmt.Println("hello world!")
}
```
```c++
#include<iostream>
int main(){
 std::cout<<"hello world!"<<std::endl;
}
```
### 引用其它文件
GO 
- 使用关键字`import`

C++
- 使用`include`

```GO
package main

import (
	"fmt"
)

func main()  {
  fmt.Println("hello world!")
}
```
```c++
#include<iostream>
int main(){
 std::cout<<"hello world!"<<std::endl;
}
```
## 数据类型
### 变量
- Go中未使用的局部变量会引发编译错误，全局变量不会
- GO通过"var关键字+变量名+类型"声明变量，而C++使用"类型+变量名"
```GO
//GO
var i1 int=2//声明并初始化
var i2 =2//声明并初始化，可以省略类型，编译器会自动识别，类似于c++中auto功能
var i3 int//声明但不初始化
```
```c++
//c++
int i1=2;
int i2;
```
- GO 多个变量一起声明与C++中不同
```GO
//GO
var i1,i2=1,2
```
```c++
int i1=1,i2=2;
```
- GO可以通过运算符`:=`进行变量定义,但只能在函数体中，且会覆盖外层作用域中的同名变量，而c++中没有此运算符
```GO
//GO
package main
import (
	"fmt"
)
var gi=3
func main()  {
	var i int=8
	fmt.Println(&i)
	{
		i:=3
		fmt.Println(&i)
	}
	fmt.Println(&i)

}
//输出
0xc0000160c0
0xc0000160c8
0xc0000160c0
```
### 常量
- GO常量和变量类似，以关键字`const`取代`var`就是声明变量，C++中常量声明也是由关键字`const`声明
- GO和C++中const常量都要声明时初始化，且不能改变
```GO
//GO
const i1 int=1
const i2=2
```
```c++
//c++
const int i1=1;
const auto i2=2;
```
- GO中多个常量一起定义语法与C++中不同
```GO
//GO
const(
	i4,i5 int=3,4
)
const i6,i7=5,6
//i1 i2 i3 分别为 0 1 2，j1 j2 j3 分别为 0*3 1*3 2*6
const(
	i1,ji=iota,iota*3
	i2,j2
	i3,j3
)
```
```c++
//c++
const int i1=1,i2=2;
```
- GO中
### 枚举
- GO中并没有枚举，但可以借助`const`和`iota`来模仿实现个类似功能，而C++通过关键字`enum`来定义枚举类型，且默认自增+1
```GO
//GO
//iota==0,也有自增+1作用
const(
	i1=iota //0
	i2      //1
	i3      //2
	i4=10   //10
	i5      //10
	i6=iota //5 重新自增+1，且计数累计从i1~i5
	i7      //6
	i8=iota*2//7*2
	i9			//8*2
	i10			//9*2
)
```
```c++
//c++
enum {
	i1=0,			//0
	i2,				//1
	i3				//2
}
```
- GO与c++都能指定枚举类型，GO中可以是int  float相关，而c++中是int char bool相关，不能是浮点型
```GO
//GO
const(
	i1 float32=iota 
	i2 int
	i3
)
```
```c++
//c++
enum :int{ //bool char均可
    i1=0,
    i2,
    i3
};
```