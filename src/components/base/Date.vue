<template>
  <div>
    <van-field
        v-model="data.value"
        is-link
        readonly
        :label="data.title"
        :placeholder="data.desc"
        @click="dialog.show = true"
    />
    <Dialog :data="dialog">
      <div class="fx-center">
        <van-datetime-picker
            v-model="value"
            type="date"
            :show-toolbar="true"
            confirm-button-text="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
            cancel-button-text="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
            title="选择年月日"
            :min-date="min"
            :max-date="max"
        />
      </div>
    </Dialog>
  </div>
</template>

<script>
import api from "@/apis"
import Text from "./Text.vue"
import Dialog from "./Dialog.vue"

export default {
  components: {
    Text,Dialog
  },
  props: ['data'],
  data() {
    var vm = this
    var date = new Date(2021, 0, 17)
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
      min: new Date(1950, 0, 1),
      max: new Date(2023, 11, 1),
      value: date,
      value_str: date.format('date')
    }
  },
  methods: {
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
