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
- [TypeScript 总结](#typescript-总结)
  - [类型声明](#类型声明)
    - [基本类型](#基本类型)
    - [枚举 `enum`](#枚举-enum)
    - [void](#void)
    - [any](#any)
    - [类型断言](#类型断言)
  - [函数](#函数)
    - [可选参数](#可选参数)
    - [参数默认值](#参数默认值)
    - [变长参数](#变长参数)
  - [类型别名 `type`](#类型别名-type)
  - [接口 `interface`](#接口-interface)
    - [接口定义](#接口定义)
    - [接口实现 `implements`](#接口实现-implements)
    - [继承接口 `extends`](#继承接口-extends)
  - [命名空间 `namespace`](#命名空间-namespace)
  - [声明文件 `declare`](#声明文件-declare)
## 类型声明
### 基本类型
关键字 `:`<br/>
TypeScript比较JavaScript语法，只在变量后加 `:[type]`,示例如下：
```typescript
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
### 枚举 `enum`
```typescript
enum Color {Red, Green, Blue}
let c: Color = Color.Green;
```
### void
- void一般用在函数返回值时，表示函数无返回值
- void用在变量声明时，只能被赋予null或undefinde,没有多大意义
```typescript
function warnUser(): void {
    console.log("This is my warning message");
}
let unusable: void = undefined;
```
### any
any类型与C++中void* 类型，被any指定的对象可以被转换成任意类型
```typescript
let notSure: any = 4;// okay
notSure = "maybe a string instead";// okay
notSure = false; // okay
```
### 类型断言
关键字：`<>` 或者 `as`<br/>
类型断言是一种强制转换方式
```typescript
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
```typescript
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
```typescript
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
```typescript
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
```typescript
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}
let buildNameFun: (fname: string, ...rest: string[]) => string = buildName;
let employeeName = buildName("Joseph", "Samuel", "Lucas", "MacKinzie");
```
## 类型别名 `type`
- 用于基本类型
- 用于对象
- 用于元组
- 用于泛型
- 用于联合类型
- 用于函数
```typescript
//基本类型
type Name = string;
//对象
type User = {
  name: string
  age: number
};
//元组
type PetList = [Dog, Pet];
//泛型
type Callback<T> = (data: T) => void;  
type Pair<T> = [T, T];  
type Coordinates = Pair<number>;  
type Tree<T> = T | { left: Tree<T>, right: Tree<T> };
//函数
type NameResolver = () => string;
//联合类型
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
    if (typeof n === 'string') {
        return n;
    } else {
        return n();
    }
}
```
## 接口 `interface`
### 接口定义
- 支持对象[可选属性、只读属性]
- 支持函数
- 支持可索引的类型
```typescript
//对象
interface LabelledValue {
  label: string;
  readonly name?: string;
}

function printLabel(labelledObj: LabelledValue) {
  console.log(labelledObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);
//函数
interface SearchFunc {
  (source: string, subString: string): boolean;
}
//可索引的类型
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];
```
### 接口实现 `implements`
```typescript
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date);
}

class Clock implements ClockInterface {
    currentTime: Date;
    setTime(d: Date) {
        this.currentTime = d;
    }
    constructor(h: number, m: number) { }
}
```
### 继承接口 `extends`
```typescript
interface Shape {
    color: string;
}

interface Square extends Shape {
    sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
```
## 命名空间 `namespace`
与c++中namespace一样作用
- 使用namespace避免与其他对象命名冲突
- 使用import 命名namespace别名
```typescript
namespace Utility {
  export function log(msg) {
    console.log(msg);
  }
  export function error(msg) {
    console.log(msg);
  }
}
// usage
Utility.log('Call me');
Utility.error('maybe');

//使用import 命名namespace别名
namespace Shapes {
    export namespace Polygons {
        export class Triangle { }
        export class Square { }
    }
}
import polygons = Shapes.Polygons;
let sq = new polygons.Square(); // Same as "new Shapes.Polygons.Square()"
```
## 声明文件 `declare`
TypeScript 作为 JavaScript 的超集，在开发过程中不可避免要引用其他第三方的 JavaScript 的库。虽然通过直接引用可以调用库的类和方法，但是却无法使用TypeScript 诸如类型检查等特性功能。为了解决这个问题，需要将这些库里的函数和方法体去掉后只保留导出类型声明，而产生了一个描述 JavaScript 库和模块信息的声明文件。通过引用这个声明文件，就可以借用 TypeScript 的各种特性来使用库文件了。
```typescript
declare var jQuery: (selector: string) => any;

jQuery('#foo');
```