---
title: vuex笔记
date: 2020-07-13
sidebarDepth: 2
tags:
 - Vue
 - Vuex
categories:
 - javaScript
 - 前端
---

# vuex笔记
![](https://cdn.jsdelivr.net/gh/shuhaiwen/image-host/Img/vue/vuex.png "vuex流程")

## state
- 在计算属性中获取state
```js
// 创建一个 Counter 组件
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return store.state.count
    }
  }
}
```
- 根实例中注册 store 
```js
Vue.use(Vuex)
const app = new Vue({
  el: '#app',
  // 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
  store,
  components: { Counter },
  template: `
    <div class="app">
      <counter></counter>
    </div>
  `
})
```