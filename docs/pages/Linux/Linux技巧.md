---
title: Linux技巧
date: 2021-06-21
sidebarDepth: 2
tags:
 - Linux
categories:
 - Linux
---
# Linux技巧
## 文件防误删
### 方法一:ln硬链接备份
- 示例
```shell
ln src dest.link 
```
### 方法二:chattr禁止删除
**注意：需要root权限**
-示例
```shell
chattr +i file
```