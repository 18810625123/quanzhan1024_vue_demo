<template>
  <div>
    <van-tabs
        :active="data.active"
        @click-tab="click"
        :sticky="data.sticky"
        :type="data.type"
        :shrink="data.shrink"
        swipeable
        ref="tabb"
    >
      <van-tab v-for="(v, k) in data.tabs" :title="v.name" :name="k">
        <slot :name="k"></slot>
      </van-tab>
    </van-tabs>
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
    click(tab){
      var vm = this
      vm.data.active = tab.name
      // vm.$refs.tabb.resize()
      // alert(33)
    },
  },
  watch: {},
  mounted() {
    var vm = this
  }
}
</script>

<style lang="less" scoped>

</style>
