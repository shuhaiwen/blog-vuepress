---
title: cmake 错误汇总
date: 2019-03-05
sidebarDepth: 2
tags:
 - CMake
categories:
 - CMake
 - Solution
---
# cmake 错误汇总
## 更换生成器导致的问题
```shell
CMake Error: Error: generator : Unix Makefiles
Does not match the generator used previously: MinGW Makefiles
Either remove the CMakeCache.txt file and CMakeFiles directory or choose a different binary directory.
```
解决：
1. 把原先由cmake指令产生的临时文件都删了
2. 更换另一个目录，重新执行cmake指令


## 安装路径用英文路径，且路径不要有空格