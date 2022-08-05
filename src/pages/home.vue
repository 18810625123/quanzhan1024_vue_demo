<template>
  <div class="">
    <div v-if="!api.is_wx()">
      <van-nav-bar
          :style="`${$store.state.sys_env=='pc'?`width:${$store.state.sys_env=='pc'?'600px':'100%;'};position: fixed;top: 0;`:''}`"
          :fixed="!$store.state.sys_env=='pc'"
          title="首页"
      >
      </van-nav-bar>
      <div style="height:50px;"  v-if="$store.state.sys_env=='pc'"></div>

      <video src="https://img.177weilai.com/video/quanzhan1024-1.mp4"
             controls="controls"
             style="width:100%"></video>

      <div class="fx-center" style="height:300px">
        <h2>这是首页</h2>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/apis"
import Button from "@/components/base/Button.vue"
import Field from "@/components/base/Field.vue"
import Slide from "@/components/base/Slide.vue"
import Imgs from "@/components/base/Imgs.vue"
import UserComments from "@/pages/base/UserComments.vue"
import UserComment from "@/pages/base/UserComment.vue"
import Share from "@/pages/base/Share.vue"
import PullButton from "@/components/base/PullButton.vue"
import BottomBar from "@/pages/base/BottomBar.vue"

export default {
  components: {
    Field, Button, Slide, UserComments, UserComment, PullButton, Imgs, Share, BottomBar
  },
  props: ['data'],
  data() {
    var vm = this
    return {
      api: api,

    }
  },
  methods: {

  },
  watch: {
  },
  mounted() {
    var vm = this
  }
}
</script>

<style lang="less" scoped>
</style>
