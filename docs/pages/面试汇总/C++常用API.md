---
title: C++常用API
date: 2021-03-18
sidebarDepth: 2
tags:
 - C++常用API
categories:
 - 面试汇总
---
# C++常用API
## 字符串操作
- `strlen`
  - 功能：返回给定字符串的长度
  - 头文件：`<string.h>`
  - 语法：`size_t strlen( const char *str );`
- `strcpy`
  - 功能：复制一个字符串给另一个
  - 头文件：`<string.h>`
  - 语法：`char *strcpy( char *dest, const char *src );`
- `strncpy`
  - 功能：从一个字符串复制一定数量的字符到另一个
  - 头文件：`<string.h>`
  - 语法：`char *strncpy( char *dest, const char *src, size_t count );`
- `strcat`
  - 功能：连接两个字符串
  - 头文件：`<string.h>`
  - 语法：`char *strcat( char *dest, const char *src );`
- `strcmp`
  - 功能：比较两个字符串
  - 头文件：`<string.h>`
  - 语法：`int strcmp( const char *lhs, const char *rhs );`
- `strncmp`
  - 功能：比较两个字符串的一定数量字符
  - 头文件：`<string.h>`
  - 语法：`int strncmp( const char *lhs, const char *rhs, size_t count );`
- `strchr`
  - 功能：查找字符的首次出现
  - 头文件：`<string.h>`
  - 语法：`char *strchr( const char *str, int ch );`
- `strrchr`
  - 功能：查找字符的最后一次出现
  - 头文件：`<string.h>`
  - 语法：`char *strrchr( const char *str, int ch );`
- `strspn`
  - 功能：返回由另一个字符串中的字符分割的最大起始段长度(由src组成的字符在dest中连续最大长度)
  - 头文件：`<string.h>`
  - 语法：`size_t strspn( const char *dest, const char *src );`
- `strcspn`
  - 功能：返回另一个字符串所不具有的字符分割的最大起始段长度(由不含src组成的字符在dest中连续最大长度)
  - 头文件：`<string.h>`
  - 语法：`size_t strcspn( const char *dest, const char *src );`
- `strpbrk`
  - 功能：查找一个字符串中的任意一个字符在另一个字符串中的首个位置
  - 头文件：`<string.h>`
  - 语法：`char* strpbrk( const char* dest, const char* breakset );`
- `strstr`
  - 功能：查找子串字符的首次出现
  - 头文件：`<string.h>`
  - 语法：`char *strstr( const char* str, const char* substr );`
## 字符转换
- `atoi`
  - 功能：将字节字符串转换成整数值
  - 头文件：`<stdlib.h>`
  - 语法：`int atoi( const char *str );`
- `strtol`
  - 功能：将字节字符串转换成整数值
  - 头文件：`<stdlib.h>`
  - 语法：`long strtol( const char *str, char **str_end, int base );`
- `tolower`
  - 功能：将字符转换成小写
  - 头文件：`<ctype.h>`
  - 语法：`int tolower( int ch );`
- `toupper`
  - 功能：将字符转换成大写
  - 头文件：`<ctype.h>`
  - 语法：`int toupper( int ch );`
## 内存操作
- `memset`
  - 功能：以字符填充缓冲区
  - 头文件：`<string.h>`
  - 语法：`void *memset( void *dest, int ch, size_t count );`
- `memcmp`
  - 功能：比较两块缓冲区
  - 头文件：`<string.h>`
  - 语法：`int memcmp( const void* lhs, const void* rhs, size_t count );`
- `memchr`
  - 功能：查找字符
  - 头文件：`<string.h>`
  - 语法： `void* memchr( const void* ptr, int ch, size_t count );`
- `memcpy`
  - 功能：将一个缓冲区复制到另一个
  - 头文件：`<string.h>`
  - 语法：`void* memcpy( void *dest, const void *src, size_t count );`
- `memmove`
  - 功能：将一个缓冲区移动到另一个
  - 头文件：`<string.h>`
  - 语法：`void* memmove( void* dest, const void* src, size_t count );`

::: tip memcpy与memmove区别
memcpy没有考虑内存重叠问题，而menmove解决了内存重叠问题，且同样高效。
:::
## basic_string成员函数
## 文件处理

