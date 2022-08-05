<template>
  <div class="">
    <!--  logo  -->
    <div v-if="!api.is_wx()">
      <van-nav-bar
          :style="`${$store.state.sys_env=='pc'?`width:${$store.state.sys_env=='pc'?'600px':'100%;'};position: fixed;top: 0;`:''}`"
          :fixed="!$store.state.sys_env=='pc'"
          title="学习广场"
          :left-text="left_text"
          @click-right="publish.show = true"
          @click-left="click_left()"
      >
        <template #right>
          <div class="fx-center" style="font-size: 14px;">
            <span class="mgr5"></span>
            <van-icon name="add-o" size="18"/>
          </div>
        </template>
      </van-nav-bar>
      <div style="height:50px;" v-if="$store.state.sys_env=='pc'"></div>
    </div>

    <van-notice-bar
        left-icon="volume-o"
        text="学习广场的设计目的旨在让大家在编程学习之余可以随时记录自己的学习心得、笔记"
    />

    <form action="/">
      <van-search
          v-model="search.value"
          :placeholder="search.desc"
          @search="search.search"
          @cancel="search.cancel"
      >
        <!--        <template #action>-->
        <!--          <div @click="search.value=''">清除</div>-->
        <!--        </template>-->
      </van-search>
    </form>


    <!--    blogs  查看更多-->
    <div class="pdl10 pdr10 pdb10 mgt10" style="overflow-x: scroll;">
      <div style="" class="pdb20" v-for="(blog, i) in blogs.list" :key="i">
        <div class="fx mgb20">
          <!--        左 图-->
          <div class="mgr10" style="">
            <img :src="blog.user.head_img" class="pointer"
                 @click="api.to_page(`/users/detail/${blog.user.uid}`)"
                 style="border:1px solid #ddd;border-radius: 50%;width:45px;height:45px;">
          </div>
          <!--        右-->
          <div class="">
            <div class="pointer fx "
                 style="font-size: 16px;color:#666;word-break: break-all;width:100%">
              <div class="f1" @click="api.to_page(`/users/detail/${blog.user.uid}`)">{{ blog.user.nick_name }}</div>
              <div v-if="api.current_user('uid') != blog.user.uid && !blog.user.is_care"
                   @click="care(blog.user, 1)"
                   style="color:#0D9EFF;font-size:14px;">
                +关注
              </div>
            </div>
            <div class="pointer mgt5"
                 style="font-size: 13px;word-break: break-all;color:#AAA">
              发布于 {{ new Date(blog.created_at).format('MM-dd hh:mm') }}
            </div>
            <div v-if="blog.title" class="pointer mgt10"
                 style="font-size: 16px;word-break: break-all;">
              <span @click="api.to_page(`/blogs/detail/${blog.id}`)">
                              {{ blog_category(blog) }}{{ blog.title }}
              </span>
            </div>
            <div class="mgt5 pointer"
                 @click="api.to_page(`/blogs/detail/${blog.id}`)"
                 style="font-size: 15px;color:#444;word-break: break-all;line-height: 20px;">
              {{ blog.desc }}
            </div>

            <!--            图片-->
            <div>
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

            <!--         count -->
            <div class="mgt15"
                 style="overflow-x: hidden">
              <span class="mgr30" style="color:#AAA;font-size: 13px;">
                阅读
                {{ blog.read_count }}
              </span>
              <span class="mgr30"
                    @click="user_comment.open('Blog', blog)"
                    style="color:#AAA;font-size: 13px;">
                <van-icon
                    size="15"
                    name="chat-o"
                    color="#0D9EFF"
                />
                评论
                {{ blog.comment_count }}
              </span>
              <span class="mgr20"
                    @click="like(blog, blog.is_like == 1 ? 0 : 1)"
                    style="color:#AAA;font-size: 13px;">
                <van-icon
                    size="15"
                    :name="blog.is_like?'like':'like-o'"
                    :color="blog.is_like?'red':'#0D9EFF'"
                />
                点赞
                {{ blog.like_count }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <PullButton class="mgt30" :data="blogs"></PullButton>
    </div>

    <van-share-sheet
        v-model:show="publish.show"
        :title="publish.title"
        :description="publish.desc"
        :options="publish.options"
        @select="publish.click"
    />

    <UserComment :data="user_comment"></UserComment>

    <!--      pc备案号-->
    <div class="text-center"
         style="margin-top:200px;width:100%;background:#fff;">
      <a style="color:#555;font-size:15px;" target="_blank" href="https://beian.miit.gov.cn/#/Integrated/recordQuery">©
        2022 京ICP备2022017918号-3</a>
    </div>
  </div>
</template>


<script>
import api from "@/apis"
import BottomBar from "@/pages/base/BottomBar.vue"
import Message from "@/components/base/Message.vue"
import Imgs from "@/components/base/Imgs.vue"
import Slide from "@/components/base/Slide.vue"
import PullButton from "@/components/base/PullButton.vue"
import UserComment from "@/pages/base/UserComment.vue"
import Share from "@/pages/base/Share.vue"

export default {
  components: {
    BottomBar, Message, Imgs, Slide, PullButton, UserComment, Share
  },
  data() {
    var vm = this
    return {
      api: api,
      share: {},
      user_comment: {
        comment_success(data, blog) {
          blog.is_comment = 1
          blog.comment_count += 1
        },
      },

      search: {
        value: '',
        desc: '搜索关键词（用户昵称、广场内容）',
        search(v) {
          console.log(`search: ${v}`)
          vm.blogs.init()
        },
        cancel(a) {
          console.log(`cancel: ${a}`)
          vm.blogs.init()
        }
      },
      publish: {
        show: false,
        title: '发布内容',
        options: [
          {
            name: '发布动态', icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/custom-icon-fire.png', click() {
              vm.$router.push('/blogs/add_dynamic')
            }
          },
          {
            name: '发布文章', icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/custom-icon-fire.png', click() {
              api.to_page('/blogs/add_article')
            },
          }
        ],
        click(option, index) {
          var vm = this
          option.click()
        },
      },
      curriculums: [],

      blogs: {
        page: 1,
        limit: 20,
        total: 0,
        list: [],
        loading: false,
        get_data() {
          var that = this
          api.get('/blogs/index', {
            data: {
              search: vm.search.value,
              page: that.page,
              limit: that.limit
            },
            success: function (data) {
              if (data.list.length > 0) {
                that.page += 1
              }
              data.list.forEach(function (a) {
                var connte_first100 = a.content.slice(0, 200)
                var content = connte_first100.replace(/<br\/>/g, "").replace(/&emsp;/g, "").replace(/`/g, "").replace(/#/g, "")
                var desc = content.slice(0, 120)
                if (desc.length < content.length) desc = `${desc}...`
                a.desc = desc
                if (a.imgs) {
                  a.imgs_arr = a.imgs.split(',')
                } else {
                  a.imgs_arr = []
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
    care(user, state) {
      var vm = this
      api.post("/users/care", {
        data: {
          uid: user.uid,
          state: state
        },
        success: function (data) {
          user.is_care = state
          if (state == 1) {
            api.notify(`关注成功`)
          } else {
            api.notify(`取消关注成功`)
          }
        },
        error: function (code, msg, data) {
        },
        must: function (err) {
        }
      })
    },
    like(blog, state) {
      var vm = this
      api.post("/user_likes/like", {
        data: {
          o_id: blog.id,
          o_type: 'Blog',
          state: state
        },
        success: function (data) {
          blog.is_like = state
          if (state == 1) {
            blog.like_count += 1
          } else {
            blog.like_count -= 1
          }
        },
        error: function (code, msg, data) {
        },
        must: function (err) {
        }
      })
    },
    blog_category(blog) {
      var kv = {
        article: '文章',
        dynamic: '动态',
      }
      return ''
      return `[${kv[blog.type]}]`
    },
    click_left() {
      var vm = this
      if (localStorage.getItem('user')) {
        console.log('用户已登录')
      } else {
        api.to_page('/login')
      }
    },
    click_user_head(user) {
      var vm = this
      api.to_page(`/users/detail/${user.uid}`)
    },
  },
  computed: {
    left_text() {
      var vm = this
      return localStorage.getItem('user') ? '' : '登录'
    }
  },
  watch: {},
  mounted() {
    var vm = this
    vm.blogs.init()
  },
}
</script>

<style less scoped>
::-webkit-scrollbar {
  display: none
}
</style>
