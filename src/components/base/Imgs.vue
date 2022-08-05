<template>
  <van-swipe
      class="my-swipe"
      :autoplay="data.loop_time"
      :loop="data.loop"
      :style="data.div_style">
    <van-swipe-item v-for="(img, i) in data.list">
      <img :style="`${data.img_style}`" :src="img" @click="click_img(img, i)">
    </van-swipe-item>
    <template v-if="data.show_index==true" #indicator="{ active, total }">
      <div class="custom-indicator">{{ active + 1 }}/{{ data.list.length }}</div>
    </template>
  </van-swipe>
</template>

<script>
import api from "@/apis"

export default {
  props: ['data'],
  data() {
    var vm = this
    return {
      active: 0,
      total: 4,
    }
  },
  methods: {
    click_img(img, i) {
      var vm = this
      if (typeof (vm.data.click_img) == 'function') vm.data.click_img(img, i)
    }
  },
  mounted() {
    var vm = this
  }
}
</script>

<style lang="less" scoped>
.my-swipe .van-swipe-item {
  color: #fff;
  text-align: center;
  background-color: #39a9ed;
}

.custom-indicator {
  position: absolute;
  right: 5px;
  bottom: 5px;
  padding: 2px 5px;
  font-size: 12px;
  color: #fff;
  text-shadow: 1px 1px 1px #555;
}
</style>
