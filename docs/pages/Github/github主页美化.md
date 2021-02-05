---
title: Github主页美化
date: 2021-02-05
sidebarDepth: 2
tags:
 - Github
categories:
 - Github
---
# Github主页美化
## 使用github-readme-stats添加项目状态
[项目地址](https://github.com/anuraghazra/github-readme-stats/blob/master/docs/readme_cn.md "https://github.com/anuraghazra/github-readme-stats/blob/master/docs/readme_cn.md")
</br>
github-readme-stats项目通过卡片风格展现一些信息，而这信息生成就像一个url，这个url后随一些参数，这些参数以`&`连接,可以参数如下:
|参数|描述|示例|
|:----:|:----|----|
|title_color|卡片标题颜色 （十六进制色码）|&title_color=fbc2eb|
|text_color|内容文本颜色 （十六进制色码）|&text_color=fbc2eb|
|icon_color|图标颜色（如果可用）（十六进制色码）|&icon_color=fbc2eb|
|bg_color|卡片背景颜色 （十六进制色码） 或者 以 angle,start,end 的形式渐变|&bg_color=45,fbc2eb,a6c1ee|
|hide_border|隐藏卡的边框 (布尔值)|&hide_border=true|
|theme|主题名称，从所有可用主题中选择|&theme=dark|
|cache_seconds|手动设置缓存头 （最小值: 1800，最大值: 86400）|&cache_seconds=1800|
|locale|在卡片中设置语言 (例如 cn, de, es, 等等)|&locale=cn|
|hide|隐藏特定统计信息 (以逗号分隔)|&hide=javascript,html|
|hide_title|(boolean)|&hide_title=true|
|hide_rank|(boolean)|&hide_rank=true|
|show_icons|(boolean)|&show_icons=true|
|include_all_commits| 统计总提交次数而不是仅统计今年的提交次数 (boolean)|&include_all_commits=true|
|count_private| 统计私人提交 (boolean)|&count_private=true|
|line_height|设置文本之间的行高 (number)|&line_height=25|
|layout|在两个可用布局 default & compact 间切换|&layout=compact|
|card_width|手动设置卡片的宽度 (number)|&card_width=350|
### github项目状态统计
![shuhaiwen's GitHub stats](https://github-readme-stats.vercel.app/api?username=shuhaiwen&show_icons=true&theme=radical&bg_color=45,fbc2eb,a6c1ee)
### github项目语言统计
![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=shuhaiwen&layout=compact&bg_color=45,fbc2eb,a6c1ee)
### github仓库置顶
[![Readme Card](https://github-readme-stats.vercel.app/api/pin/?username=shuhaiwen&repo=shuhaiwen.github.io&bg_color=45,fbc2eb,a6c1ee)](https://github.com/shuhaiwen/shuhaiwen.github.io)
### 重要设置
- 背景渐变
```
&bg_color=45,fbc2eb,a6c1ee
```
- 隐藏指定语言
```
&hide=javascript,html
```
- 紧凑的语言卡片布局
```
&layout=compact
```

