<!--
 * @Author: your name
 * @Date: 2020-06-18 10:28:36
 * @LastEditTime: 2020-07-24 10:12:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \FrontEnd\js\vue\blog-vuepress\docs\pages\前端\vuejs.md
--> 
---
title: vue笔记
date: 2020-06-18
sidebarDepth: 2
tags:
 - Vue
categories:
 - javaScript
 - 前端
---
# vue笔记
- [vue笔记](#vue笔记)
  - [vue指令缩写](#vue指令缩写)
  - [v-bind](#v-bind)
  - [slot插槽](#slot插槽)
  - [props 和 data 区别](#props-和-data-区别)
  - [mixins](#mixins)
  - [ref](#ref)
  - [inheritAttrs + `$attrs` + `$listeners`](#inheritattrs--attrs--listeners)
## vue指令缩写
<table>
<tr><th>指令</th><th>缩写</th></tr>
<tr><td>v-on</td><td>@</td></tr>
<tr><td>v-bind</td><td>:</td></tr>
<tr><td>v-slot</td><td>#</td></tr>
</table>

-----------------
## v-bind
- 当参数为变量时，使用v-bind
- 当参数为字面量时，不适用v-bind
```html
<div
  class="static"
  v-bind:class="{ active: isActive, 'text-danger': hasError }">
</div>
```
------------
## slot插槽
-  `<slot name="header"></slot>`具名插槽
-  `<slot v-bind:user="user">{{ user.lastName }}</slot>` 作用域插槽
```html
<a
  v-bind:href="url"
  class="nav-link"
>
  <slot></slot>
</a>

<navigation-link url="/profile">
  Your Profile
</navigation-link>

<!-- 具名插槽 -->
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>

<base-layout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>

<!-- 作用域插槽 -->
<span>
  <slot v-bind:user="user">
    {{ user.lastName }}
  </slot>
</span>

<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>
</current-user>
```
----------------
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
```js
var mixin = {
  created: function () {
    console.log('混入对象的钩子被调用')
  }
}

new Vue({
  mixins: [mixin],
  created: function () {
    console.log('组件钩子被调用')
  }
})
```
-----------
## ref
`ref`被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的`$refs`对象上。
- 如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素
- 如果用在子组件上，引用就指向组件实例
```html
<!-- `vm.$refs.p` will be the DOM node -->
<p ref="p">hello</p>

<!-- `vm.$refs.child` will be the child component instance -->
<child-component ref="child"></child-component>
```
-------------
## inheritAttrs + `$attrs` + `$listeners`
1. inheritAttrs [bool] [默认值：true] 
   - 当inheritAttrs=ture时，父组件传入的属性值attr1，在子组件中props中未定义时，attr1会绑定在子组件的根元素上；
   - 当inheritAttrs=false时，父组件传入的属性值attr1，在子组件中props中未定义时，attr1属性失效。
2. `$attrs` 包含了父组件属性传入子组件，而子组件props中未定义的属性。（class style除外，这2属性直接作用在子组件根元素上）
3. `$listeners` 
   - [官方解释] 包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 v-on="`$listeners`" 传入内部组件；
   - [换位理解] 孙子组件触发的事件可以通过父组件使用 v-on="`$listeners`"，将此事件传入祖父组件中。

*总结：*`$attrs`将属性从上往下传入孙子组件中，`$listeners` 将事件从下往上传入祖父组件中。