import axios from 'axios'
// import qs from 'qs'
import store from '../store'
import router from '../router'
import {v1 as uuidv4} from "uuid";
// 七牛云
import * as qiniu from 'qiniu-js'
import {Notify} from 'vant';


import env from '../../env'

console.log(`NODE_ENV:${process.env.NODE_ENV}`)
var current_env = env[process.env.NODE_ENV]

class BaseServer {

    constructor(server_root_url) {
        this.current_env = current_env
        this.auto_send_error_count = 0
        this.axios = axios.create({
            baseURL: server_root_url,
        })
        this.intercept()
    }

    // 拦截器
    intercept() {
        var that = this
        // 请求拦截器
        this.axios.interceptors.request.use(function (config) {
            return config;
        }, function (err) {
            return Promise.reject(err);
        });
        // 响应拦截器
        this.axios.interceptors.response.use(function (response) {
            return response;
        }, function (err) {
            return Promise.reject(err);
        });
    }

    // 请求前 验证token是否有效
    verify_token(url) {
        var that = this
        var token = localStorage.getItem('token')
        if (!token) {
            that.notify(`未登录 无法请求 ${url}`)
            that.to_page('/login')
            return false
        }
        return true
    }

    // 请求
    request(method, url, params) {
        var that = this
        if (method == 'get') {
            var request_params = {
                method: method, url: url, params: params.data,
            }
        } else {
            var request_params = {
                method: method, url: url, data: params.data,
            }
        }

        // request_params['headers'] = {'Content-Type':"multipart/form-data"}
        request_params['headers'] = {
            'device_id': this.get_device_id()
        }

        if (params.auth != false) {
            var current_token = localStorage.getItem('token')
            if (current_token) {
                request_params['headers']['Authorization'] = `Bearer ${localStorage.getItem('token')}`
            } else {
                // that.notify('当前没有登录', 'error')
            }
        }
        this.axios(request_params).then(function (res) {
            var http_status = parseInt(res.status)
            if ([200, 201].includes(http_status)) {
                var data = res.data
                if (data instanceof Object) {
                    if (data.code == 0 || data.resultCode == 200) {
                        // 请求返回0 成功处理
                        if (params.success) params.success(data.data, data.message)
                    } else {
                        // 请求返回非0 失败处理
                        if (`${data.code}`.match('^90000')) {
                            that.notify(data.message)
                            setTimeout(function () {
                                that.to_page("/login")
                            }, 800)
                            localStorage.removeItem("token")
                            localStorage.removeItem("user")
                        }
                        if (data.message != `请先登录`) {
                            that.notify(`${data.message}`, `success`)
                        }
                        if (params.error) params.error(data.code, data.message, data.data)
                    }
                } else {
                    if (params.success) params.success(data.data, res.data)
                }
            } else {
                that.notify(`(${res.data.code})${res.data.message}`, 'error')
                if (params.must) params.must(data.resultCode, data)
            }
            if (params.must) params.must()
        }).catch(function (err) {
            console.error(`${url}出错:${err}`)
            that.auto_send_error_count += 1
            if (that.auto_send_error_count > 5) return
            that.post("/suggests/add", {
                data: {
                    note: `前端自动上报错误`, imgs: '', content: JSON.stringify({
                        page: window.location.href, api: {
                            method: method, url: url, err: `${url}出错:${err}`
                        }, current_user: that.current_user()
                    }),
                }, success: function (data) {
                }, error: function (code, msg, data) {
                }, must: function (err) {
                }
            })
            if (params.must) params.must(err)
        })
    }

    put(url, params) {
        this.request('put', url, params)
    }

    post(url, params) {
        this.request('post', url, params)
    }

    get(url, params) {
        this.request('get', url, params)
    }

    user_log(data) {
        this.post('/user_log/add', {
            data: data, success: function (data) {

            }, error: function (code, msg, data) {
            }, must: function (err) {
            }
        })
    }

    to_page_top() {
        setTimeout(function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0
        }, 100)
    }

    set_user(user) {
        for (let k in user) {
            store.state.user[k] = user[k]
            // console.log(`set ${k} = ${user[k]}`)
        }
        // store.state.bottom_bar.arr[4].msg = user.not_read_count == 0 ? null : user.not_read_count
        localStorage.setItem('user', JSON.stringify(user))
        // console.log('set_user', user)
    }

    exit_login() {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        store.state.user = {
            bg_img: '', head_img: '', info_long: '', not_read_count: ''
        }
        store.state.bottom_bar.arr[2].msg = null
        this.notify(`注销登录成功`)
        this.to_page('/login')
    }

    state_options_to_arr(state_options) {
        var arr = []
        for (let k in state_options) {
            var v = state_options[k]
            var a = {
                value: k, text: v.name
            }
            if (v.children) {
                a.children = this.state_options_to_arr(v.children)
            }
            arr.push(a)
        }
        return arr
    }

    get_current_user(func = null) {
        var that = this

        this.get("/users/me", {
            auth: true, data: {},
            success: function (data) {
                that.set_user(data)
                // 如果未绑定手机

                // 如果未绑定微信小程序openid 则绑定
                var xcx_code = localStorage.getItem('xcx_code')
                if (!data.wx_xcx_openid) {
                    if (xcx_code) that.bind_wx_xcx(xcx_code)
                }
                // 如果未绑定微信公众号openid 则绑定
                if (!data.is_bind_wx) {
                    if (typeof (WeixinJSBridge) != 'undefined') {
                        if (Math.random() < 0.3) {
                            that.bind_wx()
                        }
                    }
                }
                if (typeof (func) == 'function') func(data)
            }, error: function (code, msg, data) {
                setTimeout(function () {
                    that.to_page(`/login`)
                }, 1500)
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                localStorage.removeItem("profile")
                that.notify('用户信息获取失败，请先登录')
            }, must: function (err) {
            }
        })
    }

    get_current_user_if_login(func = null) {
        var that = this
        var token = localStorage.getItem('token')
        if (token != null && token != '') {
            that.get_current_user()
        }
    }


    get_device_id() {
        var device_id = localStorage.getItem('device_id')
        if (device_id == null || device_id.length < 10) {
            device_id = uuidv4()
            localStorage.setItem('device_id', device_id)
        }
        return device_id
    }

    upload_file(params) {
        var that = this
        // 从服务器获取七牛云上传token
        this.get('/qinius/uptoken', {
            auth: true, data: {}, success: function (data) {
                // 上传七牛云
                var token = data
                var file = params.file
                // console.log('params:', params)
                // console.log('file:', file)
                var arr = file.name.split('.')
                var file_key = `${uuidv4()}.${arr[arr.length - 1]}`
                var observable = qiniu.upload(file, file_key, token, {
                    fname: file.name, //mimeType: "data:image/png",
                }, {useCdnDomain: true, chunkSize: 4})
                var subscription = observable.subscribe({
                    next(res) {
                        console.log('next', res)
                    }, error(err) {
                        params.error(err)
                    }, complete(res) {
                        // 图片压缩
                        that.save_small_img(res.key)

                        params.success(res)
                    }
                })
                // subscription.unsubscribe() // 上传取消
            }, error: function (code, msg, data) {
                //console.log(data)
                that.notify(`error(${code}): ${msg}`)
            }, must: function (err) {
            }
        });
    }

    notify(message, type = 'primary', position = 'top', time = 3000, func = null) {
        Notify({
            type: type, position: position, message: message, duration: time, onClick() {
                if (typeof (func) == 'function') {
                    func()
                }
            }
        })
    }

    // 判断对象是否为空
    is_blank(o) {
        if (o == undefined || o == null) {
            return true
        } else if (typeof o == 'string') {
            if (o === '' || /^[ ]+$/.test(o)) return true
        } else if (Array.isArray(o)) {
            if (o.length == 0) return true
        }
        return false
    }


    bind_wx_dialog(title) {
        var that = this
        store.state.dialog.open(function () {
            store.state.dialog.title = `${title}`
            store.state.dialog.content = `您的账号还未绑定微信，无法进行支付`
            store.state.dialog.left_btn.show = true
            store.state.dialog.left_btn.name = `知道了`
            store.state.dialog.left_btn.click = function () {
                store.state.dialog.show = false
            }
            store.state.dialog.right_btn.show = true
            store.state.dialog.right_btn.name = `绑定微信`
            store.state.dialog.right_btn.click = function () {
                that.bind_wx()
            }
        })
    }


    bind_wx() {
        var that = this
        var scope = 'snsapi_userinfo'
        // var appid = store.state.sys_env == 'wx-xcx' ? current_env.wx_xcx_appid : current_env.wx_gzh_appid
        var appid = current_env.wx_gzh_appid
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${current_env.bind_wx_redirect_uri}&response_type=code&scope=${scope}&state=STATE#wechat_redirect`
    }

    // 微信签名
    wx_signature(url, func) {
        var that = this
        that.get("/wx/share_signature", {
            data: {
                url: url,
            }, success: function (data) {
                func(data)
            }, error: function (code, msg, data) {
            }, must: function (err) {
            }
        })
    }


    wx_pay_dialog() {
        var that = this
        if (typeof (WeixinJSBridge) == 'undefined') {
            setTimeout(function () {
                store.state.dialog.open(function () {
                    store.state.dialog.title = `${title}`
                    store.state.dialog.content = `当前非微信环境，请在微信中打开`
                    store.state.dialog.left_btn.show = false
                    // store.state.dialog.left_btn.name = `知道了`
                    // store.state.dialog.left_btn.click = function () {
                    //     store.state.dialog.show = false
                    // }
                    store.state.dialog.right_btn.show = true
                    store.state.dialog.right_btn.name = `知道了`
                    store.state.dialog.right_btn.click = function () {

                    }
                })
            }, 200)
        } else {
            that.bind_wx()
        }
    }

    // 微信支付
    wx_pay(rmb_pay_amount, score_pay_amount = 0, goods_id = 0, goods_type = '', params = {}) {
        var that = this
        // 判断是否在微信浏览器中
        that.sys_env()
        if (store.state.sys_env == 'pc') {
            that.post("/orders/pc_qrcode_pay", {
                data: {
                    rmb_pay_amount: rmb_pay_amount, score_pay_amount: score_pay_amount, goods_id: goods_id, goods_type: goods_type,
                }, success: function (data) {
                    if (params.success) params.success(data)
                    // 在订单详情页 展示支付二维码
                    that.to_page(`/orders/detail/${data.order.uuid}`, 'router')
                }, error: function (code, msg, data) {
                    if (params.error) params.error(code, msg, data)
                    if (code == 1) {
                        that.notify(`需要先绑定微信才能进行支付`)
                        setTimeout(function () {
                            that.bind_wx()
                        }, 1500)
                    }
                }, must: function (err) {
                }
            })
        } else if (store.state.sys_env == 'h5') {
            that.post("/orders/h5_pay", {
                data: {
                    rmb_pay_amount: rmb_pay_amount, score_pay_amount: score_pay_amount, goods_id: goods_id, goods_type: goods_type,
                }, success: function (data) {
                    if (params.success) params.success(data)
                    that.to_page(`/orders/detail/${data.order.uuid}`, 'router')
                    setTimeout(function () {
                        window.location.href = data.wx_res.h5_url
                    }, 800)
                }, error: function (code, msg, data) {
                    if (params.error) params.error(code, msg, data)
                    if (code == 1) {
                        that.notify(`需要先绑定微信才能进行支付`)
                        setTimeout(function () {
                            that.bind_wx()
                        }, 1500)
                    }
                }, must: function (err) {
                }
            })
        } else if (store.state.sys_env == 'wx' || store.state.sys_env == 'wx-xcx') {
            wx.miniProgram.getEnv(function (res) {
                if (res.miniprogram) {
                    // 暂时先用二维码支付
                    that.post("/orders/pc_qrcode_pay", {
                        data: {
                            rmb_pay_amount: rmb_pay_amount, score_pay_amount: score_pay_amount, goods_id: goods_id, goods_type: goods_type,
                        }, success: function (data) {
                            if (params.success) params.success(data)
                            // 在订单详情页 展示支付二维码
                            that.to_page(`/orders/detail/${data.order.uuid}`, 'router')
                        }, error: function (code, msg, data) {
                            if (params.error) params.error(code, msg, data)
                            if (code == 1) {
                                that.notify(`需要先绑定微信才能进行支付`)
                                setTimeout(function () {
                                    that.bind_wx()
                                }, 1500)
                            }
                        }, must: function (err) {
                        }
                    })
                    return


                    that.post("/orders/jsapi_pay", {
                        data: {
                            rmb_pay_amount: rmb_pay_amount,
                            score_pay_amount: score_pay_amount,
                            goods_id: goods_id,
                            goods_type: goods_type,
                            trade_type: 'JSAPI',
                            apptype: 'WX_XCX'
                        }, success: function (data2) {
                            var wx_pay_params = data2.wx_pay_params
                            console.log(`jsapi_pay创建成功:${JSON.stringify(data2)}`)
                            // 这个页面跳转必须是router不能改成href
                            that.to_page(`/orders/detail/${data2.order.uuid}`, 'router')
                            var params_str = `appId=${wx_pay_params.appId}&nonceStr=${wx_pay_params.nonceStr}&package=${wx_pay_params.package.split("=").join(',')}&signType=${wx_pay_params.signType}&timeStamp=${wx_pay_params.timeStamp}&paySign=${wx_pay_params.paySign}`
                            setTimeout(function () {
                                wx.miniProgram.navigateTo({
                                    url: `/pages/pay/pay?${params_str}`, success: function () {
                                        console.log('success')
                                    }, fail: function () {
                                        console.log('fail');
                                    }
                                })
                            }, 2000)
                        }, error: function (code, msg, data) {
                            // 没有没有小程序openid，需要用户授权
                            if (code == 2) {
                                that.notify(`需要先绑定小程序才能进行支付`)
                                setTimeout(function () {
                                    wx.miniProgram.navigateTo({
                                        url: `/pages/bind_xcx/bind_xcx?token=${localStorage.getItem('token')}`,
                                        success: function () {
                                            console.log('success')
                                        },
                                        fail: function () {
                                            console.log('fail');
                                        }
                                    })
                                }, 1300)
                            }
                            // alert(`jsapi_pay失败：${code}:${JSON.stringify(data)}`)
                        }, must: function (err) {

                        }
                    })
                } else {
                    that.post("/orders/jsapi_pay", {
                        data: {
                            rmb_pay_amount: rmb_pay_amount, score_pay_amount: score_pay_amount,
                            goods_id: goods_id,
                            goods_type: goods_type,
                            trade_type: 'JSAPI',
                            apptype: 'WX_GZH'
                        }, success: function (data2) {
                            var wx_pay_params = data2.wx_pay_params
                            // 这个页面跳转必须是router不能改成href
                            that.to_page(`/orders/detail/${data2.order.uuid}`, 'router')
                            setTimeout(function () {
                                WeixinJSBridge.invoke('getBrandWCPayRequest', wx_pay_params, function (res) {
                                    // alert(JSON.stringify(res))
                                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                                        // 使用以上方式判断前端返回,微信团队郑重提示：
                                        //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                                    }
                                });
                            }, 300)
                        }, error: function (code, msg, data) {

                        }, must: function (err) {

                        }
                    })
                }
            })
        }
    }

    bind_wx_xcx(xcx_code) {
        var that = this
        that.post("/users/bind_wx_xcx_openid", {
            auth: true,
            data: {
                code: xcx_code,
            }, success: function (data) {
            }, error: function (code, msg, data) {
            }, must: function (err) {

            }
        })
    }

    sys_env() {
        var that = this
        // if (store.state.sys_env) return store.state.sys_env // 开启缓存将发生错误
        if (typeof (WeixinJSBridge) == 'undefined') {
            if (!(navigator.userAgent.match(/(iPhone|iPod|Android|ios|Windows Phone)/i))) {
                store.state.sys_env = 'pc'
            } else {
                store.state.sys_env = 'h5'
            }
        } else {
            store.state.sys_env = 'wx'
            wx.miniProgram.getEnv(function (res) {
                if (res.miniprogram) {
                    store.state.sys_env = 'wx-xcx'
                }
            })
        }
        console.log(`当前环境:${store.state.sys_env}`)
        // alert(`当前环境:${store.state.sys_env}`)
        return store.state.sys_env
    }

    // wxpay_bad(){
    //     that.wx_signature(window.location.href, function (data) {
    //         wx.config({
    //             debug: false, // 开启调试模式,调用的所有 api 的返回值会在客户端 alert 出来，若要查看传入的参数，可以在 pc 端打开，参数信息会通过 log 打出，仅在 pc 端时才会打印。
    //             appId: data.appid,
    //             timestamp: `${data.timestamp}`,
    //             nonceStr: data.nonce_str,
    //             signature: data.signature,
    //             jsApiList: ["chooseWXPay",]
    //         });
    //         var wx_pay_params2 = {
    //             appId: wx_pay_params.appId, timestamp: wx_pay_params.timeStamp, // 支付签名时间戳，注意微信 jssdk 中的所有使用 timestamp 字段均为小写。但最新版的支付后台生成签名使用的 timeStamp 字段名需大写其中的 S 字符
    //             nonceStr: wx_pay_params.nonceStr, // 支付签名随机串，不长于 32 位
    //             package: wx_pay_params.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
    //             signType: wx_pay_params.signType, // 微信支付V3的传入 RSA ,微信支付V2的传入格式与V2统一下单的签名格式保持一致
    //             paySign: wx_pay_params.paySign, // 支付签名
    //             success: function (res) {
    //                 // 支付成功后的回调函数
    //                 console.log(`支付成功后的回调函数: ${res}`)
    //             }
    //         }
    //         alert(JSON.stringify(wx_pay_params2))
    //         wx.chooseWXPay(wx_pay_params2)
    //         wx.error(function (res) {
    //             // alert(`config错误:${JSON.stringify(res)}`)
    //             console.log(`config错误:${JSON.stringify(res)}`)
    //             // config信息验证失败会执行 error 函数，如签名过期导致验证失败，具体错误信息可以打开 config 的debug模式查看，也可以在返回的 res 参数中查看，对于 SPA 可以在这里更新签名。
    //         });
    //     })
    // }

    wx_login() {
        var that = this
        var scope = 'snsapi_userinfo'
        // var appid = store.state.sys_env == 'wx-xcx' ? current_env.wx_xcx_appid : current_env.wx_gzh_appid
        var appid = current_env.wx_gzh_appid
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${current_env.wx_login_redirect_uri}&response_type=code&scope=${scope}&state=STATE#wechat_redirect`
    }

    to_page(url, type = null) {
        var that = this
        var current_user_uid = that.current_user('uid')
        try {
            if (current_user_uid) {
                if (url.match(/^\/blogs\/detail/)) {
                    url = `${url}/${current_user_uid}`
                } else if (url.match(/^\/curriculums\/detail/)) {
                    url = `${url}/${current_user_uid}`
                } else if (url.match(/^\/curriculum_catalogs\/detail/)) {
                    url = `${url}/${current_user_uid}`
                } else if (url.match(/^\/users\/detail/)) {
                    url = `${url}/${current_user_uid}`
                }
            }
        } catch (e) {
            console.error("匹配url时出错:", e)
        }
        if (type == 'router') {
            router.push(url)
        } else {
            window.location.href = url
        }
    }

    parse_token() {
        try {
            var token = localStorage.getItem('token')
            if (!token) return
            var token_arr = token.split('.')
            if (!token_arr[1]) return
            var profile_str = decodeURIComponent(escape(window.atob(token_arr[1])))
            var profile_obj = JSON.parse(profile_str)
            console.log('profile_obj', profile_obj)
            localStorage.setItem('profile', profile_str)
            localStorage.setItem('exp', profile_obj.exp)
            store.state.user.id = profile_obj.id
            store.state.user.uid = profile_obj.uid
        } catch (e) {
            console.error("解析token错误：", e)
        }
    }

    current_user(field) {
        if (!store.state.user[field]) {
            this.parse_token()
        }
        return store.state.user[field]
    }

    add_access_log(o_id, o_type, note = "") {
        var e = this.sys_env()
        this.post("/access_logs/add", {
            data: {
                o_id: o_id,
                o_type: o_type,
                note: note,
                env: store.state.sys_env,
            },
        })
    }

    add_share_log(share_uid, o_id, o_type) {
        this.post("/share_logs/add", {
            data: {
                share_user_uid: share_uid, o_id: o_id, o_type: o_type,
            },
        })
    }

    save_small_img(img_key) {
        this.post("/qinius/save_small_img", {
            data: {
                img_key: img_key,
            },
        })
    }

    get_ip_info_str(ip_info) {
        if (ip_info) {
            if (ip_info.province == ip_info.city) {
                return `来自${ip_info.province}`
            } else {
                return `来自${ip_info.province}${ip_info.city}`
            }
        }
        return ``
    }

    preview_imgs(img, imgs) {
        if (typeof (WeixinJSBridge) != 'undefined') {
            wx.previewImage({
                current: img, // 当前显示图片的 http 链接
                urls: imgs // 需要预览的图片 http 链接列表
            })
        } else {

        }
    }

    is_wx() {
        return typeof (WeixinJSBridge) != 'undefined'
    }

    mini_img(blog_created_at, img, w) {
        if (!img) return ''

        // 如果文章创建在90秒内，直接返回原图
        if ((new Date().getTime() - new Date(blog_created_at).getTime()) < (90 * 1000)) {
            console.log(`如果文章创建在90秒内，直接返回原图`)
            return img
        }
        // console.log("mini_img, img: ", img)
        var arr = img.split('.')
        return `${arr.slice(0, arr.length - 1).join('.')}__w${w}.${arr[arr.length - 1]}`
    }
}


export default new BaseServer(current_env.rails_api)

