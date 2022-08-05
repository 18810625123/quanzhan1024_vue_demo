<template>
  <div class="w_100">

<!--    <van-nav-bar-->
<!--        title="个人信息修改"-->
<!--    />-->

    <div class="pos-rel" :style="`background-size: 100%;background-position: 50%;background-repeat: no-repeat;height: 210px;
    background-image: url('${$store.state.user.bg_img.split(',')[0]}')`">
<!--      <div class="pdt10 pdf10" style="color: #fff;position: fixed;">-->
<!--        <span @click="click_left()"><van-icon name="arrow-left"/> 返回</span>-->
<!--      </div>-->
      <div style="height: 40px;"></div>
      <div class="text-center">
        <img style="width: 70px;height: 70px;border: 3px solid #FFF;border-radius: 50%;"
             :src="$store.state.user.head_img">
      </div>
      <div class="text-center" style="font-size: 20px;color: #fff;text-shadow: 1px 1px 1px  #555;">
        {{ $store.state.user.nick_name }}
      </div>
      <div class="text-center mgt10"
           style="padding-left:10px;padding-right:10px;font-size: 14px;color: #fff;text-shadow: 1px 1px 1px  #555;">
        {{ $store.state.user.info }}
      </div>
    </div>
    <!--    个人长简介-->
    <div class="pd10" style="font-size: 14px;color:#222">
      <div class="mgb5" v-for="info in $store.state.user.info_long.split('\n')">
        <div style="word-break: break-all;">{{ info }}</div>
      </div>
    </div>

    <div>
      <div class="text-center mgt20 pdb10" style="color:#777;border-bottom: 1px solid #ddd">
        个人信息修改
      </div>
      <Form :data="form" class="pd10"></Form>
    </div>
  </div>
</template>

<script>
import api from "@/apis"
import Form from "@/components/base/Form.vue"
import Upload2 from "@/components/base/Upload2.vue"
import BottomBar from "@/pages/base/BottomBar.vue"

export default {
  components: {
    Form, Upload2, BottomBar
  },
  data() {
    var vm = this
    return {
      api: api,
      upload: {
        success(k, src) {
          vm.update(k, src)
        }
      },
      form: {
        title: '',
        bottom_line: 1,
        fields: {
          head_img: {
            title: '头像', readonly: true, type: 'upload', des: '点此修改头像', width: '', value: '', finish(v) {
              vm.update('head_img', v)
            }
          },
          bg_img: {
            title: '背景图', readonly: true, dialog:true,type: 'upload', des: '点此修改背景图', width: '', value: '', finish(v) {
              vm.update('bg_img', v)
            }
          },
          nick_name: {
            title: '用户昵称', readonly: true, dialog:true,type: 'text', des: '用户昵称', width: '', max_length: 15, value: '', finish(v) {
              vm.update('nick_name', v)
            }
          },
          info: {
            title: '短简介', readonly: true, dialog:true,type: 'text', des: '一行简短的简介', width: '', value: '', max_length: 25, autosize: true, finish(v) {
              vm.update('info', v)
            }
          },
          info_long: {
            title: '长简介', readonly: true, dialog:true,type: 'textarea', des: '长简介', width: '', value: '', max_length: 200,autosize: true, finish(v) {
              vm.update('info_long', v)
            }
          },
          sex: {
            title: '性别',
            readonly: true,
            type: 'select',
            des: '性别',
            width: '',
            value: '',
            options_key: 'user__sex',
            finish(v) {
              vm.update('sex', v[0])
            }
          },
          current_professional: {
            title: '当前职业',
            type: 'select',
            des: '当前职业',
            width: '',
            value: '',
            options_key: 'user__current_professional',
            finish(v) {
              vm.update('current_professional', v[0])
            }
          },
          interests: {
            title: '兴趣',
            readonly: true,
            type: 'select',
            width: '',
            des: '兴趣',
            value: '',
            options_key: 'user__interests',
            finish(v) {
              vm.update('interests', v[0])
            }
          },
          city_codes: {
            title: '所在城市',
            readonly: true,
            type: 'select',
            width: '',
            des: '所在城市',
            value: '',
            options_key: 'user__areas',
            finish(v) {
              vm.update('city_codes', v.join(','))
            }
          },
          birthday: {
            title: '生日', readonly: true, type: 'date', width: '', des: '生日', value: '', finish(v) {
              vm.update('birthday', v)
            }
          },
        }
      },
    }
  },
  methods: {
    afterRead(file) {
      var vm = this
    },
    click_left() {
      var vm = this
      api.to_page(`/users/me`)
    },
    update(k, v) {
      var vm = this
      api.post("/users/update", {
        auth: true,
        data: {
          k: k,
          v: v
        },
        success: function (data) {
          api.set_user(data)
        },
        error: function (code, msg, data) {

        },
        must: function (err) {
        }
      })
    }
  },
  watch: {},
  mounted() {
    var vm = this
    api.get_current_user(function (user) {
      user.city_codes = [user.province_code, user.city_code, user.area_code]
      user.bg_img = ''
      user.head_img = ''
      vm.form.set(user)
    })
  },
}
</script>

<style scoped>

</style>
