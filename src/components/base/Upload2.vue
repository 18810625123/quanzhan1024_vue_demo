<template>
  <div class="w_100">
    <van-field v-model="data.value"
               :label="data.title"
               :left-icon="data.left_icon"
               :error-message="data.err"
               :disabled="data.disabled"
               :type="data.type"
               :autosize="data.autosize"
               :readonly="true"
               is-link
               @click="click()"
               :placeholder="data.des">
    </van-field>
    <input class="hid2" type="file" :id="id" accept="image/*">
  </div>
</template>

<script>
import api from "@/apis"

export default {
  components: {
  },
  props: ['data'],
  data() {
    var vm = this
    return {
      id: String.random(11),
      k: ''
    }
  },
  methods: {
    click() {
      var vm = this
      document.getElementById(vm.id).click()
    },
    afterRead(file) {
      var vm = this
      api.upload_file({
        file: file[0],
        success: function (res) {
          var img_url = `https://img.177weilai.com/${res.key}`
          // console.log(`上传成功，查看链接：\n${img_url}`)
          vm.data.finish(img_url)
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
  },
  watch: {},
  mounted() {
    var vm = this
    document.getElementById(vm.id).addEventListener('change', (event) => {
      const files = event.target.files;
      vm.afterRead(files)
    });
    vm.data.click = vm.click
  }
}
</script>

<style lang="less" scoped>

</style>
