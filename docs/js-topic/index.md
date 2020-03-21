---
title: JS 相关
---

## 判断变量的类型
> `typeof` 的原理，与 `instanceof`, `Object.prototype.toString.call` 的区别

- `JS` 底层在存储变量的时候，会在其机器码的低位存储类型信息。`typeof` 据此判断一个变量的类型。多用于判断基本数据类型。

``` js
	typeof ''    // string
	typeof null  // object
	typeof {}    // object
	typeof () => {} // function
```

`ES6` 中的 `let` 和 `const` 会形成**暂时性死区**，所以 `typeof` 不再是一个百分之百安全的操作。

```js
	typeof test  // ReferenceError
	let test = 'test'
```

- `a instanceof A` 多用于判断 `A` 操作数的原型对象 `A.prototype` 是否出现在 `a` 操作数的原型链上 。原理是判断 `a.__proto__` 沿着作用域链能否找到 `A.prototype`。原理如下：

```js
	const _instanceof = (leftOperand, rightOperand) => {
		let _protoLeft = leftOperand.__proto__  // 隐式原型
		const protoRight = rightOperand.prototype // 原型
		while(true) {
			if (_protoLeft === null) return false
			if (_protoLeft === protoRight) return true
			_protoLeft = _protoLeft.__proto__
		}
	}
```

- `toString` 可以精准的判断所有数据类型，输出形式为 `[object Type]`, 其中 `Type` 为变量的内置类型。

## 精度丢失问题
> `0.1 + 0.2 !== 0.3`

数字会先转成二进制然后再进行运算，把结果再转成十进制。`JS` 使用 64 位双精度浮点数存储数字，转化成二进制时长度可
能超出精度的表示范围（比如无限循环了），就会造成精度丢失的问题。