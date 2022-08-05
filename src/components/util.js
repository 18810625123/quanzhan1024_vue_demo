import md5 from 'js-md5'
import {Toast} from 'vant'
import {v1 as uuidv4} from "uuid";

String.md5 = md5


export function toast(t, v) {
    if (t == 'success') {
        Toast.success(v);
    } else if (t == 'error') {
        Toast.fail(v);
    }
}

export function merge_keys(obj, fields) {
    fields.forEach(function (field) {
        var _obj = obj[field]
        if (_obj) {
            for (var _obj_k in _obj) {
                obj[`${field}__${_obj_k}`] = _obj[_obj_k]
            }
        }
    })
    return obj
}

function fixed(v, method = '~') {
    if (v === undefined || v === null || v === '') return ''
    var precision = 4
    if (v === 0 || v === '0') return new Decimal(0).toFixed(precision)
    // 保持精度并四舍五入~
    // 保持精度并向上取整+
    // 保持精度并向下取整-
    if (method == '~') return new Decimal(v).toFixed(precision)

    var result = new Decimal(v)
    var [v1, v2] = v.toString().split('.')
    var last = '0'
    if (v2 != undefined && v2[precision] != undefined) last = v2[precision]
    var unit = 1 / 10 ** precision

    if (last >= '5') {
        if (method == '+') {
            return new Decimal(v).toFixed(precision)
        } else if (method == '-') {
            return new Decimal(v).minus(unit).toFixed(precision)
        }
    } else if (last == '0') {
        return new Decimal(v).toFixed(precision)
    } else {
        if (method == '+') {
            return new Decimal(v).add(unit).toFixed(precision)
        } else if (method == '-') {
            return new Decimal(v).toFixed(precision)
        }
    }

}


// 以下是 自定义工具方法
Number.prototype.to_items = function () {
    var num = Math.ceil(this)
    var arr = []
    for (var i = 0; i < num; i++) {
        arr.push(i)
    }
    return arr
}

Array.query_index = function (obj) {
    this.forEach(function (a, i) {
        if (obj == a) return i
    })
    return -1
}

// json转数组
Array.json_to_arr = function (json) {
    var arr = []
    for (var key in json) {
        json[key].key_ = key
        arr.push(json[key])
    }
    return arr
}

Array.prototype.get_label = function (value) {
    var arr = this
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].value == value) {
            return arr[i].label
        }
    }
    console.log(`错误！！：没有找到这个value的label: ${value}`)
    return null
}

// 生成随机数
String.random = function (l) {
    var str = 'AaBbCcDdEeFfGgHhIiJjKkOoPpQqRrXxTtUuVvWwXxYyZz0123456789'
    var hash = ''
    for (var i = 0; i < l; i++) {
        hash += str.charAt(Math.floor(Math.random() * 40))
    }
    return hash
}


Date.prototype.seconds_remaining = function () {
    var senconds = parseInt((this.getTime() - new Date().getTime()) / 1000)
    if (senconds <= 0) return {
        str: '0天 00:00:00 （已过时间）',
        senconds: senconds
    }
    var d = parseInt(senconds / (3600 * 24))
    var h = parseInt(senconds / 3600) % 24
    var m = parseInt((senconds % 3600) / 60)
    var s = senconds % 60
    return {
        str: `${d}天 ${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`,
        senconds: senconds
    }
}

Date.prototype.offset = function (hour = 0) {
    return new Date(this.getTime() + hour * 3600 * 1000)
}

var time_zone = -new Date().getTimezoneOffset() / 60

Date.prototype.format = function (format, offset = 'locale') {
    var that = this
    if (offset == '+') {
        that = this.offset(time_zone)
    } else if (offset == '-' || offset == 'utc') {
        that = this.offset(-time_zone)
    } else if (offset == 'locale') {
        that = this.offset(0)
    } else if (typeof (offset) == 'number') {
        that = this.offset(offset)
    } else {
        throw(`不支持的offset: ${offset}`)
    }
    if (format == 'datetime') {
        format = 'yyyy-MM-dd hh:mm:ss'
    } else if (format == 'time') {
        format = 'hh:mm:ss'
    } else if (format == 'date') {
        format = 'yyyy-MM-dd'
    } else if (format == 'month') {
        format = 'yyyy-MM'
    } else if (format == 'week') {
        format = 'yyyy-第WW周'
    } else if (format == 'm') {
        return parseInt(that.getTime() / 1000)
    } else if (format == 'ms') {
        return that.getTime()
    } else if (format == 'obj') {
        return that
    } else {
        // throw(`不支持的format: ${format}`)
    }
    var date = {
        "M+": that.getMonth() + 1,
        "d+": that.getDate(),
        "h+": that.getHours(),
        "m+": that.getMinutes(),
        "s+": that.getSeconds(),
        "q+": Math.floor((that.getMonth() + 3) / 3),
        "S": that.getMilliseconds()
    }
    if (/(y+)/i.test(format)) format = format.replace(RegExp.$1, (that.getFullYear() + "").substr(4 - RegExp.$1.length))
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (date[k]) : (("00" + date[k]).substr(("" + date[k]).length)))
        }
    }
    return format
}

class CustomDate {
    constructor(v = 'now') {
        this.v = v
        if (v == 'now') {
            this.date = new Date()
        } else if (typeof v == 'string') {
            if (v.includes('T')) {
                v = v.replace(/\//g, '-')
                v = v.replace(/\\/g, '-')
            } else {
                v = v.replace(/-/g, '/')
            }
            this.date = new Date(v)
        } else if (typeof v == 'number') {
            if (v < 100000000000) v = v * 1000
            this.date = new Date(v)
        } else if (v instanceof Date) {
            this.date = v
        } else if (v == undefined || v == '' || v == null) {
            this.date = null
        } else {
            this.date = new Date(v)
        }
    }

    format(type, offset) {
        if (this.date) {
            return this.date.format(type, offset)
        } else {
            return this.date
        }
    }

    addDay(day) {
        this.date = new Date(this.date.getTime() + 3600 * 24 * 1000 * day)
        return this
    }
}

window.CustomDate = CustomDate


// 数组删除
Array.prototype.removes = function (arr, field_name) {
    var old_arrs = this
    arr.forEach(function (a, b, c) {
        var count = old_arrs.length - 1
        for (var i = count; i >= 0; i--) {
            var old = eval(`old_arrs[i].${field_name}`)
            console.log(`old_arrs[${i}].${field_name}=${old}a=${a}`)

            if (old == a) {
                old_arrs.splice(i, 1)
                console.log(`删除 ${a}`)
            }
        }
    })
}

// 数组删除
Array.prototype.delete_at = function (i) {
    var item = this.splice(i, 1)
    return item
}

// 数组删除
Array.prototype.delete_custom = function (func) {
    var arr = this
    for (var i = arr.length - 1; i >= 0; i--) {
        if (func(arr[i]) == true) {
            arr.delete_at(i)
        }
    }
    return arr
}

// 数组删除
Array.prototype.delete = function (arr) {
    var list = this
    var delete_arr = []
    var new_arr = []
    if (typeof (arr) == 'string') {
        delete_arr = [arr]
    } else {
        delete_arr = arr
    }
    delete_arr.forEach(function (a) {
        for (var i = (list.length - 1); i >= 0; i--) {
            if (list[i] == a) {
                list.splice(i, 1)
                new_arr.push(list[i])
            }
        }
    })
    return list
}

// 数据清空
Array.prototype.clear = function (func) {
    if (typeof func == 'function') {
        for (var i = this.length - 1; i >= 0; i--) {
            if (func(this[i]) == true) this.delete_at(i)
        }
    } else {
        for (var i = this.length - 1; i >= 0; i--) {
            this.delete_at(i)
        }
    }
    return this
}

// 多维数组转1维数组
Array.prototype.to_arr = function (new_arr = []) {
    this.forEach(function (a) {
        if (Array.isArray(a)) {
            a.to_arr(new_arr)
        } else {
            new_arr.push(a)
        }
    })
    return new_arr
}

// 一维数组转二维数组
Array.prototype.to_arrs = function (num) {
    var list = this
    var arrs = []
    var size = list.length
    var n = 0
    if (num > size) size = num
    for (var i = 0; i < size; i++) {
        arrs[i] = []
        for (var j = 0; j < num; j++) {
            arrs[i][j] = list[n]
            n += 1
            if (n == size) {
                break
            }

        }
        if (n == size) {
            break
        }

    }
    return arrs
}

// 获取数据的一部分
Array.prototype.get_a_to_b = function (a, b) {
    var arr = []
    for (var i = a; i <= b; i++) {
        arr.push(this[i])
    }
    return arr
}

// 填满最后一行
Array.prototype.fill_last_line = function (data) {
    var arrs = this
    if (typeof (arrs) != 'object') {
        // console.error(`填满最后一行方法：\n必须是一个二维数组`)
        return arrs
    }
    if (arrs.first().length <= 1) {
        // console.log(`填满最后一行方法：\n第一行只有个${arrs.first().length}元素,无需填充`)
        return arrs
    }
    var buqi = arrs.first().length - arrs.last().length
    for (var i = 0; i < buqi; i++) {
        arrs.last().push(data)
    }
    return arrs
}

// 获取数组第1个元素,或前几个元素
Array.prototype.first = function (num) {
    if (num) {
        var arr = []
        for (var i = 0; i < num; i++) {
            arr.push(this[i])
        }
        return arr
    } else {
        return this[0]
    }
}

// 获取数组最后一个元素,或最后几个元素
Array.prototype.last = function (num) {
    if (num) {
        var arr = []
        for (var i = (this.length - num); i < this.length; i++) {
            arr.push(this[i])
        }
        return arr
    } else {
        return this[this.length - 1]
    }
}



// 时间格式化方法
var date_str = function (v, format, offset = 'locale') {
    if (typeof (v) == 'number' && v < 100000000000) v = v * 1000
    if (v === undefined || v === '' || v === null) return ''
    return new CustomDate(v).format(format, offset)
}


function isBlank(o) {
    if (o === '' || o === undefined || o === null) return true
    if (Array.isArray(o) && o.length == 0) return true
    if (typeof (o) == 'object') {
        for (var k in o) {
            return false
        }
        return true
    }
    return false
}

function obj_type(obj) {
    var type = typeof (obj)
    if (obj == undefined) return 'exit'
    if (type == 'function') return type
    if (obj == null || type == 'string' || type == 'number') return 'other'
    if (typeof (obj) == 'object') {
        if (Array.isArray(obj)) return 'array'
        return 'object'
    }
    return 'other'
}

function remove_blank(obj) {
    var type = typeof (obj)
    if (type == 'object') {
        for (var k in obj) {
            if (isBlank(obj[k])) {
                delete obj[k]
            } else {
                remove_blank(obj[k])
            }
        }
    } else if (type == 'array') {
        for (var i = 0; i < obj.length; i++) {
            if (isBlank(obj[i])) {
                obj.splice(i, 1)
            } else {
                remove_blank(obj[i])
            }
        }
    }
}

function fullScreen(el) {
    el = el ? el : document.documentElement
    if (el.requestFullScreen) {
        el.requestFullScreen()
        return
    }
    if (el.webkitRequestFullScreen) {
        el.webkitRequestFullScreen()
        return
    }
    if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen()
        return
    }
    if (el.msRequestFullscreen) {
        el.msRequestFullscreen()
        return
    }
}

function exitScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen()
        return
    }
    if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
        return
    }
    if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
        return
    }
    if (document.msExitFullscreen) {
        document.msExitFullscreen()
        return
    }
}
