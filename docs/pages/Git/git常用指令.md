---
title: Git
date: 2020-05-04
sidebarDepth: 2
tags:
 - Cmd
categories:
 - Git
 - Kit
---
- [git常用指令](#git常用指令)
  - [git配置](#git配置)
    - [设置用户名和邮箱](#设置用户名和邮箱)
    - [查看用户配置信息](#查看用户配置信息)
  - [git本地命令](#git本地命令)
    - [1.初始化仓库](#1初始化仓库)
    - [2.添加文件至暂存区](#2添加文件至暂存区)
    - [提交至本地仓库](#提交至本地仓库)
    - [取消暂存区文件](#取消暂存区文件)
    - [查看仓库状态](#查看仓库状态)
  - [git远程仓库命令](#git远程仓库命令)
    - [克隆远程仓库](#克隆远程仓库)
    - [指定分支克隆](#指定分支克隆)
    - [拉取远程仓库内容](#拉取远程仓库内容)
    - [查看远程仓库](#查看远程仓库)
    - [移除/添加/重命名远程仓库关联](#移除添加重命名远程仓库关联)
    - [推送内容到远程仓库](#推送内容到远程仓库)
  - [撤销操作](#撤销操作)
    - [修改最后一次提交注释](#修改最后一次提交注释)
  - [git工具](#git工具)
    - [日志](#日志)
  - [分支](#分支)
    - [创建分支](#创建分支)
    - [合并分支](#合并分支)
    - [删除本地分支](#删除本地分支)
    - [删除远程分支](#删除远程分支)
    - [显示分支](#显示分支)
    - [分支改名](#分支改名)
    - [查看已经合并或尚未合并到当前分支的分支](#查看已经合并或尚未合并到当前分支的分支)
    - [设置跟踪分支](#设置跟踪分支)
    - [查看所有跟踪分支](#查看所有跟踪分支)
# git常用指令
## git配置
### 设置用户名和邮箱
*如果用户名有空格，则用户名要在引号内，如"zhang san"*
```git
git config --global user.name [yourname]
git config --global user.email [youremail]
```
### 查看用户配置信息
```git
$ git config --list
```
## git本地命令
### 1.初始化仓库
```git
# 默认生成分支master
git init
```
### 2.添加文件至暂存区
```git
#添加.git所在目录所有文件
git add .
#添加指定文件
git add file.txt
#使用正则语法
git add *.txt
```
### 提交至本地仓库
```git
#将暂存区文件提交至本地仓库
git commit -m "提交信息"
#跳过add步骤，直接将已跟踪文件提交至本地仓库
git commit -a -m "提交信息"
# 将暂存区内容提交，但会沿用上一次提交，不会产生新的提交id
git commit --amend
```
### 取消暂存区文件
```git
# add 文件到暂存区
git add 1.txt
# 将文件移除暂存区
git restore --staged 1.txt
```
### 查看仓库状态
```git
git status
```
## git远程仓库命令 
### 克隆远程仓库
```git
# 默认远程仓库名为origin，分支为你克隆的分支名，且在本地创建master分支
git clone [url]
```
### 指定分支克隆
- 语法
  - `git clone -b 分支名 url`
- 示例
```git
git clone -b main https://github.com/shuhaiwen/shuhaiwen.github.io.git
```
### 拉取远程仓库内容
```git
git fetch [remote-name]
git pull <远程主机名> <远程分支名>:<本地分支名>
```
### 查看远程仓库
```git
# 指定远程仓库
git remote show [remote-name]
# 所有远程仓库信息
git remote -v
```
### 移除/添加/重命名远程仓库关联
```git
git remote rm [remote-name]
git remote add [remote-name] https://github.com/<REPO>
git remote rename [old-name] [new-name]
```
### 推送内容到远程仓库
```git
git push [remote-name] [local-branch]:[remote-branch]
```

## 撤销操作
### 修改最后一次提交注释
```git
git commit --amend -m '改变最后一次提交'
```
## git工具
### 日志
```git
git log
git reflog
```
## 分支
### 创建分支
```git
# 创建分支(还在master主分支上)
git branch branch1
# 切换分支(在branch1分支上)
git checkout branch1
# 创建新分支的同时切换过去
git checkout -b branch2
```
### 合并分支
```git
# 合并branch1分支到master上
git checkout master
git merge branch1
```
### 删除本地分支
```git
# 分支未被合并会报错
git branch -d branch1
# 强制删除分支(包括未合并分支)
git branch -D branch1
```
### 删除远程分支
```git
# 删除远程分支 branch1，其中冒号:前需要空一格，且删除的分支不能是远程仓库的默认分支
git push origin :branch1
```
### 显示分支
```git
# 显示当前分支
git branch
# 显示所有分支（包括远程分支和本地分支）
git branch -a
# 显示所有分支（包括远程跟踪分支和本地分支）
git branch -r
# 显示已合并分支
git branch --merged
# 显示未合并分支
git branch --no-merged
```
### 分支改名
```git
git branch -m oldName newName
```
### 查看已经合并或尚未合并到当前分支的分支
```git
# 查看已经合并到当前分支的分支
$ git branch --merged
* main
# 查看尚未合并到当前分支的分支
$ git branch --no-merged
  branch1
```
### 设置跟踪分支
为远程仓库某一个分支建立本地分支，即为跟踪分支
```git
$ git branch -a
* master
  remotes/origin/HEAD -> origin/master
  remotes/origin/appveyor
  remotes/origin/configuration
  remotes/origin/context
  remotes/origin/develop
  remotes/origin/disable-nonstandard
  remotes/origin/fix-add-item
  remotes/origin/less-magic
  remotes/origin/libfuzzer
  remotes/origin/long-long-fix
  remotes/origin/master
  remotes/origin/meson
# 方法1 为远程分支context关联本地分支context
$ git checkout -b context origin/context
Switched to a new branch 'context'
Branch 'context' set up to track remote branch 'context' from 'origin'.
$ git branch
* context
  master
# 方法2 使用--track参数
$ git checkout --track origin/appveyor
Switched to a new branch 'appveyor'
Branch 'appveyor' set up to track remote branch 'appveyor' from 'origin'.
$ git branch
* appveyor
  context
  master
# 方式3 直接检出远程仓库分支名（需本地没有此分支，否则将切换到本地分支）
$ git checkout develop
Switched to a new branch 'develop'
Branch 'develop' set up to track remote branch 'develop' from 'origin'.
$ git branch
  appveyor
  context
* develop
  master

```
### 查看所有跟踪分支
```git
$ git branch -vv
  appveyor f0e93c9 [origin/appveyor] add appveyor
  context  3b0d37f [origin/context] Change name from Configuration to Context
* develop  5437b79 [origin/develop] Add getNumberValue function
  main     324a6ac [origin/master] Update .gitattributes (#544)
```