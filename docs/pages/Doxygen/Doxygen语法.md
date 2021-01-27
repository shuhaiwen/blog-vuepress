---
title: Doxygen语法
date: 2021-01-27
sidebarDepth: 2
tags:
 - Doxygen语法
categories:
 - Doxygen
---
- [Doxygen语法](#doxygen语法)
  - [注释块格式](#注释块格式)
    - [单行注释](#单行注释)
    - [块注释](#块注释)
    - [注释在源码之后](#注释在源码之后)
  - [特殊指令](#特殊指令)
    - [文档头注释](#文档头注释)
    - [函数相关指令](#函数相关指令)
    - [其它特殊指令](#其它特殊指令)
    - [标注类，函数，枚举等指令](#标注类函数枚举等指令)
  - [问题汇总](#问题汇总)
# Doxygen语法
doxygen是一种可以对源码注释进行提取，生成文档的工具。doxygen定义了一套注释标准，只要按照这套标准进行注释，就能正确导出文档，支持的文档格式有html，latex；支持的语言有c，c++，java，python等等主流语言。以下是一简短注释示例
```cpp
/**
 * @brief 2个整形数据相加
 * 
 * @param x 输入参数1
 * @param[in] y 输入参数2
 * @return int 
 */
int add(int x, int y)
{
  return x + y;
}
```
## 注释块格式
考虑到有些注释不需要导出，为了区分那些需要导出那些不需要导出，doxygen再原先注释块规则上加上额外标志用于区分。
### 单行注释
标准注释用双斜杠`//`作为单行注释,doxygen使用3斜杠`///`或用双斜杠加1个感叹号`//!`。
- 标准注释如下
```cpp
//全局变量i
int i=2;
```
- doxygen注释如下
```cpp
//!全局变量i
int i=2;
///全局变量j
int j=2;
```
### 块注释
标准快注释是`/*注释*/`包裹，而doxygen依然提供2种方式，`/**注释*/`或`/*!注释*/`，与标准注释相比多了一个`*`或`!`。
- 标准注释如下
```cpp
/*
 * @brief 2个整形数据相加
 * 
 * @param x 输入参数1
 * @param[in] y 输入参数2
 * @return int 
 */
int add(int x, int y)
{
  return x + y;
}
```
- doxygen注释如下
```cpp
/**
 * @brief 2个整形数据相加
 * 
 * @param x 输入参数1
 * @param[in] y 输入参数2
 * @return int 
 */
int add(int x, int y)
{
  return x + y;
}
```
或者
```cpp
/*!
 * @brief 2个整形数据相加
 * 
 * @param x 输入参数1
 * @param[in] y 输入参数2
 * @return int 
 */
int add(int x, int y)
{
  return x + y;
}
```
### 注释在源码之后
doxygen默认是源码前的注释作为此源码的注释，当注释尾随源码时，这段注释就成为下一段源码的注释了，为了区分此类情况，doxygen提供了`<`符号来标注此注释属于前一源码。
- 单行注释：`///<注释`
- 块注释：`/**<注释*/`or`/*!<注释*/`
```cpp
int i=2;///<全局变量i
//or
int j=2;/**<全局变量j*/
```
## 特殊指令
doxygen提供了一系列指令来标记类，函数，变量，参数，返回值，异常...，这些特殊命令有很多。命令以`@`或`\`开头，如`@file`或`\file`表示文件，以下仅列举重要的常用的。
**注意：**语法形式列表中
- `[option]`：可选
- `<singleword>`：仅允许单个单词，即单词不能出现空格
- `(lineword)`：表示lineword是一行，范围：在行尾结束
- `{paragraph}`：表示一段信息，范围：在下一个指令前结束或一空行处结束
- 命令列`@`也可以换成`\`
### 文档头注释
<table>
<tr>
<th>指令</th>
<th>语法形式</th>
<th>说明</th>
</tr>
<tr>
<td><code>@file</code></th>
<td><code>@file [&lt;name&gt;]</code></td>
<td>文件名，当文件名忽略，默认是当前文件</th>
</tr>
<tr>
<td><code>@author</code></th>
<td><code>@author { list of authors }</code></td>
<td>作者信息</th>
</tr>
<tr>
<td><code>@date</code></th>
<td><code>@date { date description }</code></td>
<td>创建日期</th>
</tr>
<tr>
<td><code>@brief </code></th>
<td><code>@brief { brief description }</code></td>
<td>简要说明</th>
</tr>
<tr>
<td><code>@details</code></th>
<td><code>@details { detailed description }</code></td>
<td>详细说明</th>
</tr>
<tr>
<td><code>@version</code></th>
<td><code>@version { version number }</code></td>
<td>版本信息</th>
</tr>
<tr>
<td><code>@copyright</code></th>
<td><code>@copyright { copyright description }</code></td>
<td>知识版权信息</th>
</tr>
</table>

示例如下
```cpp
 /*! 
 *  \brief     Pretty nice class.
 *  @class SomeNiceClass 
 *  \details   This class is used to demonstrate a number of section commands.
 *  \author    John Doe
 *  \author    Jan Doe
 *  \version   4.2.1
 *  \date      1990-2011
 *  \pre       First initialize the system.
 *  \bug       Not all memory is freed when deleting an object of this class.
 *  \warning   Improper use can crash your application
 *  \copyright GNU Public License.
 */
```
### 函数相关指令
<table>
<tr>
<th>指令</th>
<th>语法形式</th>
<th>说明</th>
</tr>
<tr>
<td><code>@param</code></th>
<td><code>@param '['dir']' <parameter-name> { parameter description }</code></td>
<td>参数信息，dir可以是in,out</th>
</tr>
<tr>
<td><code>@return</code></th>
<td><code>@return { description of the return value }</code></td>
<td>返回值信息</th>
</tr>
<tr>
<td><code>@throw</code></th>
<td><code>@throw &lt;exception-object&gt; { exception description }</code></td>
<td>异常信息</th>
</tr>
</table>

示例如下
```cpp
/*!
 * @brief  Copies bytes from a source memory
 * @details Copies bytes from a source memory area to a destination memory area,
 * where both areas may not overlap.
 * @param[out] dest The memory area to copy to.
 * @param[in]  src  The memory area to copy from.
 * @param[in]  n    The number of bytes to copy
 * @return void     no return value
 * @throw std::out_of_range parameter is out of range.
 */
void memcpy(void *dest, const void *src, size_t n);
```
### 其它特殊指令
<table>
<tr>
<th>指令</th>
<th>语法形式</th>
<th>说明</th>
</tr>
<tr>
<td><code>@code</code></th>
<td><code>@code['{'<word>'}']</code></td>
<td>代码片段,以@code开始，以@endcode结束</th>
</tr>
<tr>
<td><code>@todo</code></th>
<td><code>@todo { paragraph describing what is to be done }</code></td>
<td>TODO注释</th>
</tr>
<tr>
<td><code>@warning</code></th>
<td><code>@warning { warning message }</code></td>
<td>警告信息</th>
</tr>
<tr>
<td><code>@attention</code></th>
<td><code>@attention { attention text }</code></td>
<td>注意信息，与@warning类似</th>
</tr>
<tr>
<td><code>@note</code></th>
<td><code>@note { text }</code></td>
<td>注释信息</th>
</tr>
</table>

- @code示例
```cpp
/**
  \code{.py}
  class Python:
     pass
  \endcode

  \code{.cpp}
  class Cpp {};
  \endcode
    \code{.unparsed}
  Show this as-is please
  \endcode

  \code{.sh}
  echo "This is a shell script"
  \endcode
*/
```
- 示例2
```cpp

/**
 * @brief 2个整形数据相加
 * 
 * @param[in] y 输入参数2
 * @todo  paragraph describing what is to be done 
 * @warning this is a warning
 * @attention this is a attention
 * @note this is a note
 * @return int 
 */
int add(int x/**<输入参数1*/, int y);
```
### 标注类，函数，枚举等指令
doxygen可以通过如`@fn`指令指定函数名，然后将注释放入其它位置（即不在此函数前），doxygen依然能将此注释关联到此函数.
- `@class`
- `@fn`
- `@enum`
- `@file`

```cpp
 /* A dummy class */
  
 class Test
 {
 };
  
 /*! \class Test class.h "inc/class.h"
  *  \brief This is a test class.
  *
  * Some details about the Test class.
  */
```
## 问题汇总
在官网有大量问题及解答，请移步[官网](https://www.doxygen.nl/manual/faq.html "https://www.doxygen.nl/manual/faq.html")

