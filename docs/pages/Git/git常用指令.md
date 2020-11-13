---
title: Git
date: 2020-05-04
sidebarDepth: 2
tags:
 - Git
categories:
 - 版本控制
---

# git常用指令
[[toc]]
## git配置
### 设置用户名和邮箱
*如果用户名有空格，则用户名要在引号内，如"zhang san"*
```sh
git config --global user.name [yourname]
git config --global user.email [youremail]
```
### 查看用户配置信息
```sh
$ git config --list
```
## git本地命令
### 1.初始化仓库
```sh
# 默认生成分支master
git init
```
### 2.添加文件至暂存区
```sh
#添加.git所在目录所有文件
git add .
#添加指定文件
git add file.txt
#使用正则语法
git add *.txt
```
### 提交至本地仓库
```sh
#将暂存区文件提交至本地仓库
git commit -m "提交信息"
#跳过add步骤，直接将已跟踪文件提交至本地仓库
git commit -a -m "提交信息"
```
### 查看仓库状态
```sh
git status
```
## git远程仓库命令 
### 克隆远程仓库
```sh
# 默认远程仓库分支为origin，且在本地创建master分支
git clone [url]
```
### 拉取远程仓库内容
```sh
git fetch [remote-name]
```
### 查看远程仓库
```sh
# 指定远程仓库
git remote show [remote-name]
# 所有远程仓库信息
git remote -v
```
### 移除/添加/重命名远程仓库关联
```sh
git remote rm [remote-name]
git remote add [remote-name] https://github.com/<REPO>
git remote rename [old-name] [new-name]
```
### 推送内容到远程仓库
```sh
git push [remote-name] [local-branch-name]
```

## 撤销操作
### 修改最后一次提交注释
```sh
git commit --amend -m '改变最后一次提交'
```
## git工具
### 日志
```sh
git log
git reflog
```
## 分支
### 创建分支
```sh
# 创建分支(还在master主分支上)
git branch branch1
# 切换分支(在branch1分支上)
git checkout branch1
# 创建新分支的同时切换过去
git checkout -b branch2
```
### 合并分支
```sh
# 合并branch1分支到master上
git checkout master
git merge branch1
```
### 删除分支
```sh
# 分支未被合并会报错
git branch -d branch1
# 强制删除分支(包括未合并分支)
git branch -D branch1
```
### 显示分支
```sh
# 显示所有分支
git branch
# 显示已合并分支
git branch --merged
# 显示未合并分支
git branch --no-merged
```
### 分支改名
```sh
git branch -m oldName newName
```


