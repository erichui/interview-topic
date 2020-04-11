---
title: webpack 相关
---

## `webpack` 运行机制

### 运行流程
> 初始化配置参数 --> 绑定事件钩子回调 --> 确定入口 `entry` 逐一遍历 --> `loader` 编译文件 --> 输出文件

1. `webpack` 会读取命令行传入的参数以及本地的 `webpack.config.js` 配置，初始化构建参数
2. 执行配置文件中的插件部分，生成插件实例，为 `webpack` 事件流挂上这些自定义钩子。
3. 读取配置中的入口，遍历所有文件。
4. 使用该文件类型所对应的 `loader`进行文件编译，之后将编译好的文件生成抽象语法书 `AST`，然后分析文件依赖，加载依赖模块并重复上述处理。
5. 所有文件编译编译和转化完成，输出结果。

### 插件 `plugin`
> `webpack` 就像一系列的生产线，完成一系列的处理才能将源文件转化成输出结果。每条生产线的指责都是单一的，同时多个产险之间可能还存在上下游依赖，所以只有完成当前处理才能交给下一个流程。插件 `plugin` 会在特定时机对产线上的资源做处理。`webpack` 在运行过程中会广播事件，插件只需监听他所关心的事件，就能加入这条产线，改变产线运作的结果。<br />
> 插件的本质就是一个带有 `apply` 方法的 `class`，或者是原型上有 `apply` 方法的构造函数。

``` js
// 其中 options 为配置文件中调用插件时传递的参数 new MyPlugin(options)
	MyPlugin(options) {
		this.options = options
	}
	MyPlugin.prototype.apply = function (compiler) {
	}
```

### `loader`
> `loader` 可以理解为文件转换器，比如样式转换 `style-loader/css-loader/sass-loader`，编译文件 `babel-loader` `ts-loader` `vue-loader` <br />
> `loader` 的执行顺序在数组中是反着的，类似于栈的结构。

``` js
// loader 的本质就是一个普通方法，参数为文件的字符串内容
	MyLoader(constent: string) {
		const str = 'my loader'
		return `${str}${content}`
	}
```

## `webpack` 优化

### 缓存
> 每次构建都会把所有文件编译一次，影响构建速度。<br />
> 大部分 `Loader` 都提供了 `cache` 的配置项，可以通过设置开启缓存。

``` js
	// babel-loader 转译阶段可以开启缓存
	options: {
      cacheDirectory: true
    }
    
    // 代码压缩阶段也可以开启缓存
    new UglifyJsPlugin({
	   cache: true,
	   parallel: true,
	 })
```

### 多核
> `webpack` 是运行在 `node` 之上的单线程模型，所以需要处理的任务要一个一个操作。<br />
> `HappyPack` 可以将任务拆分为多个子进程并发执行，子进程处理完以后再将结果发送给主进程，可以大大提升构建速度。`HappyPack` 只能用来处理 `Loader`<br />
> 对于一些编译代价昂贵的 `webpack` 插件，一般都也会提供 `parallel` 这样的选项来开启多核编译。比如上面提到的代码压缩。

### 抽离

> 对于一些不常变动的静态资源，比如常见的 `Vue/React` 全家桶：`vue/vuex/vue-router`，工具库 `lodash`，高的地图 `map`等。因为他们不经常变动，输入和输出都是一样的，所以这些依赖不应该被集成到每一次的构建中。

1. `webpack-dll-plugin`：在**首次**构建的时候会将这些静态依赖单独打包，后续只需引用这次打包好的依赖即可，类似于预编译。
2. 外部扩展 `externals`：不会讲某些 `import` 的包打包到 `bundle` 中，而是在运行时 `runtime` 再去从外部获取这些扩展依赖，大多会使用 `CDN` 的方式在 `HTML` 中引用。

``` js
// 其中 key 是 import 引入的名字，value 是 CDN 提供的全局变量名
// webpack 会将其编译为 module.exports.key = window.value
	externals: {
	  "vue": "Vue",
	  "vuex": "Vuex",
	  "vue-router": "VueRouter",
	}
``` 

