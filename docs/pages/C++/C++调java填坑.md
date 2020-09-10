---
title: C++调java填坑
date: 2020-09-05
sidebarDepth: 2
tags:
 - JNI
categories:
 - C++
 - Java
---
# C++调java填坑
## 使用JNI_CreateJavaVM出现错误
- 原因：可能仅仅只把jvm.dll放入工程中但使用JNI还需要jre中其它东西。
- 解决方法：直接使用LoadLibrary加载jre安装的路径下jvm.dll吗，而不是拷贝到当前项目。

## 使用 JNI_CreateJavaVM返回0xFFFFFFFD
- 原因：此错误是指JNI版本号错误
- 解决方法：在给JavaVMInitArgs变量设置version值时，使用系统提供的JNI_VERSION_1_1,JNI_VERSION_1_2,JNI_VERSION_1_4,JNI_VERSION_1_6宏，且你使用的版本要大于或等于你指定的版本