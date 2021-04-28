---
title: openGL
date: 2021-04-27
sidebarDepth: 2
tags:
 - openGL
categories:
 - C++库
---

# openGL
## openGL重要库
- GLFW：
  - 功能：它允许用户创建OpenGL上下文，定义窗口参数以及处理用户输入
  - 类似库：GLUT
- GLAD：
  - 功能：由于OpenGL驱动版本众多，它大多数函数的位置都无法在编译时确定下来，需要在运行时查询，GLAD就是导出openGL函数的
  - 类似库：GLEW
- GLM：
  - 功能：提供一些高级数学运算，如矩阵运算