<template>
  <div class="">
    <van-nav-bar
        :style="`${$store.state.sys_env=='pc'?`width:${$store.state.sys_env=='pc'?'600px':'100%;'};position: fixed;top: 0;`:''}`"
        :fixed="!$store.state.sys_env=='pc'"
        :title="user.nick_name"
        left-text="返回"
        @click-left="$router.back()"
    >
    </van-nav-bar>
    <div style="height:50px;"></div>

    <!-- 第二部分，可切换tabs标签 -->
    <Tabs :data="tabs" class="">
      <template v-slot:[`cares`]>
        <div class="" style="min-height: 600px;padding:15px;">
          <div class="mgb10" v-for="(user, i) in cares.list">
            <div class="fx">
              <!--              头像-->
              <div class="">
                <img :src="user.head_img" @click="api.to_page(`/users/detail/${user.uid}`)"
                     style="width:40px;height:40px;border-radius: 50%;border: 2px solid #FFF;" alt="">
              </div>
              <!--              昵称-->
              <div class="f1 mgl10 pdt10" style="">
                <div style="font-size:16px;">{{ user.nick_name }}</div>
              </div>
              <!--              按钮-->
              <div class="f1 mgt5" style="" v-if="$store.state.user.uid != user.uid">
                <div class="fx-center pdl10" style="padding-right: 10px;">
                  <div v-if="user.is_care == 1" class="text-center mgr10 mbtn" @click="care(user, 0)"
                       style="padding:4px 0px 4px 0px;width:60px;color:#000;font-size:14px;background:#DDD;border-radius: 5px;">
                    已关注
                  </div>
                  <div v-else class="text-center mgr10 mbtn" @click="care(user, 1)"
                       style="padding:4px 0px 4px 0px;width:60px;color:#FFF;font-size:14px;background:red;border-radius: 5px;">
                    +关注
                  </div>
                  <div class="text-center mbtn" @click="api.to_page(`/messages/detail?from_id=${user.id}`)"
                       style="padding:4px 0px 4px 0px;width:60px;color:#000;font-size:14px;background:#DDD;border-radius: 5px;">
                    私信
                  </div>
                </div>
              </div>
            </div>
          </div>
          <PullButton class="mgt20" :data="cares"></PullButton>
        </div>
      </template>

      <template v-slot:[`fans`]>
        <div class="" style="min-height: 600px;padding:15px;">
          <div class="mgb10" v-for="(user, i) in fans.list">
            <div class="fx">
              <!--              头像-->
              <div class="">
                <img :src="user.head_img"  @click="api.to_page(`/users/detail/${user.uid}`)"
                     style="width:40px;height:40px;border-radius: 50%;border: 2px solid #FFF;" alt="">
              </div>
              <!--              昵称-->
              <div class="f1 mgl10 pdt10" style="">
                <div style="font-size:16px;">{{ user.nick_name }}</div>
              </div>
              <!--              按钮-->
              <div class="f1 mgt5" style=""  v-if="$store.state.user.uid != user.uid">
                <div class="fx-center pdl10" style="padding-right: 10px;">
                  <div v-if="user.is_care == 1" class="text-center mgr10 mbtn" @click="care(user, 0)"
                       style="padding:4px 0px 4px 0px;width:60px;color:#000;font-size:14px;background:#DDD;border-radius: 5px;">
                    已关注
                  </div>
                  <div v-else class="text-center mgr10 mbtn" @click="care(user, 1)"
                       style="padding:4px 0px 4px 0px;width:60px;color:#FFF;font-size:14px;background:red;border-radius: 5px;">
                    +关注
                  </div>
                  <div class="text-center mbtn" @click="api.to_page(`/messages/detail?from_id=${user.id}`)"
                       style="padding:4px 0px 4px 0px;width:60px;color:#000;font-size:14px;background:#DDD;border-radius: 5px;">
                    私信
                  </div>
                </div>
              </div>
            </div>
          </div>
          <PullButton class="mgt30" :data="fans"></PullButton>
        </div>
      </template>
    </Tabs>
  </div>
</template>

<script>
import api from "@/apis"
import BottomBar from "@/pages/base/BottomBar.vue"
import PullButton from "@/components/base/PullButton.vue"
import Tabs from "@/components/base/Tabs.vue"

export default {
  components: {
    BottomBar, PullButton, Tabs
  },
  props: ['data'],
  data() {
    var vm = this
    return {
      api: api,
      user: {
        nick_name: ''
      },

      tabs: {
        shrink: false,
        sticky: false,
        active: 'fans',
        tabs: {
          cares: {
            name: '关注',
          },
          fans: {
            name: '粉丝',
          },
        }
      },


      fans: {
        page: 1,
        limit: 20,
        total: 0,
        list: [],
        loading: false,
        get_data() {
          var that = this
          api.get('/user_cares/fans', {
            data: {
              uid: vm.uid,
              page: that.page,
              limit: that.limit
            },
            success: function (data) {
              if (data.list.length > 0) {
                that.page += 1
              }
              data.list.forEach(function (a) {
                that.list.push(a)
              })
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

      cares: {
        page: 1,
        limit: 20,
        total: 0,
        list: [],
        loading: false,
        get_data() {
          var that = this
          api.get('/user_cares/cares', {
            data: {
              uid: vm.uid,
              page: that.page,
              limit: that.limit
            },
            success: function (data) {
              if (data.list.length > 0) {
                that.page += 1
              }
              data.list.forEach(function (a) {
                that.list.push(a)
              })
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
    care(user, state) {
      var vm = this
      api.post("/users/care", {
        data: {
          uid: user.uid,
          state: state
        },
        success: function (data) {
          user.is_care = state
        },
        error: function (code, msg, data) {
        },
        must: function (err) {
        }
      })
    },
    get_user_detail() {
      var vm = this
      api.get("/users/detail", {
        data: {
          uid: vm.uid,
        },
        success: function (data) {
          vm.user = data
          vm.tabs.tabs.fans.name = `粉丝 ${data.fans_count}`
          vm.tabs.tabs.cares.name = `关注 ${data.cares_count}`
        },
        error: function (code, msg, data) {
        },
        must: function (err) {
        }
      })
    },
  },
  mounted() {
    var vm = this
    vm.tabs.active = vm.$router.currentRoute.value.params.tab
    vm.uid = vm.$router.currentRoute.value.params.uid

    vm.get_user_detail()
    api.get_current_user_if_login()
    setTimeout(function () {
      vm.fans.init()
      vm.cares.init()
    }, 200)
  }
}
</script>

<style lang="less" scoped>
</style>
