<template>
  <div class="">

    <van-nav-bar
        :style="`${$store.state.sys_env=='pc'?`width:${$store.state.sys_env=='pc'?'600px':'100%;'};position: fixed;top: 0;`:''}`"
        :fixed="!$store.state.sys_env=='pc'"
        title="问题反馈或意见建议"
        left-text="返回"
        @click-left="$router.back()"
    >
    </van-nav-bar>
    <div style="height:50px;"></div>

    <div class="pd20 mgt10">
      <div>问题反馈或意见建议：</div>
      <van-field v-model="content"
                 type="textarea"
                 :rows="8"
                 :maxlength="500"
                 placeholder="问题反馈或意见建议描述">
      </van-field>
      <div>联系方式：</div>
      <van-field v-model="note"
                 type="text"
                 :maxlength="20"
                 placeholder="你的联系方式（非必填）">
      </van-field>
      <Form :data="form"></Form>
      <img v-if="img" class="mgt20 fx-center" :src="img" style="width:80%;" alt="">
    </div>
    <div class="fx-center">
      <van-button class="mgt10" type="primary" style="width:200px;" @click="commit()">提交</van-button>
    </div>
  </div>
</template>

<script>
import api from "@/apis"
import Form from "@/components/base/Form.vue"

export default {
  components: {
    Form
  },
  props: ['data'],
  data() {
    var vm = this
    return {
      api: api,
      img: '',
      note: '',
      content: '',
      form: {
        title: '',
        bottom_line: 1,
        fields: {
          bg_img: {
            title: '点此上传图片（非必填）',
            readonly: true,
            dialog: false,
            only_btn: true,
            type: 'upload',
            des: '',
            width: '',
            value: '',
            finish(v) {
              vm.img = v
            }
          },
        }
      }
    }
  },
  methods: {
    commit() {
      var vm = this
      if (!vm.content) {
        api.notify(`问题反馈或意见建议描述是必填的`)
        return
      }
      api.post("/suggests/add", {
        data: {
          note: vm.note,
          content: vm.content,
          imgs: vm.img,
        },
        success: function (data) {
          api.notify(`你的宝贵建议我们已收到，感谢！`)
          vm.note = ''
          vm.content = ''
          vm.img = ''
        },
        error: function (code, msg, data) {

        },
        must: function (err) {
        }
      })
    }
  },
  mounted() {
    var vm = this
  }
}
</script>

<style lang="less" scoped>
</style>
