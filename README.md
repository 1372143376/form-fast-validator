# Form-fast-validator [![npm](https://img.shields.io/badge/npm-v1.1.2-blue.svg)](https://www.npmjs.com/package/form-fast-validator) [![npm](https://img.shields.io/badge/IE-8+-green.svg)](https://www.npmjs.com/package/form-fast-validator) [![npm](https://img.shields.io/npm/l/express.svg)](https://www.npmjs.com/package/form-fast-validator) 

一个快速创建表单验证的策略库。


## 安装

```
npm install form-fast-validator --save
```

## 使用

### 基本

基本的 `HTML` 表单结构。

```html
  <form>
    <label>
      <span>用户名</span>
      <input type="text" name="username">
      <i class="fa fa-user icon"></i>
    </label>

    <!-- .... -->
    
    <label>
      <span>邮箱</span>
      <input type="text" name="email">
    </label>
    
    <button type="submit">注册</button>
  </form>
```

实例化 `Validator`，并将表单元素传入。

```javascript
var f = document.forms[0]

var validator = new Validator(f)
```

通过实例的 `.add()` 方法为每个字段注册验证策略。

```javascript
validator
  .add('username', [
      ['notEmpty', '用户名不能为空'],
      ['min:3', '至少3个字符'],
      ['max:10', '最多10个字符'],
  ])
  // ...
  .add('email', [
      ['notEmpty', '邮箱不能为空'],
      ['test:email', '格式不正确']
  ])
  // ...
```

在事件回调中，通过实例的 `.result()` 获取验证结果，`.getData()` 获取表单字段数据。


```javascript

// 获取每个字段的验证结果
f.oninput = function (e) {
   validator.result(e.target.name)
}

// 获取全部字段的验证结果
f.onsubmit = function (e) {
    e.preventDefault()

    if (validator.result()) {
        console.log(validator.getData('repeatPassword'))
    }
}
```

**现在，您可以到 [codepen.io](https://codepen.io/yeshimei/pen/GOyBRL) 查看这个简单的演示。**

### 自定义错误元素

`validator` 的第二个参数为一个选项对象，可自定义错误元素的 class、类型和默认文本。

**注意：错误元素会在添加验证策略时生成并插入到字段的后面。**

```javascript
var validator = new Validator(f, {
    className: '',  // class
    type: 'span',   // 元素类型
    text: ''        // 默认文本
  })
```



### 扩展内置正则库

`validator` 内置了一些常用的正则，可由 `._insidePattern` 属性访问，但通常不建议直接扩展，而是通过实例的 `.pattern()` 方法。因为，它提供了一个命名冲突的检查机制。

它接受三个参数：

- **name：** 正则的名称。

- **pattern：** 正则表达式。

- **isCover=false** - 可选。如果添加的正则已存在，则会在浏览器上发出一个警告信息。指定为 `true` 时，将会强制覆盖已存在的正则（包括内置）。


```javascript
validator
  .pattern('username', /^[0-9a-zA-Z_]+$/)
  .pattern('password', '^[0-9a-zA-Z_]+$')
```

所有内置和已扩展的正则都可以作为实例的 `.test()` 验证策略的中间参数使用。

```javascript
validator
  .add('username', [
      // ...
      ['test:username', '只能包含数字、字母和下划线']
  ])
```

### 扩展验证策略

如果要扩展验证策略，可以直接在 `validator.prototype` 上或者 `实例`上添加方法，每个方法都接受两个必要的参数

- **value**： 用户在字段里输入的值（第一个参数）
- **err**:    用户注册验证策略时自定义的错误消息（最后一个参数）
- **arg1, ...**: 可选的中间参数（放在中间的若干个参数）

```javascript
validator.is = function (val, arg1, err) {
    if (val !== arg1) {
    // 必须返回错误消息，作为函数的结束
        return err
    }
}
``` 

## API


## Validator 构造器

- new Validator(form <Element>, options <object>)

## validator 实例化对象

### 工具方法

- **add(name <string>, validator <array>)：** 添加验证策略
- **pattern(name <string>, pattern <regexg|string>, isCover? <boolean>)：** 添加正则
- **result(name? <string>)：** 获取验证结果
- **getData(ignoreName1? <string>, ...)：** 获取表单字段数据

### 策略方法

策略方法并不能直接使用，而是在注册验证策略时已字符串的形式指定。而验证策略的中间参数必须在后面加一个 `:` 作为分隔符。

**注意：中间参数的值只能是字符串**

```javascript
validator
  .add('username', [
      // test -> 需要使用的策略方法
      // :username -> 中间自定义参数
      ['test:username', '只能包含数字、字母和下划线']
  ])
```

- **notEmpty()：** 字段是否为空
- **min(length)：** 最小字段
- **max(length)：** 最大字段
- **equal(name)：** 是否匹配某个字段值
- **test(insideRegexpName)：** 正则验证。此方法只接受内置或已扩展的正则名


## insidePattern 内置正则库

- **email：** 邮箱
- **phone：** 国内手机号
- **id：** 18 位身份证号
- **qq：** QQ号
- **weChat：** 微信号
- **zipCode：** 邮政编码

## Notes

无


## License

 [MIT](License) 
