---
title: Visual Studio教程
date: 2020-07-01
sidebarDepth: 2
tags:
 - Visual Studio
categories:
 - Editor
---
# Visual Studio教程
## Visual Studio实用快捷键

<table>
<tr>
<th colspan='2'>功能</th>
<th>快捷键</th>
</tr>
<tr>
<td colspan='2'>格式化代码</td>
<td>Ctrl+K+F</td>
<tr >
</tr>
<td rowspan='2'>注释</td>
<td>注释选中内容</td>
<td>Ctrl+K+C</td>
</tr>
<tr>
<td>取消注释</td>
<td>Ctrl+K+U</td>
</tr>
<tr>
<td colspan='2'>代码提示</td>
<td>Ctrl+J</td>
</tr>
<tr>
<td rowspan='2'>查找</td>
<td>快速查找</td>
<td>Ctrl+F</td>
</tr>
<tr>
<td>在文件中查找</td>
<td>Ctrl+Shift+F</td>
</tr>
<tr>
<td colspan='2'>删除当前行内容</td>
<td>Ctrl+L</td>
</tr>
</table>

## 编译错误汇总
### 无法解析的外部符号
1. 原因一：项目包含了头文件（.h文件），但源文件（.cpp文件）没有被包含；解决方法：将源文件包含进项目中。
2. 原因二：声明和定于没有统一，比如定义时参数加了const，而声明时忘了加上const;解决方法：修改保证定义与声明完成一致。
3. 原因三：使用了静态库（.lib）但没有将库包含进项目；解决方法：使用`#pragma comment(lib,"......")`或在项目属性链接栏目配置相应属性。