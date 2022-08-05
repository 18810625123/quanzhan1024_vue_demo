<template>
  <div>
    <van-field v-model="data.value"
               :label="data.title"
               :left-icon="data.left_icon"
               :error-message="data.err"
               :disabled="data.disabled"
               :type="data.type"
               :autosize="data.autosize"
               :label-width="data.title_width"
               :maxlength="data.max_length"
               :readonly="data.readonly==true?true:false"
               :is-link="data.link!=false?true:false"
               @click="dialog.show=true"
               :placeholder="data.des">
      <template #button>
        <slot></slot>
      </template>
    </van-field>

    <Dialog v-if="data.dialog==true" :data="dialog">
      <div class="fx-center">
        <van-field class="h_50" v-model="data.value"
                   :error-message="data.err"
                   :type="data.type"
                   :autosize="data.autosize"
                   :maxlength="data.max_length"
                   label-width="100%"
                   :placeholder="data.des">
        </van-field>
      </div>
    </Dialog>
  </div>
</template>

<script>
import api from "@/apis"
import Dialog from "./Dialog.vue"

export default {
  components: {
    Dialog
  },
  props: ['data'],
  data() {
    var vm = this
    return {
      dialog: {
        show: false,
        title: vm.data.title,
        confirm() {
          if (typeof (vm.data.finish) == 'function') {
            vm.data.finish(vm.data.value)
          }
        },
        cancel() {
        }
      },
      show: false,
      errors: [],
    }
  },
  methods: {
    confirm() {
      alert(342)
    },
    click() {
      var vm = this
    },
    // 长度验证
    min_max_length_validate() {
      var vm = this
      var value = vm.data.value
      var title = vm.data.title;
      var min = null
      var max = null
      var len = null

      if (!value) return

      vm.data.checks.forEach(function (a) {
        if (a.includes('min_length:')) {
          min = parseInt(a.split('min_length:')[1])
        }
        if (a.includes('max_length:')) {
          max = parseInt(a.split('max_length:')[1])
        }
        if (a.match('^length:')) {
          len = parseInt(a.split('length:')[1])
        }
      })
      var msg = '文字长度'
      if (['select_more', 'cascader'].includes(vm.data.type)) {
        msg = '选择个数'
      }
      if (min && value.length < min) {
        vm.errors.push(`${msg}不能小于${min}`)
      }
      if (max && value.length > max) {
        vm.errors.push(`${msg}不能超过${max}`)
      }
      if (len && value.length != len) {
        vm.errors.push(`${msg}需要是${len}位`)
      }
    },
    // 数字大小验证
    min_max_validate() {
      var vm = this
      var value = vm.data.value
      var title = vm.data.title;
      var min = null
      var max = null

      if (!value) return

      vm.data.checks.forEach(function (a) {
        if (a.includes('min:')) {
          min = parseInt(a.split('min:')[1])
        }
        if (a.includes('max:')) {
          max = parseInt(a.split('max:')[1])
        }
      })
      if (min && value < min) {
        vm.errors.push(`不能小于${min}`)
      }
      if (max && value > max) {
        vm.errors.push(`不能大于${max}`)
      }
    },
    // 验证身份证
    idCardValidate(cid) {
      var arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]// 加权因子
      var arrValid = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2]// 校验码
      var reg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
      if (reg.test(cid)) {
        var sum = 0, idx;
        for (var i = 0; i < cid.length - 1; i++) {
          // 对前17位数字与权值乘积求和
          sum += parseInt(cid.substr(i, 1), 10) * arrExp[i]
        }
        // 计算模（固定算法）
        idx = sum % 11;
        // 检验第18为是否与校验码相等
        return arrValid[idx] == cid.substr(17, 1).toUpperCase()
      } else {
        return false
      }
    },
    validate() {
      var vm = this
      var value = vm.data.value
      var title = vm.data.title
      // 执行基础验证
      var checks = vm.data.checks
      vm.errors.clear()
      if (checks) {
        // 必填项验证
        if (checks.includes('required') && api.is_blank(value)) {
          vm.errors.push(`${title}是必填项`)
        }
        // 必填项验证
        if (checks.includes('in_options')) {
          var ops = vm.data.options.map(function (a) {
            return a.value
          })
          if (!ops.includes(value)) {
            vm.errors.push(`未在选项中选择`)
          }
        }
        // 长度验证
        vm.min_max_validate()
        vm.min_max_length_validate()
        if (value && checks.includes('0-1') && !/^(0.\d+|0|1)$/.test(value)) {
          vm.errors.push(`必须是数字`)
        }
        if (value && checks.includes('is-number') && !/^[0-9]+\.{0,1}[0-9]{0,20}$/.test(value)) {
          vm.errors.push(`必须是数字`)
        }
        if (value && checks.includes('is-int') && !/^0$|^[1-9]\d*$/.test(value)) {
          vm.errors.push(`必须是整数`)
        }
        if (value && checks.includes('is-not-zero') && value == 0) {
          vm.errors.push(`不能填0`)
        }
        if (value && checks.includes('is-number-or-string') && !/^[a-zA-Z0-9]*$/.test(value)) {
          vm.errors.push(`只能是字母或数字`)
        }
        if (value && checks.includes('is-chinese') && !/^[\u4e00-\u9fa5]{0,}$/.test(value)) {
          vm.errors.push(`只能是汉字`)
        }
        if (value && checks.includes('no-chinese') && /[\u4E00-\u9FA5]/.test(value)) {
          vm.errors.push(`不能有汉字`)
        }
        if (value && checks.includes('is-date') && new CustomDate(value).date == 'Invalid Date') {
          vm.errors.push(`不是日期`)
        }
        if (value && checks.includes('is-phone') && !/^[1][0-9]{10}$/.test(value)) {
          vm.errors.push(`不是电话号码`)
        }
        if (value && checks.includes('is-email') && !/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(value)) {
          vm.errors.push(`不是邮箱`)
        }
        if (value && checks.includes('is-identity-card') && !this.idCardValidate(value)) {
          vm.errors.push(`不是身份证`)
        }
        // if (value && checks.includes('is-httpurl') && !/^http:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=]*)?$/.test(value)) {
        //   vm.errors.push(`不是网址`)
        // }

        if (value && checks.includes('is-plate-number') && !/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/.test(value)) {
          vm.errors.push(`不是车牌号码`)
        }
      }
      // 执行自定义验证
      if (vm.data.custom_check) vm.data.custom_check(value, vm.errors)
      // 提示错误
      if (vm.errors.length > 0) {
        vm.data.err = vm.errors.join("\n")
        return false
      } else {
        vm.data.err = null
        return true
      }
    },
    set(v) {
      var vm = this
      vm.data.value = v
    },
    get() {
      var vm = this
      return vm.data.value
    }
  },
  mounted() {
    var vm = this
    vm.data.validate = vm.validate
    vm.data.errors = vm.errors
    vm.data.set = vm.set
    vm.data.get = vm.get
  }
}
</script>

<style lang="less" scoped>

</style>
