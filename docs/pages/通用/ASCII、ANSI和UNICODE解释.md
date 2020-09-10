---
title: ASCII、ANSI和UNICODE解释
date: 2020-09-10
sidebarDepth: 2
tags:
 - 字符编码
categories:
 - 通用
---
# ASCII、ANSI和UNICODE解释

## ASCII码
ASCII码占7bit为，能表示128个字符，范围0x00~0x7F,主要用来表示英文字母，和常用的字符。
## ANSI
ANSI是对ASCII的扩展，占2个字节，能表示最多65535个字符，0x00~0x7F范围表示的字符与ASCII相同，0x80~0xFFFF范围表示不同国家或地区的字符。ANSI是一个编码集，如汉字编码GBK，日语编码Shift_JIS都是ANSI编码。 
## Unicode字符集
Unicode是一个字符集，最高占3字节大小，使用0x0000~0x10FFFF范围表示全世界所有字符。UTF-8、UTF-16、UTF-32都是编码的实现方案。为了将一个WORD的UTF-16编码与两个WORD的UTF-16编码区分开来，Unicode编码的设计者将0xD800-0xDFFF保留下来，并称为代理区（Surrogate）。