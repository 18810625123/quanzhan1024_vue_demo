<template>
  <div class="">
    <van-nav-bar
        :style="`${$store.state.sys_env=='pc'?`width:${$store.state.sys_env=='pc'?'600px':'100%;'};position: fixed;top: 0;`:''}`"
        :fixed="!$store.state.sys_env=='pc'"
        title="消息中心"
        left-text="返回"
        left-arrow
        @click-left="$router.back()"
    >
<!--      right-text="全部已读"-->
<!--      @click-right="read_all_messages()"-->
    </van-nav-bar>
    <div style="height:50px;" v-if="$store.state.sys_env=='pc'"></div>

    <div class="" style="padding: 10px 0 10px 10px;">
      <div v-for="(message, i) in messages.list" class="mgb10 pointer"  @click="api.to_page(`/messages/detail?from_id=${message.from_id}`)">
        <div class="fx">
          <div class="">
            <img :src="message.from_user.head_img" class=""
                 style="width:50px;height:50px;border-radius: 50%;border: 2px solid #FFF;" alt="">
          </div>
          <div class="f1 mgl10" style="border-bottom: 1px solid #ddd;padding-bottom: 20px;">
            <div style="font-size:16px;">{{message.from_user.nick_name}}</div>
            <div class="mgt10" style="word-break: break-all;color:#666;font-size:15px;">
              {{message.content}}
            </div>
          </div>
          <div class="mgr20 pdt10" style="border-bottom: 1px solid #ddd;padding-bottom: 20px;">
            <van-badge :content="message.not_read_count" max="99"></van-badge>
          </div>
        </div>
      </div>
      <PullButton class="mgt20" :data="messages"></PullButton>
    </div>
  </div>
</template>

<script>
import api from "@/apis"
import BottomBar from "@/pages/base/BottomBar.vue"
import PullButton from "@/components/base/PullButton.vue"

export default {
  components: {
    BottomBar, PullButton
  },
  props: ['data'],
  data() {
    var vm = this
    return {
      api: api,
      messages: {
        page: 1,
        limit: 10,
        total: 0,
        list: [],
        loading: false,
        get_data() {
          var that = this
          api.get('/messages/index', {
            data: {
              page: that.page,
              limit: that.limit
            },
            success: function (data) {
              data.list.forEach(function (a) {
                that.list.push(a)
              })

              if (data.list.length > 0) {
                that.page += 1
              }
              that.total = data.total
              that.loading = false
            },
            error: function (code, msg, data) {
              that.loading = false
            },
            must: function (err) {
              that.loading = false
            }
          })
        }
      },
    }
  },
  methods: {
    read_all_messages(){
      var vm = this
      api.post('/messages/read_all', {
        data: {

        },
        success: function (data) {
          vm.messages.init()
        },
        error: function (code, msg, data) {
        },
        must: function (err) {
        }
      })
    }
  },
  mounted() {
    var vm = this
    vm.messages.init()
    api.get_current_user()
  }
}
</script>

<style lang="less" scoped>
</style>
