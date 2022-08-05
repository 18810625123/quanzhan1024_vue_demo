<template>
  <div>
    <van-dialog
        v-model:show="data.show"
        :title="data.title"
        @confirm="confirm()"
        @cancel="cancel()"
        :show-cancel-button="data.cancel">
        <slot></slot>
    </van-dialog>
  </div>
</template>

<script>
import api from "@/apis"
export default {
  props: ['data'],
  data() {
    var vm = this
    return {}
  },
  methods: {
    confirm() {
      var vm = this
      if (typeof (vm.data.confirm) == 'function') vm.data.confirm()
    },
    cancel() {
      var vm = this
      if (typeof (vm.data.confirm) == 'function') vm.data.cancel()
    },
  },
  mounted() {
    var vm = this
  }
}
</script>

<style lang="less" scoped>

</style>
