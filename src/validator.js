function Validator(form, options) {
  this.form = form;                 // 表单元素

  this._data = {};                  // 通过验证策略字段值的集合
  this._options = options || {};    // 选项
  this._container = {};             // 存放验证策略函数的容器
  this._cache = {};                 // 缓存容器
}


Validator.prototype._error = function(err) {
  throw new Error(err);
};

Validator.prototype._isArray = function(obj) {
  return Array.isArray ?
    Array.isArray(obj) :
    Object.prototype.toString.call(obj) === '[object Array]'

};

Validator.prototype.add = function(name, validates) {
  var
    form = this.form,
    el = form[name],
    container = this._container,
    options = this._options,
    className = options.className || '',
    type = options.type || 'SPAN',
    text = options.text || '',
    ISARRAY = options._isArray,
    ERROR = this._error;


  // 验证
  el || ERROR(name + '字段不存在')
  validates || ISARRAY(validates) || validates.length < 1 || ERROR(name + '字段未指定验证策略')

  // 创建错误消息元素
  el.insertAdjacentHTML('afterend', '<' + type + ' class="' + className + '">' + text + '</' + type + '>')
    
  // 覆盖已存在的字段验证策略
  container[name] = [];

  // 封装并存放新的验证策略函数
  for (var i = 0, validate; validate = validates[i++];) {
    var
      arg = validate[0].split(':'),
      strategy = arg.shift(), // 验证策略名
      strategyFunc = this[strategy], // 验证策略函数
      err = validate[1], // 错误消息
      self = this;

    // 验证
    strategyFunc || ERROR(name + '字段的' + strategy + '验证策略未定义')

    // 存放验证策略
    container[name].push((function(arg, err, strategyFunc) {
      return function() {
        // 合并参数
        var args = [].concat(el.value, arg, err);
        // 验证策略未通过将返回错误消息
        return strategyFunc.apply(self, args)
      }
    })(arg, err, strategyFunc))
  }

  return this
};

Validator.prototype.result = function(name) {
  var
    form = this.form,
    data = this._data,
    container = this._container,
    cache = this._cache,
    ERROR = this._error,
    pass = true;

  

  // 分水岭
  if (typeof name === 'string') {
    // 验证
    name || form[name] || ERROR(name + '字段未注册')

    cacheProxy(name)
  } else {
    for (var key in container) {
      cacheProxy(key)
    }
  }

  function cacheProxy(name) {
    var
      el = form[name],
      value = el.value,
      cacheName = cache[name] = cache[name] ||  {},
      err;

    if (cacheName[value]) {
      // 读取缓存并更新错误消息
      updateError(el, cacheName[value])
    } else {
      // 缓存错误消息和对应的值
      (err = validateIteration(el, name)) && (cacheName[value] = err)
    }

    // 存储字段值
    data[name] = value
  }

  function validateIteration(el, name) {
    var
      strategyFns = container[name],
      err;

    //迭代调用验证策略函数    
    for (var i = 0, fn; fn = strategyFns[i++];) {
      err = fn();
      // 清空错误消息
      clearError(el)
      // 一旦产生错误消息就终止迭代并更新错误消息
      if (err) {
        return updateError(el, err)
      }
    }
  }

  function updateError(el, err) {
    el.nextElementSibling.innerText = err;
    pass = false
    return err
  }

  function clearError (el) {
    el.nextElementSibling.innerText = '';
  }

  return pass
};

Validator.prototype.getData = function() {
  var 
    data = this._data,
    ISARRAY = this._isArray,
    result = JSON.parse(JSON.stringify(data))

  if (arguments.length < 1) {
    return result
  }

  for (var i = 0, e; e = arguments[i++];) {
    if (e) {
      delete result[e]  
    }
  }
  
  // 清除缓存
  this._cache = {}

  return result
}

Validator.prototype.notEmpty = function(val, err) {
  if (val === '') {
    return err
  }
};

Validator.prototype.min = function(val, length, err) {
  if (val.length < length) {
    return err
  }
};

Validator.prototype.max = function(val, length, err) {
  if (val.length > length) {
    return err
  }
};

Validator.prototype.test = function(val, pattern, err) {
  reg = this._insidePattern[pattern]

  if(!reg) {
    this._error(pattern + '正则未定义')
  }

  if (typeof reg === 'string') {
    p = reg.replace(/^\/|\/.*$/g, '')
    f = reg.match(/[igm]$/)
    reg = new RegExp(p, (f ? f[0] : undefined))
  }

  if (!reg.test(val)) {
    return err
  }
};

Validator.prototype.equal = function (val, name, err) {
    if (val !== this.form[name].value) {
        return err
    }
}

// 正则
Validator.prototype._insidePattern = {
  email: /^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/,
  phone: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/,
  id: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
  qq: /^[1-9][0-9]{4,10}$/,
  // 微信号
  weChat: /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/,
  zipCode: /^[1-9]d{5}(?!d)^/
}


Validator.prototype.pattern = function (name, pattern, isCover) {
  var insidePattern = this._insidePattern;

    if (!isCover) {
      for (var key in insidePattern) {
        if (key === name) {
          console.log('警告:' + name + '正则已存在');
          return this
        }
      }
    }

    insidePattern[name] = pattern;
    return this

}