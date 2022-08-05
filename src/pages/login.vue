<template>
  <div>
    <div class="pd10 pos-rel">
      <div @click="api.to_page('/')" class="pos-abs pointer" style="font-size:13px;right:20px;top:30px;color:#aaa">
        先看看
        <van-icon name="arrow">
        </van-icon>
      </div>
    </div>

    <Tabs :data="tabs" class="" style="margin-top:30%;">
      <template v-slot:[`phone_login`]>
        <div class="pd10" style="min-height: 100px;">
          <Field class="mgt20" :data="phone"></Field>
          <Field class="mgt10" :data="phone_code">
            <Button :data="send_code_btn"></Button>
          </Field>
          <div class="mgt10 fx-center">
            <Button class="fx-center" :data="login_btn"></Button>
          </div>
        </div>
      </template>
    </Tabs>

  </div>
</template>

<script>
import api from "@/apis"
import Field from "@/components/base/Field.vue"
import Button from "@/components/base/Button.vue"
import Tabs from "@/components/base/Tabs.vue"

export default {
  components: {
    Field, Button, Tabs
  },
  data() {
    var vm = this
    return {
      api: api,

      tabs: {
        shrink: false,
        sticky: false,
        type: 'line',
        active: 'phone_login',
        tabs: {
          phone_login: {
            name: '手机号注册登录',
          },
        }
      },
      send_code_second: 0,
      send_code_btn: {
        name: '发送验证码',
        disabled: false,
        style: 'background:#fff;color:#666;border:1px solid #DDD; padding:5px;border-radius:5px;',
        click() {
          vm.click_send_code()
        }
      },

      login_btn: {
        name: '登录or注册',
        type: 'primary',
        disabled: false,
        style: 'width:90%;border-radius:20px;background: orange;color:#fff;padding:7px;background: linear-gradient(to right,#ff5f34, #cf1329);',
        click() {
          if (!vm.phone.validate()) {
            return
          }
          if (!vm.phone_code.validate()) {
            return
          }
          vm.login_btn.disabled = true
          api.post("/login/by_phone", {
            data: {
              phone: vm.phone.value,
              phone_code: vm.phone_code.value
            },
            success: function (data) {
              vm.login_success(data)
            },
            error: function (code, msg, data) {
              vm.login_btn.disabled = false
            },
            must: function (err) {
              vm.login_btn.disabled = false
            }
          })
        }
      },

      phone: {
        link: false,
        value: '',
        type: 'text',
        des: '请输入手机号',
        title: '手机号',
        title_width: '60px',
        err: '',
        left_icon: 'phone-o',
        checks: ['required', 'is-phone']
      },
      phone_code: {
        link: false,
        value: '',
        type: 'text',
        title: '验证码',
        title_width: '60px',
        des: '请输入手机验证码',
        err: '',
        left_icon: 'comment-circle-o',
        checks: ['required', 'length:6'],
      },

    }
  },
  methods: {
    login_success(data) {
      var vm = this
      api.notify(`登录成功`)
      localStorage.setItem('token', data.token)
      api.to_page('/')
      api.set_user(data.user)
    },
    click_left() {
      var vm = this
      api.to_page(`/`)
    },
    click_send_code() {
      var vm = this
      var phone = vm.phone
      if (!phone.validate()) {
        return
      }
      if (vm.send_code_second > 0) {
        return
      }
      vm.send_code_second = 30
      api.post("/verify_codes/send", {
        data: {
          account: phone.value,
          category: 'phone',
          type: 'register_or_login'
        },
        success: function (data) {
          var inta = setInterval(function () {
            vm.send_code_second -= 1
            vm.send_code_btn.name = `发送验证码${vm.send_code_second > 0 ? `(${vm.send_code_second})` : ``}`
            if (vm.send_code_second <= 0) {
              clearInterval(inta)
              vm.send_code_second = 0
            }
          }, 1000)
          vm.phone_code.value = null
          api.notify('验证码发送成功， 请查看手机验证码')
        },
        error: function (code, msg, data) {
          vm.send_code_second = 0
        },
        must: function (err) {
        }
      })
    },

  },
  watch: {},
  mounted() {
    var vm = this
    if (api.current_user('uid')) {
      api.notify(`当前已有用户登录，如需要重新登录，请在<我的>先注销此登录`)
      setTimeout(function () {
        api.to_page('/')
      }, 2000)
    }
  },
}
</script>

<style scoped>

</style>
