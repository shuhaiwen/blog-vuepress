---
title: 踩坑mongoose
date: 2020-06-18
sidebarDepth: 2
tags:
 - Mongoose
 - 踩坑
categories:
 - Nosql
 - Sql
 - 前端
---

# 踩坑mongoose
- [踩坑mongoose](#踩坑mongoose)
  - [mongoose创建的collection名带后缀s？](#mongoose创建的collection名带后缀s)
## mongoose创建的collection名带后缀s？
可能代码如下：
```js
const schema = new mongoose.Schema({
  username: {
    type: String
  },
  password: {
    type: String
  }
})
mongoose.model('User', schema)
```
原因：这个问题是因为没有给collection指定名称，而导致系统默认使用modle名称按一定规则产生（modle小写+s）

解决方法如下：
```js
//方法1
let collectionName = 'User'
let M = mongoose.model('User', schema, collectionName);
//方法2
schema.set('collection','User')
//方法3
const schema = new mongoose.Schema({
  username: {
    type: String
  },
  password: {
    type: String
  }
}，{collection:'User'})
```
*友情提示：* 如果查到不到数据，而数据确实存在，原因也可能是这个。代码调用的collection和数据库中的不一样