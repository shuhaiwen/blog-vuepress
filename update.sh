#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e
# 提交当前目录下源码到github
git add .
git commit -m "${1}."

git push origin main

# 生成静态文件,生成到目录blogTemp上
npm run build

# 进入blog目录下
cd ./blog

#从github上拉取合并
git pull

#删除blog目录下除.git文件外所有资源
rm -rf *

#移动blogTemp下文件到blog文件夹
mv ../blogTemp/* ./

# 提交blog目录下源码github.io 仓库
git add .
git commit -m "${1}."

git push origin main
