<template>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
        v-model:loading="data.loading"
        :finished="data.finished"
        finished-text="没有更多了"
        @load="load"
    >
    </van-list>
  </van-pull-refresh>
</template>

<script>
import api from "@/apis"

export default {
  props: ['data'],
  data() {
    var vm = this
    return {
    }
  },
  methods: {
    load() {
      var vm = this
      if (typeof (vm.data.load) == 'function') vm.data.load()
    },
  },
  mounted() {
    var vm = this
  }
}
</script>

<style lang="less" scoped>

</style>
