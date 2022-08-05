<template>
  <div class="">
    <van-nav-bar
        :style="`${$store.state.sys_env=='pc'?`width:${$store.state.sys_env=='pc'?'600px':'100%;'};position: fixed;top: 0;`:''}`"
        :fixed="!$store.state.sys_env=='pc'"
        :title="`${from_user.nick_name}`"
        left-text="返回"
        left-arrow
        right-text="首页"
        @click-right="api.to_page(`/`)"
        @click-left="$router.back()"
    >
    </van-nav-bar>
    <div style="height:50px;" v-if="$store.state.sys_env=='pc'"></div>

    <div class="" style="padding:10px;">
      <PullButton class="mgb20" :data="messages"></PullButton>

      <div v-for="(message, i) in messages.list" class="mgb20">
        <div v-if="message.from_id == from_id">
          <div class="fx">
            <div class="mgr10">
              <img class="pointer" @click="api.to_page(`/users/detail/${from_user.uid}`)" :src="from_user.head_img"
                   style="width:40px;height:40px;border-radius: 50%;border: 2px solid #FFF;" alt="">
            </div>
            <div class="f1 pd5 mgr10" style="background: #BBB;border-radius: 10px;color:#000;">
              <div class="pdl5 pdr5" style="word-break: break-all;font-size: 15px;">
                {{ message.content }}
              </div>
              <div class="pdl5 pdr5 mgt10" style="font-size: 13px;">
                {{ new Date(message.created_at).format("MM-dd hh:mm") }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="message.from_id != from_id">
          <div class="fx">
            <div class="f1 pd5 mgr10 " style="background: #5785FF;border-radius: 10px;color:#fff;">
              <div class="pdr5 pdl5" style="word-break: break-all;font-size: 15px;text-align: right">
                {{ message.content }}
              </div>
              <div class="mgt10 pdl5 pdr5" style="font-size: 13px;text-align: right">
                {{ new Date(message.created_at).format("MM-dd hh:mm") }}
              </div>
            </div>
            <div class="mgr10">
              <img class="pointer" @click="api.to_page(`/users/detail/${$store.state.user.uid}`)"
                   :src="$store.state.user.head_img"
                   style="width:40px;height:40px;border-radius: 50%;border: 2px solid #FFF;" alt="">
            </div>
          </div>
        </div>
      </div>
      <div style="height: 30px;"></div>
    </div>

    <!--    输入框-->
    <div class="pos-fixed" :style="`border:1px solid #ddd;background:#fff;bottom:0px;width:${$store.state.sys_env=='pc'?'598px':'100%'}`">
      <van-cell-group style="">
        <van-field
            v-model="content.value"
            rows="1"
            :autosize="{ maxHeight: 150}"
            label=""
            maxlength="300"
            type="textarea"
            placeholder="在此输入内容"
        >
          <template #button>
            <van-button size="small" type="primary" @click="send_message()" :disabled="content.disabled">发送</van-button>
          </template>
        </van-field>
      </van-cell-group>
    </div>
    <div style="height:130px;"></div>
  </div>
</template>

<script>
import api from "@/apis"
import PullButton from "@/components/base/PullButton.vue"
import BottomBar from "@/pages/base/BottomBar.vue"

export default {
  components: {
    PullButton, BottomBar
  },
  props: ['data'],
  data() {
    var vm = this
    return {
      api: api,
      content: {
        disabled: false,
        value: ''
      },
      loading: false,
      from_id: 0,
      from_user: {
        nick_name: ''
      },
      messages: {
        page: 1,
        limit: 20,
        total: 0,
        list: [],
        loading: false,
        get_data() {
          var that = this
          api.get('/messages/from_list', {
            data: {
              from_id: vm.from_id,
              page: that.page,
              limit: that.limit
            },
            success: function (data) {
              data.list.forEach(function (a) {
                that.list.unshift(a)
              })
              vm.from_user = data.from_user

              if (data.list.length > 0) {
                that.page += 1
              }
              that.total = data.total
              that.loading = false

              setTimeout(function(){
                vm.loop_get_new_messages()
              }, 1000)

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
    send_message() {
      var vm = this
      if (vm.content.value == '' || vm.content.value == null) {
        return
      }
      vm.content.disabled = true
      api.post('/messages/send', {
        data: {
          from_id: vm.from_id,
          content: vm.content.value
        },
        success: function (data) {
          vm.content.value = null
          vm.content.disabled = false
          vm.messages.list.push(data)
        },
        error: function (code, msg, data) {
          vm.content.disabled = false
        },
        must: function (err) {
        }
      })
    },
    flush() {
      var vm = this
      vm.messages.click()
    },
    loop_get_new_messages(){
      var vm = this
      if(vm.loop) return
      vm.loop = setInterval(function (){
        api.get('/messages/pull_news', {
          data: {
            from_id: vm.from_id,
            last_id: vm.messages.list.last().id
          },
          success: function (data) {
            // api.notify(`有条${data.total}新的消息`)
            data.list.forEach(function (a) {
              vm.messages.list.push(a)
            })
          },
          error: function (code, msg, data) {
          },
          must: function (err) {
          }
        })
      }, 10000)
    }
  },
  mounted() {
    var vm = this
    vm.from_id = vm.$router.currentRoute.value.query.from_id
    vm.messages.init()
    api.get_current_user()
    vm.$store.state.flush = vm.flush
  }
}
</script>

<style lang="less" scoped>
</style>
