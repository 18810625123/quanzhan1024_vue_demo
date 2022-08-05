<template>
  <div class="">

    <van-nav-bar
        :style="`${$store.state.sys_env=='pc'?`width:${$store.state.sys_env=='pc'?'600px':'100%;'};position: fixed;top: 0;`:''}`"
        :fixed="!$store.state.sys_env=='pc'"
        title="奖励中心"
        left-text="返回"
        @click-left="$router.back()"
    >
    </van-nav-bar>
    <div style="height:50px;" v-if="$store.state.sys_env=='pc'"></div>

    <div class="fx-center mgt10 mgb10 pointer" style="font-size:15px;">
      <div class="f1 fx-center" style="color:#777;" @click="api.to_page(`/users/score`)">
        <span>我的学币余额 </span>
        <van-icon name="balance-o" color="#1989FA"/>
        {{ $store.state.user.score }}
      </div>
    </div>

    <Tabs :data="tabs" class="">

      <template v-slot:[`CurriculumCatalogOrder`]>
        <div class="pd10" style="min-height: 300px;">
          <div class="pd10  mgb10" style="font-size: 14px;">
            <div class="mgb20" style=""
                 v-for="(award, i) in awards0.list">
              <div style="border-bottom: 1px solid #ddd;padding-bottom: 10px;">
                <div class="">
            <span class="" style="color:#777;">
              状态：<span :style="`color:${award.state == 1 ? '#52A7FF' : 'red'}`">
              {{ award.state == 1 ? '领取成功' : `待领取` }}
            </span>
            </span>
                </div>
                <div class="mgt5" v-if="award.o">
                  <div class="mgr20" style="color:#777;">奖励类型：<span style="color:#52A7FF">{{ award_category(award) }}</span></div>
                </div>
                <div class="mgt5">
                  <span class="mgr20" style="color:#777;">奖励学币：<span style="color:#52A7FF">{{ award.score }}</span></span>
                </div>
                <div class="mgt5">
              <span class="" style="color:#777;">领取时间： {{
                  new Date(award.created_at).format("MM-dd hh:mm")
                }}</span>
                </div>
              </div>
            </div>
          </div>
          <PullButton class="mgt20" :data="awards0"></PullButton>
        </div>
      </template>

      <template v-slot:[`InviteUserRegister`]>
        <div class="pd10" style="min-height: 300px;">
          <div class="pd10  mgb10" style="font-size: 14px;">
            <div class="mgb20" style=""
                 v-for="(award, i) in awards1.list">
              <div style="border-bottom: 1px solid #ddd;padding-bottom: 10px;">
                <div class="">
            <span class="" style="color:#777;">
              状态：<span :style="`color:${award.state == 1 ? '#52A7FF' : 'red'}`">
              {{ award.state == 1 ? '领取成功' : `待领取` }}
            </span>
            </span>
                </div>
                <div class="mgt5" v-if="award.o">
                  <div class="mgr20" style="color:#777;">奖励类型：<span style="color:#52A7FF">{{ award_category(award) }}</span></div>
                </div>
                <div class="mgt5">
                  <span class="mgr20" style="color:#777;">奖励学币：<span style="color:#52A7FF">{{ award.score }}</span></span>
                </div>
                <div class="mgt5">
              <span class="" style="color:#777;">领取时间： {{
                  new Date(award.created_at).format("MM-dd hh:mm")
                }}</span>
                </div>
              </div>
            </div>
          </div>
          <PullButton class="mgt20" :data="awards1"></PullButton>
        </div>
      </template>

      <template v-slot:[`All`]>
        <div class="pd10" style="min-height: 300px;">
          <div class="pd10  mgb10" style="font-size: 14px;">
            <div class="mgb20" style=""
                 v-for="(award, i) in awards2.list">
              <div style="border-bottom: 1px solid #ddd;padding-bottom: 10px;">
                <div class="">
            <span class="" style="color:#777;">
              状态：<span :style="`color:${award.state == 1 ? '#52A7FF' : 'red'}`">
              {{ award.state == 1 ? '领取成功' : `待领取` }}
            </span>
            </span>
                </div>
                <div class="mgt5">
                  <div class="mgr20" style="color:#777;">奖励类型：<span style="color:#52A7FF">{{ award_category(award) }}</span></div>
                </div>
                <div class="mgt5">
                  <span class="mgr20" style="color:#777;">奖励学币：<span style="color:#52A7FF">{{ award.score }}</span></span>
                </div>
                <div class="mgt5">
              <span class="" style="color:#777;">领取时间： {{
                  new Date(award.created_at).format("MM-dd hh:mm")
                }}</span>
                </div>
              </div>
            </div>
          </div>
          <PullButton class="mgt20" :data="awards2"></PullButton>
        </div>
      </template>
    </Tabs>


    <div style="height: 100px;"></div>
  </div>
</template>

<script>
import api from "@/apis"
import BottomBar from "@/pages/base/BottomBar.vue"
import Message from "@/components/base/Message.vue"
import PullButton from "@/components/base/PullButton.vue"
import Button from "@/components/base/Button.vue"
import Tabs from "@/components/base/Tabs.vue"

export default {
  components: {
    BottomBar, Message, PullButton, Button, Tabs
  },
  data() {
    var vm = this
    return {
      api: api,
      tabs: {
        shrink: false,
        sticky: false,
        active: 'All',
        type: "card",
        tabs: {
          CurriculumCatalogOrder: {
            name: '学习奖励',
          },
          InviteUserRegister: {
            name: '邀请注册奖励',
          },
          All: {
            name: '全部奖励',
          },
        }
      },
      awards0: {
        page: 1,
        limit: 10,
        total: 0,
        list: [],
        loading: false,
        get_data() {
          var that = this
          api.get('/awards/my_list', {
            data: {
              category: 'CurriculumCatalogOrder',
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
      awards1: {
        page: 1,
        limit: 10,
        total: 0,
        list: [],
        loading: false,
        get_data() {
          var that = this
          api.get('/awards/my_list', {
            data: {
              category: 'InviteUserRegister',
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
      awards2: {
        page: 1,
        limit: 10,
        total: 0,
        list: [],
        loading: false,
        get_data() {
          var that = this
          api.get('/awards/my_list', {
            data: {
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
    click_tab(tab) {
      var vm = this
      vm.category = ['', 'InviteUserRegister', 'CurriculumCatalogOrder'][tab.name]
    },
    award_category(award) {
      var kv = {
        CurriculumCatalogOrder: '学习奖励',
        Order: '首充奖励',
        InviteUserRegister: '邀请用户注册奖励',
        UserRegister: '注册奖励',
        BuyCurriculum: '购课奖励',
        AddBlog: '发文奖励',
      }
      return kv[award.category]
    }
  },
  watch: {},
  mounted() {
    var vm = this
    api.get_current_user(function () {
      setTimeout(function () {
        vm.awards0.init()
        vm.awards1.init()
        vm.awards2.init()
      }, 300)
    })
    if (vm.$route.query.o_type) {
      console.log(111, vm.tabs.current)
      vm.tabs.active = vm.$route.query.o_type
      console.log(111, vm.tabs.current)

    }
  },
}
</script>

<style scoped>

</style>
