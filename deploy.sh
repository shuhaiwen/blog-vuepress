#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

#删除blog目录下除.git文件外所有资源
rm -rf ./blog/*

#移动blogTemp下文件到blog文件夹
mv ./blogTemp/* ./blog/

# 进入目录下
cd ./blog

git add .
git commit -m '$1.'

git push origin master
