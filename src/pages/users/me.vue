<template xmlns:slot="http://www.w3.org/1999/xhtml">
  <div class="w_100">
    <!-- 第一部分（头像，背景图，介绍等） -->
    <div class="pos-rel" :style="`background-size: 100%;background-position: 50%;background-repeat: no-repeat;height: 210px;
    background-image: url('${$store.state.user.bg_img.split(',')[0]}')`"
    >
      <!--      <div class="pdt10 pdf10" style="color: #fff;position: fixed;text-shadow: 1px 1px 1px #555;">-->
      <!--        <span @click="click_left()"><van-icon name="arrow-left"/> 返回</span>-->
      <!--      </div>-->
      <div style="height: 35px;"></div>
      <div class="text-center pointer">
        <img style="width: 70px;height: 70px;border: 3px solid #fff;border-radius: 50%;z-index: 10;"
             :src="$store.state.user.head_img"
             @click="api.preview_imgs($store.state.user.head_img, [$store.state.user.head_img, $store.state.user.bg_img.split(',')[0]])"
        >
      </div>
      <div class="text-center pointer" style="font-size: 20px;color: #fff;text-shadow: 1px 1px 1px #555;">
        {{ $store.state.user.nick_name }}
      </div>

      <div class="text-center mgt10"
           style="padding-left:10px;padding-right:10px;font-size: 14px;color: #fff;text-shadow: 1px 1px 1px #555;">
        {{ $store.state.user.info }}
      </div>

      <!--    count-->
      <div class="text-center mgt5" style="font-size: 14px;color: #FFF;">
        <!--        <span style="text-shadow: 1px 1px 1px #555;"> 购买课时 {{ $store.state.user.order_count }} |</span>-->
        <span style="text-shadow: 1px 1px 1px #555;">
          获赞
          {{ $store.state.user.like_count || 0 }}
          &nbsp;&nbsp;</span>
        <span style="text-shadow: 1px 1px 1px #555;" class="pointer"
              @click="api.to_page(`/users/fans_cares/${$store.state.user.uid}?tab=fans`)">
          粉丝
          {{ $store.state.user.fans_count }} &nbsp;&nbsp;
        </span>
        <span style="text-shadow: 1px 1px 1px #555;" class="pointer"
              @click="api.to_page(`/users/fans_cares/${$store.state.user.uid}?tab=cares`)">
          关注
          {{ $store.state.user.cares_count }}
        </span>
      </div>

      <!--      右上角-->
      <div @click="pop_show=true" class="pos-abs white pd10 pointer"
           style="font-size:28px;right:0px;top:0px;text-shadow: 1px 1px 1px #555;">
        <van-icon name="wap-nav"
                  :badge="$store.state.user.not_read_count == 0 ? null : $store.state.user.not_read_count"/>
      </div>
      <!--      新增访客-->
      <!--      <div v-if="$store.state.$store.state.user.new_guides_count > 0" @click="api.to_page('/users/gudies')" class="pos-abs white" style="right:10px;top:13px;text-shadow: 1px 1px 1px #555;">-->
      <!--        <van-icon name="friends-o" style="margin-top:3px;font-size:20px;">-->
      <!--          <span style="margin-left:5px;margin-right:20px;font-size: 14px">新增访客 {{3}}</span>-->
      <!--        </van-icon>-->
      <!--      </div>-->
    </div>

    <!--    分享码 uid-->
    <div class="pd10 pointer" style="font-size: 14px;color:#222">
      <span style="color:#888">
        学币余额：<span>
          <van-icon name="balance-o" color="#1989FA"/>
        </span>
        <span style="color:#1091FF" @click="api.to_page(`/users/score`)">{{ $store.state.user.score }}</span>
      </span>
      <div class="fr mgl20" style="color:#1091FF" @click="pop_show=true">
        功能菜单
      </div>
      <div class="fr mgr10" style="color:#1091FF" @click="api.to_page(`/share_infos`)">
        <van-badge content="热">
          赚学币
        </van-badge>
      </div>
    </div>

    <!--    个人长简介-->
    <div class="pdl10 pdr10 pdb10" style="border-bottom: 1px solid #ddd;font-size: 14px;color:#222">
      <div class="mgb5" v-for="info in $store.state.user.info_long.split('\n')">
        <div style="word-break: break-all;">{{ info }}</div>
      </div>
    </div>


    <!-- 第二部分，可切换tabs标签 -->
    <Tabs :data="tabs" class="mgt15">
      <template v-slot:[`blogs`]>
        <div class="pd10 mgt10" style="min-height: 800px;">
          <div style="" v-for="(blog, i) in blogs.list" :key="i" class="mgb30">
            <div class="mgt10" style="color:#999;font-size: 13px;word-break: break-all;"
                 @click="api.to_page(`/blogs/detail/${blog.id}`)">
              {{ new Date(blog.created_at).format("yyyy-MM-dd hh:mm:ss") }}
            </div>
            <div class="mgt10" style="color:#555;font-size: 15px;word-break: break-all;"
                 @click="api.to_page(`/blogs/detail/${blog.id}`)">
              {{ blog.type == 'article' ? '【文章】 ' : '' }}{{ blog.desc }}
            </div>
            <!--            图片-->
            <div class="fx mgt10" v-if="blog.imgs_arr.length >= 0">
              <div v-for="img in blog.imgs_arr.slice(0,3)" class="mgr10" style="width:30%">
                <img :src="api.mini_img(blog.created_at, img,200)"
                     @click="api.preview_imgs(img, blog.imgs_arr)"
                     class="pointer" style="border:1px solid #ddd;width:100%;border-radius: 10px;">
              </div>
            </div>
            <div class="fx mgt5" v-if="blog.imgs_arr.length > 4">
              <div v-for="img in blog.imgs_arr.slice(3,6)" class="mgr10" style="width:30%">
                <img :src="api.mini_img(blog.created_at, img,200)"
                     @click="api.preview_imgs(img, blog.imgs_arr)"
                     class="pointer" style="border:1px solid #ddd;width:100%;border-radius: 10px;">
              </div>
            </div>
            <div class="fx mgt5" v-if="blog.imgs_arr.length > 6">
              <div v-for="img in blog.imgs_arr.slice(6,9)" class="mgr10" style="width:30%">
                <img :src="api.mini_img(blog.created_at, img,200)"
                     @click="api.preview_imgs(img, blog.imgs_arr)"
                     class="pointer" style="border:1px solid #ddd;width:100%;border-radius: 10px;">
              </div>
            </div>
            <div v-else-if="blog.imgs_arr.length == 1" style="width:68%">
              <img :src="api.mini_img(blog.created_at, blog.imgs_arr[0],400)"
                   @click="api.preview_imgs(blog.imgs_arr[0], blog.imgs_arr)"
                   class="pointer mgt10" style="border:1px solid #ddd;width:100%;border-radius: 10px;">
            </div>
          </div>

          <div v-if="blogs.list.length == 0">
            <div class="pd10 text-center" style="font-size: 17px;">
              还没有在广场发布任何内容，<span class="pointer" style="color:#1AADFF"
                                 @click="api.to_page(`/blogs/add_dynamic`)">去发一篇</span>
            </div>
          </div>
          <PullButton class="mgt30" :data="blogs"></PullButton>
        </div>
      </template>
    </Tabs>

    <van-popup v-model:show="pop_show" position="right" style="height:100%;width:40%">
      <div class="mgt10" style="font-size: 14px;color:#400">
        <div class="fx" style="padding:10px;" @click="api.to_page('/users/edit')">
          <div class="f1 pointer">
            编辑资料
          </div>
          <div>
            <van-icon name="arrow" color="#555"/>
          </div>
        </div>
        <div class="fx" style="padding:10px;" v-if="$store.state.user.phone=='' || $store.state.user.phone==null"
             @click="api.to_page('/users/bind_phone')">
          <div class="f1 pointer">
            绑定手机
          </div>
          <div>
            <van-icon name="arrow" color="#555"/>
          </div>
        </div>
        <div class="fx" style="padding:10px;" v-if="$store.state.user.unionid=='' || $store.state.user.unionid==null"
             @click="api.bind_wx()">
          <div class="f1 pointer">
            绑定微信
          </div>
          <div>
            <van-icon name="arrow" color="#555"/>
          </div>
        </div>
        <div class="fx" style="padding:10px;"
             @click="click_share_me()">
          <div class="f1 pointer">
            分享自己
          </div>
          <div>
            <van-icon name="arrow" color="#555"/>
          </div>
        </div>
        <div class="fx" style="padding:10px;" @click="api.to_page('/messages')">
          <div class="f1 pointer">
            消息中心
            <van-badge :content="$store.state.user.not_read_count == 0 ? null : $store.state.user.not_read_count"
                       max="99"></van-badge>
          </div>
          <div>
            <van-icon name="arrow" color="#555"/>
          </div>
        </div>
        <div class="fx" style="padding:10px;" @click="api.to_page('/users/score')">
          <div class="f1 pointer">
            学币充值
          </div>
          <div>
            <van-icon name="arrow" color="#555"/>
          </div>
        </div>
        <div class="fx" style="padding:10px;" @click="api.to_page('/orders/index')">
          <div class="f1 pointer">
            我的订单
            <van-badge content="" max="99"></van-badge>
          </div>
          <div>
            <van-icon name="arrow" color="#555"/>
          </div>
        </div>
        <div class="fx" style="padding:10px;" @click="api.to_page('/share_infos')">
          <div class="f1 pointer">
            赚学币
            <van-badge content="" max="99"></van-badge>
          </div>
          <div>
            <van-icon name="arrow" color="#555"/>
          </div>
        </div>
        <div class="fx" style="padding:10px;" @click="api.to_page('/users/awards')">
          <div class="f1 pointer">
            奖励中心
            <van-badge content="" max="99"></van-badge>
          </div>
          <div>
            <van-icon name="arrow" color="#555"/>
          </div>
        </div>
        <div class="fx" style="padding:10px;" @click="to_177weilai()">
          <div class="f1">
            关于我们
            <van-badge content="" max="99"></van-badge>
          </div>
          <div>
            <van-icon name="arrow" color="#555"/>
          </div>
        </div>
        <div class="fx pos-abs bottom20 w_100" style="padding:10px;" @click="api.exit_login()">
          <div class="f1 pointer">
            注销登录
          </div>
          <div class="pos-rel" style="right:33px;">
            <van-icon name="arrow" color="#555"/>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import api from "@/apis"
import BottomBar from "@/pages/base/BottomBar.vue"
import PullButton from "@/components/base/PullButton.vue"
import Tabs from "@/components/base/Tabs.vue"
import Share from "@/pages/base/Share.vue"

export default {
  components: {
    BottomBar, PullButton, Tabs, Share
  },
  data() {
    var vm = this
    return {
      api: api,
      share: {},
      tabs: {
        shrink: false,
        sticky: true,
        type: 'line',
        active: 'blogs',
        tabs: {
          blogs: {
            name: '我的广场',
          },
          curriculums: {
            name: '我购买的课程',
          },
        }
      },
      pop_show: false,

      blogs: {
        page: 1,
        limit: 20,
        total: 0,
        list: [],
        loading: false,
        get_data() {
          var that = this
          api.get('/blogs/my_list', {
            data: {
              page: that.page,
              limit: that.limit
            },
            success: function (data) {
              if (data.list.length > 0) {
                that.page += 1
              }
              data.list.forEach(function (a) {
                if (a.imgs) {
                  a.imgs_arr = a.imgs.split(',')
                } else {
                  a.imgs_arr = []
                }
                if (a.type == 'article') {
                  a.desc = a.title
                } else {
                  a.desc = `${a.content.replace(/<br\/>/g, "").replace(/&emsp;/g, "").replace(/`/g, "").replace(/#/g, "").slice(0, 30)}${a.content.length > 30 ? '...' : ''}`
                }
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
    to_177weilai() {
      window.location.href = 'https://177weilai.com'
    },
    click_share_me() {
      var vm = this
      vm.pop_show = false
      vm.share.tips_click_wx = true
      api.notify(`可点右上角分享按钮`)
      setTimeout(function () {
        api.to_page(`/users/detail/${vm.$store.state.user.uid}`)
      }, 1000)
    },
    get_award(curriculum_catalog_order) {
      var vm = this
      if (curriculum_catalog_order.award_id > 0) {
        api.notify(`已经领取过该小节的学习奖励`)
        setTimeout(function () {
          api.to_page(`/users/awards`)
        }, 1000)
        return
      }
      if (curriculum_catalog_order.play_rate < 80) {
        api.notify(`学习完成度需要达到100%才可领取哦！`)
        return
      }
      api.post("/awards/get", {
        auth: true,
        data: {
          o_id: curriculum_catalog_order.id,
          o_type: 'CurriculumCatalogOrder'
        },
        success: function (data, msg) {
          curriculum_catalog_order = data
          curriculum_catalog_order.allow_get_award = false
          api.notify(`学习奖励领取成功，本次领取学币${data.score}`)
          vm.$store.state.not_read_count += 1
        },
        error: function (code, msg, data) {
        },
        must: function (err) {
        }
      })
    },
    click_left() {
      var vm = this
      api.to_page(`/`)
    },
  },
  watch: {},
  mounted() {
    var vm = this
    api.get_current_user(function (data) {
      vm.blogs.init()
    })
  },
}
</script>

<style scoped>

</style>
