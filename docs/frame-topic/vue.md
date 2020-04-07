---
	title: 'Vue 相关'
---

## 问答

### 如何检测数组的变化

- 在数组实例上加了一层代理原型，代理原型重写了数组的变异方法（会改变数组本身，eg: `push/pop/shift/unshift/splice/sort/reverse`）
- 当执行这些变异方法的时候，首先会使新增的元素（eg：`push/unshift/splice`）变成响应式的，最后触发依赖更新。

	
### 为什么采用异步渲染？？
> `re-render` 的过程：
>> 渲染函数 `render` 中依赖的 `data` 数据更新 -> 触发 `setter` -> `watcher.update` -> 触发 `rener` -> 生成新的 `vnode` -> `dom diff` -> 最终的 `vnode`

- `Vue` 在更新虚拟 `DOM` 时是异步更新的。在同一个事件循环中把所有的数据变更放在一个缓冲队列里，如果一个 `watcher` 多触发多次，只会被推入队列一次。
- 好处：在缓冲队列中避免收集相同的 `watcher`，避免 `Vue` 内部不必要的计算和 虚拟 `DOM/VNode` 的操作成本， 即上述 `render` 到虚拟 `DOM` 的过程只进行一次。

### 组件中的 `data` 为什么必须是一个函数
- 

### 父子组件生命周期的调用顺序

### `nextTick` 的原理
	
> 调用栈，事件循环，任务队列。
	
> 任务队列分为：宏观队列 - `(macro)task` 和微观队列 - `microtask`
	
> 当调用栈为空时，会先清空 `microtask` 里面的所有任务，然后从 `task` 中取一个任务执行。在两个不同的 `task` 中间可能穿插着 `UI` 的重渲染，所以最好是在 `microtask` 中把需要更新的数据都更新掉，这样只有一次重渲染就能得到最新的 `DOM`，下面定义的执行函数 `fn` 最好是在 `microtask` 中。
	
> `microtask`： `Promise.resolve().then/catch/finally` 会将回调放入微观队列
	
> `(macro)task`: `setImmediate` > `MessageChannel` > `setTimeout`
>> 优先选用 `setImmediate`，因为它不用像 `setTimeout/setInterval` 频繁的做时间检测。`MessageChannel` 的实例有两个端口，选取其中任意一个端口监听它的 `onmessage` 事件，另外一个端口调用 `postMessage` 的时候，`onmessage` 的回调就会放在宏观队列中。`setTimeout` 的回调回放在宏观队列中。
	
``` js
	const channel = new MessageChannel()
	const port1 = channel.port1
	const prot2 = channel.port2
	port1.onmessage = fn
	port2.postMessage(xxx)
``` 

在同一个事件循环中会把 `nextTick` 的所有回调函数放到一个缓冲队列中，之前定义有一个函数 `fn`，该函数触发的时候会遍历执行缓冲队列。然后把函数 `fn` 放到任务队列中，然后在下一次事件循环前，从任务队列中执行 `fn`。
	
### `Vue.set/prototype.$set Vue.delete/prototype.$delete` 的实现

1. `set`: 
	- 对于 `target` 是数组，直接调用变异方法 `splice`
	- 对于 `target` 是对象的
		- `key in target && !key in Object.prototype` 则直接赋值即可
		- `key` 不在 `target` 上，则判断 `target` 是否是响应式的，即是否有 `target.__ob__` 属性存在
			- 如果不存在，即 `target` 不是响应式的，则直接赋值即可
			- 如果存在，即 `target` 是响应式的，则需要把 `val` 转化成响应式的，对新值收集依赖，同时触发 `target` 的依赖。
2. `delete`: 和 `set` 处理类似
	- 对于 `target` 是数组，直接调用变异方法 `splice`
	- 对于 `target` 是对象的，直接 `delete target[key]`
		- 如果 `target` 不是响应式的直接 `return`
		- 是响应式的则触发 `target` 收集到的依赖

### `watch deep: true` 是如何实现的

> 当监听的属性值是一个对象的时候，只有引用改变才会触发回调。<br />
> 在引用不变，但属性值有修改的情况下，想要触发依赖回调就要用 `deep: true`

- 实现：递归的对属性值进行取值，触发每个属性值的 `getter`，然后收集当前的观察者 `watcher`。这样当属性值被改变的时候，会触发属性值当 `setter`，然后触发观察者依赖。
- 当属性是是数组 `arr` 的时候，
	- 如果想要监听数组变异方法（eg：`push`）的调用，不需要 `deep: true`，因为变异方法的调用会自动触发观察者依赖。
	- 如果想要监听 `arr[0] = xxx` 的操作，还是要设置 `deep: true`，递归的对属性取值。
	
### `computed` 的特点和原理
特点：

- 结果缓存，多次使用计算属性，只会进行一次求值。
- 只有依赖的响应式属性变化后，才会重新求值

原理：

- 首先会生成计算属性的观察者 `computedWathcer`，计算属性的观察者和其他观察者的区别：
	- 初始定义观察者时不会进行求值 `get`，而是定义一个 `dep`，用来收集计算属性的依赖。
	- `dep` 中一般存放的都是渲染函数的观察者 `renderWathcer`，也有可能会存放其他依赖了该计算属性的观察者。
- 然后把计算属性的 `key` 变成访问器属性，其中 `getter` 执行的时候会调用 `computedWatcher. depend ` 方法收集计算属性的依赖，然后执行 `computedWatcher.evaluate` 方法对计算属性初始求值，并把结果缓存起来。当多次使用计算属性，即 `getter` 被多次执行的时候 `evaluate` 不会进行求值操作，会直接返回初始时缓存的结果。
- 当计算属性依赖的响应式属性变化的时候，会触发渲染属性的观察者 `computedWatcher.update`，计算属性会重新求值，如果新值结果相对于旧值有变化，则会触发计算属性观察者的依赖 `dep.notify`，通常渲染函数的观察者会被触发。
 


### 事件绑定的原理
### `v-if v-show` 的区别，

- 一个组件应用 `v-if/show` 且值为 `false` 的时候，组件的 `created/mounted` 生命周期是否会执行。

### 为什么 `v-for v-if` 不能连用
### `v-modal` 的实现原理，如何自定义 `v-modal`
### `v-on` 绑定一个方法 `fn` `fn('xx')` 的区别
### 描述组件的渲染和更新过程
### 如何用 `vnode` 描述一个 `DOM` 结构
### `diff` 算法的原理以及时间复杂度
### 模版编译的原理
### `vue` 中常见的性能优化
### 为什么要使用异步组件
### `keep-alive` 的理解
### 实现 `hash` 和 `history` 路由



## 源码梳理
>> init -> compile -> render -> patch
> 
> init: 调用构造函数
> 
> compile：将模版（`template`）编译成渲染函数
> 
> render: 执行渲染函数生成虚拟 `DOM` 即 `vnode`
> 
> patch: 生成真实 `DOM` 的过程

### `VUE` 编译好的版本提供的功能：
 - 给原型对象添加属性和方法
 - 全局 `API`，在 构造函数 `VUE` 上添加静态属性和方法
 - 在构造函数 `VUE` 上添加平台相关的属性

### 使用编译好的版本，调用构造函数 `new Vue(options)`
 - `options` 规范化
 - `options` 合并
 - 初始化

### 响应式系统的原理
- 首先在 `Vue` **实例**上 `proxy` 代理 `vm._data` 的访问，其中 `vm._data` 是 `options.data` 的引用
- 递归的调用 `observe` 在 `data` 对象上添加 `Observe` 实例，其中 `Observe` 的功能是：使被观察的属性变成访问器属性，同时在 `getter` 中收集依赖（`watcher` 对属性求值，触发改拦截器），在 `setter` 中触发依赖响应。
	- 对于类型是数组的属性，触发依赖是在重写的变异方法中。
	
### 依赖收集的过程
1. 渲染函数的观察者
	 - 用户自定义渲染函数，或者通过 `template/el` 生成渲染函数 --> 调用 `new Watcher`
	 - `Watcher` 把被观察者转换成取值函数 `getter`，调用 `pushTarget` 设置 `Dep.target`，然后调用 `getter` 取值并触发属性的拦截器收集依赖。


