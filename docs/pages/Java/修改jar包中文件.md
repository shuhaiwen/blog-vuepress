---
title: 修改jar包中文件
date: 2020-12-01
sidebarDepth: 2
tags:
 - 反编译
categories:
 - Java
---
# 修改jar包中文件
*注意：***以下操作假设 jar包名 hello.jar .java名 hello.java .class名 hello.class**
## 步骤一：反编译jar包
1. 使用反编译工具反编译hello.jar包（推荐IDEA和jd-gui）
2. 从反编译后的文件中找到需要修改的hello.class文件，拷贝其内容，新建hello.java文件，将拷贝内容粘贴进去
3. 修改hello.java文件中内容

## 步骤二：.java文件生成.class文件
1. 将hello.java文件和原hello.jar包放在同一目录下，执行以下命令,将会在当前目录生成hello.class文件(与hello.java文件同名)
```shellsession
javac -cp hello.jar hello.java
``` 
## 步骤三：打包jar包
1. 复制jar包到另一目录下，将hello.jar改名hello.zip并解压
2. 将步骤二生成的hello.class文件替换目录下的hello.class文件
3. 在解压目录下执行以下命令，将会生成hello.jar文件
```shellsession
# hello.jar 指定生成jar包名 META-INF hello 是解压hello.zip中得到的文件夹名称（所有文件夹名都要列出）
jar -cvfM0 hello.jar META-INF hello
```