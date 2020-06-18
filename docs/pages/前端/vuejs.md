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

## mixins
分发 Vue 组件中的可复用功能。一个混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项。