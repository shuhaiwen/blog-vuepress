---
title: TypeScript 总结
date: 2020-07-03
sidebarDepth: 2
tags:
 - TypeScript
categories:
 - TypeScript
 - 前端
---

# TypeScript 总结
------------------------------
## 类型声明
### 基本类型
关键字 `:`<br/>
TypeScript比较JavaScript语法，只在变量后加 `:[type]`,示例如下：
```ts
//boolearn
let isDone: boolean = false;
//number
let decLiteral: number = 6;
//string
let name: string = "bob";
//Array
let list: number[] = [1, 2, 3];
let list: Array<number> = [1, 2, 3];
// Declare a tuple type
let x: [string, number]= ['hello', 10];
//undefined
let u: undefined = undefined;
//null
let n: null = null;
```
*Array的语法类型C++模板写法，使用<>包裹内部类型,嵌套规则也相同*
### 枚举
```ts
enum Color {Red, Green, Blue}
let c: Color = Color.Green;
```
### void
- void一般用在函数返回值时，表示函数无返回值
- void用在变量声明时，只能被赋予null或undefinde,没有多大意义
```ts
function warnUser(): void {
    console.log("This is my warning message");
}
let unusable: void = undefined;
```
### any
any类型与C++中void* 类型，被any指定的对象可以被转换成任意类型
```ts
let notSure: any = 4;// okay
notSure = "maybe a string instead";// okay
notSure = false; // okay
```
### 类型断言
类型断言是一种强制转换方式
```ts
//写法1 <>
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;
//写法2 as
let strLength: number = (someValue as string).length;
```
-----------------------
## 函数
*TypeScript函数调用时，参数个数不能超过定义的的个数，JavaScript则无此规则*
- 为返回值指定类型
- 为参数指定类型
```ts
function sum(x: number, y: number): number {
    return x + y;
}
sum(1,2);//success
sum(1);//error
sum(1,2,3);//error
```
### 可选参数
关键字 `?`<br/>
可选参数可约束函数参数是否可忽略
```ts
function buildName(firstName: string, lastName?: string) {
    if (lastName)
        return firstName + " " + lastName;
    else
        return firstName;
}

let result1 = buildName("Bob");  // works correctly now
let result2 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result3 = buildName("Bob", "Adams");  // ah, just right
```
### 参数默认值
**类似C++函数参数默认值**
- 传参时可不忽略
- 默认值参数不能在非默认值参数之前
```ts
function buildName(firstName = "Will", lastName: string) {
    return firstName + " " + lastName;
}

let result1 = buildName("Bob");                  // error, too few parameters
let result2 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result3 = buildName("Bob", "Adams");         // okay and returns "Bob Adams"
let result4 = buildName(undefined, "Adams");     // okay and returns "Will Adams"
```
### 变长参数
关键字 `...`<br/>
```ts
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}
let buildNameFun: (fname: string, ...rest: string[]) => string = buildName;
let employeeName = buildName("Joseph", "Samuel", "Lucas", "MacKinzie");
```