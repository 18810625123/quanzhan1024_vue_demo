<template>
  <div class="w_100">
    <van-uploader class="w_100" :after-read="afterRead">
      <van-field class="w_100" v-model="data.value"
                 :label="data.title"
                 :left-icon="data.left_icon"
                 :error-message="data.err"
                 :disabled="data.disabled"
                 :type="data.type"
                 :autosize="data.autosize"
                 :readonly="true"
                 is-link
                 :placeholder="data.des">
      </van-field>
    </van-uploader>
  </div>
</template>

<script>
import api from "@/apis"
import env from "../../../env"
import Text from "./Text.vue"
import Dialog from "./Dialog.vue"

export default {
  components: {
    Text, Dialog
  },
  props: ['data'],
  data() {
    var vm = this
    return {
      api: api,
    }
  },
  methods: {
    afterRead(file,b,c) {
      var vm = this
      api.upload_file({
        file: file.file,
        success: function (res) {
          var img_url = `${env.img_src}/${res.key}`
          console.log(`上传成功，查看链接：\n${img_url}`)
          vm.data.finish(res.key)
        },
        error: function (err) {
          console.error(err)
        }
      })
    },
    // 上传中
    uploading(event, file, fileList) {
      var f = this.files[file.uid];
      f.percent = event.percent;
      if (this.data.uploading) this.data.uploading(file, event.percent)
    },
    // 上传成功
    success(response, file, fileList) {
      var f = this.files[file.uid];
      f.url = file.url;
      if (this.data.success) this.data.success(response, file);
    },
    // 上传出错
    error(err, file, fileList) {
      var f = this.files[file.uid];
      if (this.data.error) this.data.error(err, file, fileList);
    },
    // 上传前
    before(file) {
      var vm = this;
      var msg = vm.check(file);
      if (msg != '') {
        vm.$msg(msg, 'error');
        return false;
      } else {
        // 将文件放到列表保存
        vm.files[file.uid] = {
          name: file.name,
          type: file.type,
          size: (file.size / 1024).toFixed(2),
          url: '',
          percent: 0
        }
        var f = this.files[file.uid];
        if (vm.data.before) {
          var flag = vm.data.before(f)
          if (flag == 'stop') return
        }
        ;
        return true;
      }
    },
    // 验证文件是否符合要求
    check(file) {
      var vm = this;
      var msg = '';
      var suffix = file.name.includes('.') ? file.name.split('.').last() : null;
      if (vm.suffix != '*') {
        if (suffix == null) {
          msg += `不支持后缀为空的文件！`;
        } else {
          if (!vm.suffix.includes(suffix)) msg += `不支持后缀为${suffix}的文件！`;
        }
      }
      if ((file.size / 1024 / 1024) > vm.max_MB) msg += `文件大小不能超过${vm.max_MB}M！`;
      // if(file.type != 'image/jpeg') msg += `文件不是jpg！`;
      return msg;
    },
    validate() {

    },
    get() {
      var vm = this
      return vm.data.value
    },
    set(v) {
      var vm = this
      vm.data.value = v
    }
  },
  watch: {
    //change事件
    'value': function (new_value, old_value) {
      var vm = this
      vm.data.value = new Date(new_value).format('date')
      // console.log(11, new_value)
      // console.log(123, new_value)
      // vm.value = new_value.join('/')
      // console.log(111, vm.value)
    },
    // 'data.value': function (new_value, old_value) {
    //   var vm = this
    //   vm.value = new Date(new_value)
    //   console.log(11, new_value)
    //   // console.log(123, new_value)
    //   // vm.value = new_value.join('/')
    //   // console.log(111, vm.value)
    // }
  },
  mounted() {
    var vm = this
    vm.data.validate = vm.validate
    vm.data.errors = vm.errors
    vm.data.get = vm.get
    vm.data.set = vm.set
  }
}
</script>

<style lang="less" scoped>

</style>
