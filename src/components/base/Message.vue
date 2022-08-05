<template>
  <div>
    <van-notice-bar
        left-icon="volume-o"
        :scrollable="false"
        :mode="data.close==true?'closeable':''"
        @click="click()"
        @close="close()"
        style="height:25px;"
    >
      <van-swipe
          vertical
          class="notice-swipe"
          :autoplay="data.time"
          :show-indicators="false"
      >
        <van-swipe-item v-for="(msg,i) in data.messages" @click="click_msg(msg)" :key="i" style="width:100%">{{
            msg.text
          }}
        </van-swipe-item>
      </van-swipe>
    </van-notice-bar>
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
    click(){
      var vm = this
      console.log('click')
    },
    close(a,b) {
      var vm = this
      console.log('close')

    },
    click_msg(msg) {
      var vm = this
      if (typeof (msg.click) == 'function') msg.click(msg)
    }
  },
  mounted() {
    var vm = this
  }
}
</script>

<style lang="less" scoped>
.notice-swipe {
  height: 30px;
  line-height: 30px;
}
</style>
