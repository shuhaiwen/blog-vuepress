<BackToTop></BackToTop>

# git常用指令
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
git clone [url]
```
### 拉取远程查看内容
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

