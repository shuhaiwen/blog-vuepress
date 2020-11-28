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
- Go中未使用的变量会引发编译错误
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
