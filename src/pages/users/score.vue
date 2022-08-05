<template>
  <div class="">
    <van-nav-bar
        :style="`${$store.state.sys_env=='pc'?`width:${$store.state.sys_env=='pc'?'600px':'100%;'};position: fixed;top: 0;`:''}`"
        :fixed="!$store.state.sys_env=='pc'"
        title="我的学币"
        left-text="返回"
        @click-left="$router.back()"
    >
    </van-nav-bar>
    <div style="height:50px;" v-if="$store.state.sys_env=='pc'"></div>

    <div class="" style="padding: 100px 10px 100px 10px;">
      <div class="text-center" style="color:#777">
        学币余额
      </div>
      <div class="mgt20 text-center" style="font-size: 26px;">
        <span>
          <van-icon name="balance-o" color="#1989FA"/>
        </span>
        {{$store.state.user.score}}
      </div>
      <div class="mgt30 text-center">
        <van-button :type="'primary'" style="width:100%;" @click="click_pay()">充值学币</van-button>
      </div>
      <div class="fr pointer" @click="api.to_page(`/orders/index`)" style="margin-top:50px;color:#777;font-size:14px;">我的订单 >></div>
    </div>
  </div>
</template>

<script>
import api from "@/apis"
import BottomBar from "@/pages/base/BottomBar.vue"

export default {
  components: {
    BottomBar
  },
  props: ['data'],
  data() {
    var vm = this
    return {
      api: api,
      o: {},
      loading: false,
      curriculum: {
        content_imgs: '',
        head_imgs: '',
        flags: '',
        orders: [],
        comment_count: 0,
        user: {}
      }
    }
  },
  methods: {
    click_pay(){
      api.to_page('/orders/pay_list')
    }
  },
  mounted() {
    var vm = this
    api.get_current_user()
  }
}
</script>

<style lang="less" scoped>
</style>
