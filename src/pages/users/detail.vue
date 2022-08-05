<template>
  <div class="w_100">
    <!-- 第一部分（头像，背景图，介绍等） -->
    <div class="pos-rel" :style="`background-size: 100%;background-position: 50%;background-repeat: no-repeat;height: 210px;
    background-image: url('${user.bg_img.split(',')[0]}')`">
      <div class="pdt10 pdf10 " style="color: #fff;text-shadow: 1px 1px 1px #555;">
        <span @click="$router.back()" class="pointer"><van-icon name="arrow-left"/> 返回</span>
      </div>
      <div style="height: 10px;"></div>
      <div class="text-center">
        <img style="width: 70px;height: 70px;border: 3px solid #fff;border-radius: 50%;"
             @click="api.preview_imgs(user.head_img, [user.head_img, user.bg_img.split(',')[0]])"
             :src="user.head_img">
      </div>
      <div class="text-center" style="font-size: 20px;color: #fff;text-shadow: 1px 1px 1px #555;">
        {{ user.nick_name }}
      </div>

      <div class="text-center mgt10"
           style="padding-left:10px;padding-right:10px;font-size: 14px;color: #fff;text-shadow: 1px 1px 1px #555;">
        {{ user.info }}
      </div>
      <!--    count-->
      <div class="text-center mgt5" style="font-size: 14px;color: #FFF;">
        <!--        <span style="text-shadow: 1px 1px 1px #555;"> 购买课时 {{ $store.state.user.order_count }} |</span>-->
        <span style="text-shadow: 1px 1px 1px #555;">
                获赞
                {{ user.like_count || 0 }} &nbsp;&nbsp;
              </span>
        <span style="text-shadow: 1px 1px 1px #555;" class="pointer"
              @click="api.to_page(`/users/fans_cares/${user.uid}?tab=fans`)">
                粉丝
                {{ user.fans_count }} &nbsp;&nbsp;
              </span>
        <span style="text-shadow: 1px 1px 1px #555;" class="pointer"
              @click="api.to_page(`/users/fans_cares/${user.uid}?tab=cares`)">
                关注
                {{ user.cares_count }}
              </span>
      </div>

      <!--      新增访客-->
      <!--      <div v-if="$store.state.user.new_guides_count > 0" @click="api.to_page('/users/gudies')" class="pos-abs white" style="right:10px;top:13px;text-shadow: 1px 1px 1px #555;">-->
      <!--        <van-icon name="friends-o" style="margin-top:3px;font-size:20px;">-->
      <!--          <span style="margin-left:5px;margin-right:20px;font-size: 14px">新增访客 {{3}}</span>-->
      <!--        </van-icon>-->
      <!--      </div>-->
    </div>

    <!--    个人长简介-->
    <div class="pd10" style="border-bottom: 1px solid #ddd;font-size: 14px;color:#222">
      <div class="mgb5" v-for="info in user.info_long.split('\n')">
        <div style="word-break: break-all;">{{ info }}</div>
      </div>
    </div>

    <!--    关注、私信-->
    <div class="fx-center mgt10" style="padding-left: 10px;padding-right: 10px;" v-if="!is_self">
      <!--      <button v-if="user.is_care == 1" class="text-center mbtn" @click="not_care_popup=true"-->
      <!--              :style="`padding:7px 0px 7px 0px;width:100%;color:#000;border:0px;font-size:14px;-->
      <!--             margin-right: 10px;background:#DDD;border-radius: 5px;`">已关注-->
      <!--        <van-icon name="arrow-down"/>-->
      <!--      </button>-->
      <!--      <button v-else class="text-center mbtn" @click="care(1)"-->
      <!--              :style="`padding:7px 0px 7px 0px;width:100%;color:#fff;border:0px;font-size:14px;-->
      <!--             margin-right: 10px;background:red;border-radius: 5px;`">+关注-->
      <!--      </button>-->
      <button class="text-center mbtn" @click="api.to_page(`/messages/detail?from_id=${user.id}`)"
              :style="`padding:7px 0px 7px 0px;width:100%;color:#000;border:0px;font-size:14px;
             background:#DDD;border-radius: 5px;`">私信
      </button>
    </div>


    <!-- 第二部分，可切换tabs标签 -->
    <Tabs :data="tabs" class="mgt10">
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
            <div v-if="blog.imgs_arr.length > 1">
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
            </div>
            <div v-else-if="blog.imgs_arr.length == 1" style="width:68%">
              <img :src="api.mini_img(blog.created_at, blog.imgs_arr[0],400)"
                   @click="api.preview_imgs(blog.imgs_arr[0], blog.imgs_arr)"
                   class="pointer mgt10" style="border:1px solid #ddd;width:100%;border-radius: 10px;">
            </div>
          </div>
          <div v-if="blogs.list.length == 0">
            <div class="pd10 text-center" style="font-size: 17px;">
              他还没有在广场发布任何内容
            </div>
          </div>
          <PullButton class="mgt30" :data="blogs"></PullButton>
        </div>
      </template>
    </Tabs>


    <van-popup
        v-model:show="not_care_popup"
        close-icon="close"
        position="bottom"
        :style="{ height: '30%' }">
      <div class="pd10">
        <button class="text-center mbtn mgb30" @click="not_care_popup = false ;share.tips_click_wx = true"
                :style="`padding:7px 0px 7px 0px;width:100%;color:#fff;border:0px;font-size:14px;
             background:#5EACFF;border-radius: 5px;`">分享他的名片到微信
        </button>
        <button class="text-center mbtn mgb10" @click="care(0)"
                :style="`padding:7px 0px 7px 0px;width:100%;color:#fff;border:0px;font-size:14px;
             background:#DDD;border-radius: 5px;`">取消关注
        </button>
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
      uid: null,
      not_care_popup: false,

      tabs: {
        shrink: false,
        sticky: true,
        active: 'blogs',
        type: 'line',
        tabs: {
          blogs: {
            name: '他的广场',
          },
          curriculums: {
            name: '他已购买的课程',
          },
        }
      },

      blogs: {
        page: 1,
        limit: 10,
        total: 0,
        list: [],
        loading: false,
        get_data() {
          var that = this
          api.get('/blogs/list', {
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


      user: {
        bg_img: '',
        info_long: ''
      },
      btn1: {
        name: '+ 关注',
        type: 'primary',
        size: 'small',
        click() {
          console.log(23)
        }
      },
      btn2: {
        name: '私信',
        type: 'primary',
        size: 'small',
        click() {
          console.log(23)
        }
      }
    }
  },
  methods: {
    get_user_detail(uid) {
      var vm = this
      api.get("/users/detail", {
        data: {
          uid: vm.uid,
        },
        success: function (data) {
          vm.user = data
        },
        error: function (code, msg, data) {
        },
        must: function (err) {
        }
      })
    },
    care(state) {
      var vm = this
      if (state == 0) {
        vm.not_care_popup = false
      }
      api.post("/users/care", {
        data: {
          uid: vm.user.uid,
          state: state
        },
        success: function (data) {
          vm.user.is_care = state
          vm.get_user_detail()
        },
        error: function (code, msg, data) {
        },
        must: function (err) {
        }
      })
    },
  },
  computed: {
    is_self() {
      var vm = this
      try {
        return JSON.parse(localStorage.getItem('user')).uid == vm.uid
      } catch (e) {
      }
      return false
    }
  },
  watch: {},
  mounted() {
    var vm = this
    vm.uid = vm.$router.currentRoute.value.params.uid
    vm.get_user_detail()
    // api.get_current_user()
    if (vm.uid == '111111') {
      vm.tabs.tabs.curriculums.name = '他发布的课程'
      setTimeout(function () {
        vm.blogs.init()
      }, 200)
    } else {
      setTimeout(function () {
        vm.blogs.init()
      }, 200)
    }
  },
}
</script>

<style scoped>
.mbtn:active {
  opacity: 0.8;
}
</style>
