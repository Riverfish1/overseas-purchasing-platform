export default () => {
  /* eslint-disable */
  // 连字符转驼峰
  String.prototype.hyphenToHump = function () {
    return this.replace(/-(\w)/g, function () {
      return arguments[1].toUpperCase()
    })
  }

  // 驼峰转连字符
  String.prototype.humpToHyphen = function () {
    return this.replace(/([A-Z])/g, '-$1').toLowerCase()
  }

  // 日期格式化
  Date.prototype.format = function (format) {
    var o = {
      'M+': this.getMonth() + 1,
      'd+': this.getDate(),
      'h+': this.getHours(),
      'H+': this.getHours(),
      'm+': this.getMinutes(),
      's+': this.getSeconds(),
      'q+': Math.floor((this.getMonth() + 3) / 3),
      'S': this.getMilliseconds()
    }
    if (/(y+)/.test(format)) { format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length)) }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length === 1
          ? o[k]
          : ('00' + o[k]).substr(('' + o[k]).length))
      }
    }
    return format
  }

  function getState(_this) {
    const { pathname } = _this.props.location;
    const dataStr = sessionStorage.getItem('airuhua_' + pathname);
    console.log(dataStr);
    if (dataStr) {
      const data = JSON.parse(dataStr);
      console.log(data);
      setTimeout(() => {
        _this.setState(data.state);
        _this.props.form.setFieldsValue(data.search);
      }, 0);
    }
  }

  function existState(pathname) {
    return !!sessionStorage.getItem('airuhua_' + pathname);
  }

  function clearState(pathname) {
    sessionStorage.setItem('airuhua_' + pathname, null);
  }

  function setState(_this) {
    const { pathname } = _this.props.location;
    if (pathname) {
      let cacheData = sessionStorage.getItem('airuhua_' + pathname);
      if (!cacheData) cacheData = {};
      else cacheData = JSON.parse(cacheData);
      // 搜索表单
      cacheData.search = _this.props.form.getFieldsValue();
      // 状态
      cacheData.state = _this.state;
      sessionStorage.setItem('airuhua_' + pathname, JSON.stringify(cacheData));
    }
  }

  window.regStateCache = (target) => {
    target.prototype.componentWillMount = function() {
      getState(this);
    }
    target.prototype.componentWillUnmount = function() {
      setState(this);
    }
  }

  window.getCacheState = getState;
  window.existCacheState = existState;
  window.clearCacheState = clearState;
}
