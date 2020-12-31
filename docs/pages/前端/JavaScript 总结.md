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
- [JavaScript 总结](#javascript-总结)
  - [关键字](#关键字)
    - [this](#this)
  - [class](#class)
    - [static 方法和属性](#static-方法和属性)
    - [私有属性和私有方法](#私有属性和私有方法)
    - [extends 继承](#extends-继承)
  - [ES6 模块与 CommonJS 模块](#es6-模块与-commonjs-模块)
    - [ES6 模块语法](#es6-模块语法)
      - [export 导出](#export-导出)
      - [import 导入](#import-导入)
      - [错误导出示例](#错误导出示例)
      - [import 导出](#import-导出)
      - [export 与 import 的复合写法](#export-与-import-的复合写法)
    - [CommonJS 模块语法](#commonjs-模块语法)
  - [call apply bind](#call-apply-bind)
  - [异步](#异步)
    - [async await](#async-await)
## 关键字
### this
JavaScript中this值是在函数被调用时确定的，this指向调用的对象
```javascript
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
## class
JavaScript中的类是一个语法糖
- 类是一个function类型，执行原型的构造器，`Point===Point.prototype.constructor`
- 类必须由`new`构造，`let p=new Point()`
```javascript
//使用构造函数
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return '(' + this.x + ', ' + this.y + ')';
};
var p = new Point(1, 2);
//使用类
class Point(x,y){
    construcor(x,y){
        this.x=x;
        this.y=y;
    }
    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }
}
```
### static 方法和属性
- 静态方法只能通过类名调用 `Foo.bar()`
- 静态方法中`this`指的是类 `Foo`，而不是实例 `foo`
- 静态方法内部可以调用类静态方法，而不能调用非静态方法
- 静态方法和非静态方法可重名 `static baz() {}` 和`baz() {}`
```javascript
class Foo {
  static  prop=1;//静态属性
  static bar() {//静态方法
    this.baz();
  }
  static baz() {
    console.log('hello');
  }
  baz() {
    console.log('world');
  }
}
let foo=new Foo();
Foo.bar() // hello
```
### 私有属性和私有方法
私有属性和私有方法前加 `#` 表示私有
- 私有属性和方法不能由类实例调用，只能在类内部使用
```javascript
class Foo {
  #a;//私有属性
  #b;
  constructor(a, b) {
    this.#a = a;
    this.#b = b;
  }
  #sum() {//私有方法
    return #a + #b;
  }
  printSum() {
    console.log(this.#sum());
  }
}
```
### extends 继承
- `this`指代当前类，`super`指代父类
- 需要在子类构造函数中调用父类构造函数 `super(x, y);`
```javascript
class Point {
}
class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y); // 调用父类的constructor(x, y)
    this.color = color;
  }

  toString() {
    return this.color + ' ' + super.toString(); // 调用父类的toString()
  }
}
```
## ES6 模块与 CommonJS 模块
- CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
- CommonJS 模块由 require + module.exports + exports 导入导出,ES6 模块由import + export + export default 导入导出。

### ES6 模块语法
#### export 导出
- 使用export 一个一个导出
- 使用export统一导出
- 使用export default导出
- 使用as重命名导出变量
```javascript
// profile.js

//1.使用export 一个一个导出
export var firstName = 'Michael';
export var lastName = 'Jackson';
export var year = 1958;
//2.使用export统一导出
var firstName = 'Michael';
var lastName = 'Jackson';
var year = 1958;
export { firstName, lastName, year };
// 3.使用export default导出
function foo() {
  console.log('foo');
}
export default foo;
//or
export default function foo() {
  console.log('foo');
}
//4.使用as重命名导出变量
function v1() { ... }
export {v1 as streamV1}
```
#### import 导入
- 使用 `as` 重命名导入变量
- 使用 `* as`整体导入
- 执行所加载的模块，但不导入任何东西
```javascript
//1.使用 * as整体导入
// circle.js
export function area(radius) {
  return Math.PI * radius * radius;
}
export function circumference(radius) {
  return 2 * Math.PI * radius;
}
//main.js
import * as circle from './circle';
console.log('圆面积：' + circle.area(4));
console.log('圆周长：' + circle.circumference(14));
//2.普通导入
import { firstName, lastName, year } from './profile.js';
//3.使用 `as` 重命名导入变量
import { lastName as surname } from './profile.js';

//4.执行所加载的模块
import 'lodash';
```
#### 错误导出示例
- 定义声明时立即导出
- 定义时不导出，只能统一放入{}导出
```javascript
// 写法一
export var m = 1;

// 写法二
var m = 1;
export {m};

// 写法三
var n = 1;
export {n as m};

// 报错
function f() {}
export f;

// 正确
export function f() {};

// 正确
function f() {}
export {f};
```
#### import 导出
- 导入文件，可以是相对路径，也可以是绝对路径，`.js`后缀可以省略
- 导入模块，可以指定路径，或者不带有路径时，那么必须有配置文件（package.json）
```javascript
//main.js
//1.导入模块名
import { stat, exists, readFile } from 'fs';
//2.导入文件名
import {firstName,lastName,year} from './profile.js'
//3.使用as 重命名
import { lastName as surname } from './profile.js';
```
#### export 与 import 的复合写法
- 导入同时导出
```javascript
export { foo, bar } from 'my_module';

// 可以简单理解为
import { foo, bar } from 'my_module';
export { foo, bar };
// 导出default
export { default } from 'foo';
//默认接口也可以改名为具名接口
export { default as es6 } from './someModule';
// 接口改名
export { foo as myFoo } from 'my_module';

// 整体输出，但不到处default
export * from 'my_module';

//ES2020 写法
export * as ns from "mod";

// 等同于
import * as ns from "mod";
export {ns};
```
### CommonJS 模块语法
```javascript
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};
// main.js
var mod = require('./lib');

console.log(mod.counter);  // 3
mod.incCounter();
console.log(mod.counter); // 3
```
## call apply bind
**作用:函数的复用**
- 用于改变函数执行时this指向(重新绑定对象)
- 第一个参数是绑定的对象，后面参数是函数执行时接受的参数
```javascript
  let obj = {name: 'tony'};
  
  function Child(name){
    this.name = name;
  }
  
  Child.prototype = {
    constructor: Child,
    showName: function(){
      console.log(this.name);
    }
  }
  var child = new Child('thomas');
  child.showName(); // thomas
  
  //  call,apply,bind使用
  child.showName.call(obj);// tony
  child.showName.apply(obj);// tony
  let bind = child.showName.bind(obj); // 返回一个函数
  bind(); // tony

```
## 异步
### async await
