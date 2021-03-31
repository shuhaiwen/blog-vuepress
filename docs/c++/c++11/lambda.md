---
title: lambda
date: 2021-03-31
sidebarDepth: 2
tags:
 - lambda
categories:
 - C++11
---
# lambda
lambda由4部分组成，如下：
- `[]`捕获列表
- `()`参数列表
- `->`返回值类型
- `{}`函数体
  
示例代码
```cpp
int x=0,y=0;
auto f = [x,&y](const std::string&str)->int{...};
```
## 语法形式
```
[capture list] (parameter list) -> return type
{
   function body;
};
```
## 捕获列表[ ]
- 作用：引入外部变量供lambda函数中使用
  - [=]:by value 只读数据，不能修改
  - [&]:by reference 可以修改数据
  - [x,&y] 指定lambda函数内能使用的变量 x by value，y by reference 
  - [=,&y] 指定y by reference 传进来，其它以by value传进来
::: warning 
注：[&y,=] ->不能这样
:::
## 参数列表( )
- 有参时，如`[ ](char c){...};`
- 无参情况可以不写，也可以写`()`,如`[ ](){...};`或`[ ]{...};`
    
## 返回类型->
- 有返回值时，如`[ ]()->int{...};`
- 无返回值时 ，可不写,如`[ ](){...};`或`[ ]()->void{...};`   
## 示例
```cpp
#include <iostream>
#include <string>
int main()
{
    int x = 1;
    int y = 1;
    auto f = [x,&y](const std::string&str)->int{
    std::cout << "执行lambda" << std::endl;
    std::cout << str << std::endl;
   // x++;  //by value不可修改
    y++;    //by reference 可修改
    return 1;
    };
    std::cout << "还未调用lambda" << std::endl << std::endl; 
    std::cout << f("你好")<<std::endl;
    std::cin.get();
}
```
