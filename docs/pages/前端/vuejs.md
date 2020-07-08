---
title: vue笔记
date: 2020-06-18
sidebarDepth: 2
tags:
 - vue
categories:
 - javaScript
 - 前端
---

# vue笔记
- [vue笔记](#vue笔记)
  - [vue指令缩写](#vue指令缩写)
  - [props 和 data 区别](#props-和-data-区别)
  - [mixins](#mixins)
  - [inheritAttrs + `$attrs` + `$listeners`](#inheritattrs--attrs--listeners)
## vue指令缩写
<table>
<tr><th>指令</th><th>缩写</th></tr>
<tr><td>v-on</td><td>@</td></tr>
<tr><td>v-bind</td><td>:</td></tr>
<tr><td>v-slot</td><td>#</td></tr>
</table>

-----------------
## props 和 data 区别

1. 共同点：两者都作为组件的数据使用。
2. 不同点：props可以使父组件数据传入子组件，而data不能。
```js

Vue.component('temp-data', {
  data:['text'],
  template: '<li>{{text}}</li>'
})

Vue.component('temp-props', {
  props: ['text'],
  template: '<li>{{text}}</li>'
})
```
```html
<div>
<temp-data></temp-data>
//temp-props可以传数据给子组件
<temp-props text="父组件传的数据"></temp-props>
</div>
```
------------
## mixins
分发 Vue 组件中的可复用功能。一个混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项。

-----------
## inheritAttrs + `$attrs` + `$listeners`
1. inheritAttrs [bool] [默认值：true] 
   - 当inheritAttrs=ture时，父组件传入的属性值attr1，在子组件中props中未定义时，attr1会绑定在子组件的根元素上；
   - 当inheritAttrs=false时，父组件传入的属性值attr1，在子组件中props中未定义时，attr1属性失效。
2. `$attrs` 包含了父组件属性传入子组件，而子组件props中未定义的属性。（class style除外，这2属性直接作用在子组件根元素上）
3. `$listeners` 
   - [官方解释] 包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 v-on="`$listeners`" 传入内部组件；
   - [换位理解] 孙子组件触发的事件可以通过父组件使用 v-on="`$listeners`"，将此事件传入祖父组件中。

*总结：*`$attrs`将属性从上往下传入孙子组件中，`$listeners` 将事件从下往上传入祖父组件中。