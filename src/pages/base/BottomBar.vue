<template>
  <div class="" :style="`padding-bottom:12px;width:${$store.state.sys_env=='pc'?'600px':'100%;'};position: fixed;bottom: 0;background:#fff`">
    <van-tabbar
        :fixed="false"
        v-model="$router.currentRoute.value.path"
        active-color="#FF0000"
        inactive-color="#41A7FF"
        placeholder
    >
      <van-tabbar-item :name="a.href" :icon="a.icon" v-for="a in $store.state.bottom_bar.arr"
                       :badge="a.msg" @click="a.click()">{{ a.name }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import api from "@/apis"

export default {
  components: {},
  props: ['data'],
  data() {
    var vm = this
    return {
      api: api,
    }
  },
  methods: {},
  watch: {},
  mounted() {
    var vm = this
    // vm.data.set_msg_count = function (count){
    //   vm.bar.arr[2].msg = count
    // }
  }
}
</script>

<style lang="less" scoped>

</style>
