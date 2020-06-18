---
title: npm 命令
date: 2020-05-21
sidebarDepth: 2
tags:
 - cmd
categories:
 - Npm
---

# npm 命令

## 常用指令表
<table>
<tr>
<th colspan="2">功能</th>
<th>指令</th>
</tr>
<tr>
<td colspan="2">npm版本信息</td>
<td>npm -v</td>
</tr>
<tr>
<td colspan="2">帮助信息</td>
<td>npm -h</td>
</tr>
<tr>
<td colspan="2">npm全局包路径</td>
<td>npm prefix -g</td>
</tr>
<tr>
<td rowspan="3">更新npm</td>
<td>最新版</td>
<td>npm i npm -g</td>
</tr>
<tr>
<td>最新版</td>
<td>npm i npm@latest -g</td>
</tr>
<tr>
<td>将要发行版</td>
<td>npm i npm@next -g</td>
</tr>
<tr>
<td rowspan="3">安装package</td>
<td>本地安装</td>
<td>npm i [packageName]</td>
</tr>
<tr>
<td>全局安装</td>
<td>npm i [packageName] -g</td>
</tr>
<tr>
<td>package.json文件安装</td>
<td>npm i</td>
</tr>
<tr>
<td rowspan="3">更新package</td>
<td>本地更新</td>
<td>npm update [packageName]</td>
</tr>
<tr>
<td>全局更新</td>
<td>npm update [packageName] -g</td>
</tr>
<tr>
<td>package.json文件更新</td>
<td>npm update</td>
</tr>
<tr>
<td colspan="2">删除package</td>
<td>npm uninstall [packageName]</td>
</tr>
<tr>
<td colspan="2">初始化package.json文件</td>
<td>npm init</td>
</tr>
<tr>
<td rowspan="2">执行package中script</td>
<td>查看所有script</td>
<td>npm run</td>
</tr>
<tr>
<td>执行指定script</td>
<td>npm run [script]</td>
</tr>
<tr>
    <td rowspan="3">查看已安装package</td>
    <td>本地包</td>
    <td>npm list</td>
</tr>
<tr>
    <td>全局包</td>
    <td>npm list -g</td>
</tr>
<tr>
    <td>限制显示模块层级</td>
    <td>npm --depth [number]</td>
</tr>
</table>

-----------
## 进阶指令表
<table>
<tr>
<th colspan="2">功能</th>
<th>指令</th>
</tr>
<tr>
	<td colspan="2">查看package文档</td>
    <td>npm docs [packageName]</td>
</tr>
</table>

------------
### 安装模块参数说明
1. -g, --global 全局安裝（global）
2. -S, --save 安裝包信息將加入到dependencies（生產階段的依賴）
3. -D, --save-dev 安裝包信息將加入到devDependencies（開發階段的依賴），所以開發階段一般使用它
4. -O, --save-optional 安裝包信息將加入到optionalDependencies（可選階段的依賴）
5. -E, --save-exact 精確安裝指定模塊版本
   
---------
### 简写指令

|指令|缩写|功能|
|:---|:---:|---|
|install|i|安装package|
|list|ls la ll|列出以安装package信息|