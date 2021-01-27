---
title: Doxygen配置
date: 2021-01-27
sidebarDepth: 2
tags:
 - Doxygen配置
categories:
 - Doxygen
---

# Doxygen配置
## 安装
- windows：
  - doxygen提供了exe可直接安装，安装后可能需要将可执行性文件路径加入path环境变量中
- Linux：[参考官网](https://www.doxygen.nl/manual/install.html#install_bin_unix)
## 使用
### 步骤
1. 生成配置文件Doxyfile：`doxygen -g`
2. 编辑配置文件Doxyfile
3. 生成文档：`doxygen`
### Doxyfile文件配置
- `PROJECT_NAME`：生成的文档标题，如html文档tital，默认是My Project
- `OUTPUT_DIRECTORY`：文档的生成目录
- `INPUT`：源文件位置,多个路径空格隔开，如`INPUT= ../include src`
- `RECURSIVE`：是否查找子目录下源文件，YES是，NO否，如`RECURSIVE= YES`
- `EXTRACT_ALL`：当设置`YES`时所有注释都会生成文档
- `EXTRACT_PRIVATE`：设置`YES`时私用成员会被文档化
- `EXTRACT_STATIC`：设置`YES`时静态成员会被文档化
更多设置请移步[官网](https://www.doxygen.nl/manual/config.html "https://www.doxygen.nl/manual/config.html")
## 问题汇总
在官网有大量问题及解答，请移步[官网](https://www.doxygen.nl/manual/faq.html "https://www.doxygen.nl/manual/faq.html")
