---
title: JavaScript 总结
date: 2020-07-04
sidebarDepth: 2
tags:
 - JavaScript
categories:
 - JavaScript
 - 前端
---
# JavaScript 总结

## 关键字
### this
JavaScript中this值是在函数被调用时确定的，this指向调用的对象
```js
var o = {
    a:10,
    b:{
        a:12,
        fn:function(){
            console.log(this.a);
        }
    }
}
o.b.fn();//12 this指向 b不是o，b才是直接调用fn函数的
var j = o.b.fn;
j();//undefined this指向 window
```