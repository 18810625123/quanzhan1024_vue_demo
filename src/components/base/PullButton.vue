<template>
  <div>
    <div class="text-center pdb30" style="font-size: 13px;">
      <!--      <span v-if="data.loading!=true" style="color:#666;">{{ data.list.length }}/{{ data.total }}&nbsp;</span>-->
      <Button v-if="data.list.length < data.total && data.loading!=true" :data="btn1"></Button>
      <Button v-if="data.list.length >= data.total && data.loading!=true" :data="btn2"></Button>
      <van-loading type="spinner" color="#666" size="18px" v-if="data.loading==true">
        {{ loading_text }}
      </van-loading>
    </div>
  </div>

</template>

<script>
import api from "@/apis"
import Button from "./Button.vue";

export default {
  components: {
    Button
  },
  props: ['data'],
  data() {
    var vm = this
    return {
      loading_text: '加载中...',
      btn1: {
        name: '加载更多...',
        click() {
          vm.data.loading = true
          vm.data.get_data()
        }
      },
      btn2: {
        // name: '没有更多了',
        name: '',
        click() {
          console.log('没有更多了')
        }
      },
    }
  },
  methods: {
    get_data_success(data) {
      var vm = this
      vm.data.loading = false
    }
  },
  mounted() {
    var vm = this
    vm.data.get_data_success = vm.get_data_success
    vm.data.init = function () {
      vm.data.page = 1
      vm.data.total = 0
      vm.data.list.clear()
      vm.data.loading = true
      vm.data.get_data()
    }
    vm.data.click = vm.btn1.click
  }
}
</script>

<style lang="less" scoped>

</style>
