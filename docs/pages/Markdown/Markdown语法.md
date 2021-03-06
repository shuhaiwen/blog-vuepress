---
title: Markdown语法
date: 2020-05-04
sidebarDepth: 2
tags:
 - Markdown
categories:
 - Markdown
---
# Markdown语法
## 链接
* [github](https://github.com/shuhaiwen) 
```markdown
[github](https://github.com/shuhaiwen)
```
* https://github.com/shuhaiwen 自动识别网址 
```markdown
https://github.com/shuhaiwen 自动识别网址
```
* [链接标题](#图片) 
```markdown
[链接标题](#图片)
```
* [github][1] 引用链接 
```markdown
[github][1] 引用链接
```

[1]: https://github.com/shuhaiwen "title" 
```markdown
[1]: https://github.com/shuhaiwen "title"
```

## 图片
![图片](https://cdn.jsdelivr.net/gh/shuhaiwen/image-host/Img/Icon/Color/github-color.svg 'svg')
```markdown
![图片](https://cdn.jsdelivr.net/gh/shuhaiwen/image-host/Img/Icon/Color/github-color.svg 'svg')
```

- [x] 11
- [ ] 22
```markdown
- [x] 11
- [ ] 22
```
## 表格
|id|name|age|
|:----|:----:|----:|
|10000|Tim|18|
|10001|Anny|20|
|102|Bob|9|
```
|id|name|age|
|:----|:----:|----:|
|10000|Tim|18|
|10001|Anny|20|
|102|Bob|9|
```
其中对齐属性由下面语法标识
- 左对齐`:----`
- 居中`:----:`
- 右对齐`----:`