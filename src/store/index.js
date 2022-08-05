import {createStore} from 'vuex'

import areas_kv from './areas_kv'
import router from '../router'
import QRcode from 'qrcode'

var dialog = {
    show: false,
    title: 'title',
    content: 'content',
    left_btn: {
        show: true,
        name: '关闭',
        click() {
            console.log('left_btn')
        },
    },
    right_btn: {
        show: true,
        name: '确认',
        click() {
            console.log('right_btn')
        },
    },
    confirm() {
        dialog.ok()
        dialog.ok = function () {
            console.log('ok')
        }
    },
    cancel() {
        dialog.exit()
        dialog.exit = function () {
            console.log('exit')
        }
    },
    open(func) {
        func()
        dialog.show = true
    },
    close() {
        dialog.show = false
    },
}

var qrcode2 = {
    show: false,
    id: 'ajklsdhfkjasdfhjkd',
    title: '二维码',
    content: 'content',
    left_btn: {
        show: true,
        name: '关闭',
        click() {
            console.log('left_btn')
        },
    },
    right_btn: {
        show: true,
        name: '确认',
        click() {
            console.log('right_btn')
        },
    },
    confirm() {
        qrcode2.ok()
        qrcode2.ok = function () {
            console.log('ok')
        }
    },
    cancel() {
        qrcode2.exit()
        qrcode2.exit = function () {
            console.log('exit')
        }
    },
    open(func) {
        func()
        qrcode2.show = true
    },
    close() {
        qrcode2.show = false
    },
    gen_qrcode(text, id = qrcode2.id) {
        setTimeout(function () {
            var canvas = document.getElementById(id)
            QRcode.toCanvas(canvas, text, function (error) {
                if (error) console.error(error)
                console.log('gen_qrcode success!');
            })
        }, 100)
    }
}

export default createStore({
    state: {
        is_pc: false,
        sys_env: '',
        pc_width: '600px',
        shareing: false,
        dialog: dialog,
        qrcode2: qrcode2,
        bottom_bar: {
            arr: [
                {
                    name: '全栈课堂',
                    msg: '',
                    href: '/home',
                    icon: 'tv-o',
                    click() {
                        router.push(this.href)
                    }
                },
                {
                    name: '广场',
                    msg: '',
                    href: '/blogs',
                    icon: 'wap-home-o',
                    click() {
                        router.push(this.href)
                    }
                },
                {
                    name: '发布',
                    msg: '',
                    href: '/blogs/add_dynamic',
                    icon: 'add',
                    color: '0089FF',
                    click() {
                        router.push(this.href)
                    }
                },
                {
                    name: '我的',
                    msg: '',
                    href: '/users/me',
                    icon: 'user-circle-o',
                    click() {
                        router.push(this.href)
                    }
                },
            ]
        },
        not_read_count: null,
        count: 0,
        user: {
            bg_img: '',
            head_img: '',
            info_long: '',
            not_read_count: ''
        },
        curriculum: {},
        curriculum_catalog: {},
        options: {
            user: {
                areas: areas_kv,
                current_professional: {
                    '1': {
                        name: '程序员'
                    },
                    '2': {
                        name: '学生'
                    },
                    '3': {
                        name: '其它'
                    },
                },
                target: {
                    '0': {
                        name: '随便看看'
                    },
                    '1': {
                        name: '转行当程序员'
                    },
                    '2': {
                        name: '有兴趣'
                    },
                    '3': {
                        name: '聊天交友'
                    },
                },
                interests: {
                    '1': {
                        name: '前端'
                    },
                    '2': {
                        name: '后端'
                    },
                    '3': {
                        name: '全栈'
                    },
                    '9': {
                        name: '不确定'
                    },
                },
                sex: {
                    '1': {
                        name: '男'
                    },
                    '2': {
                        name: '女'
                    },
                },
            }
        }
    },
    mutations: {
        increment(state) {
            state.count++
        }
    },
    actions: {
        increment(context) {
            context.commit('increment')
        }
    }
})