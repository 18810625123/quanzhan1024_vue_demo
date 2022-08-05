<template>
  <div class="">
    <van-nav-bar
        :style="`${$store.state.sys_env=='pc'?`width:${$store.state.sys_env=='pc'?'600px':'100%;'};position: fixed;top: 0;`:''}`"
        :fixed="!$store.state.sys_env=='pc'"
        :title="blog.title"
        left-text="返回"
        left-arrow
        @click-left="$router.back()">
      <template #right>
        <van-icon @click="share.tips_click_wx=true" name="share-o" size="18"/>
      </template>
    </van-nav-bar>
    <div style="height:50px;" v-if="$store.state.sys_env=='pc'"></div>

    <div class="pd10">
      <div v-if="blog.title" class="mgb20" style="font-size: 23px;">
        <b>{{ blog.title }}</b>
      </div>

      <!--      用户头像-->
      <div class="fx mgb20">
        <!--        左 图-->
        <div class="mgr10" style="">
          <img :src="blog.user.head_img" class="pointer"
               @click="api.to_page(`/users/detail/${blog.user.uid}`)"
               style="border:1px solid #ddd;border-radius: 50%;width:45px;height:45px;">
        </div>
        <!--        右-->
        <div class="w_100">
          <div class="pointer fx"
               style="font-size: 16px;word-break: break-all;width:100%">
            <div class="f1"
                 style="color:#0DBDFF"
                 @click="api.to_page(`/users/detail/${blog.user.uid}`)">
              {{ blog.user.nick_name }}
            </div>
            <div v-if="api.current_user('uid') != blog.user.uid && !blog.user.is_care"
                 @click="care(blog.user, 1)"
                 class="fr"
                 style="color:#0D9EFF;font-size:14px;">
              +关注
            </div>
          </div>
          <div class="pointer mgt5"
               style="font-size: 13px;word-break: break-all;color:#AAA">
            发布于 {{ new Date(blog.created_at).format('MM-dd hh:mm') }}
          </div>
        </div>
      </div>

      <!--      文章内容-->
      <div>
        <!--        md文章-->
        <div v-if="blog.category == 'md'">
          <MdEditor class="" style="margin-top:-20px;" :data="md_blog"></MdEditor>
        </div>
        <!--        text文章-->
        <div v-if="blog.category == 'text'" class="" style="font-size: 17px;word-break: break-all;line-height: 1.7em;">
          <div v-for="(line,i) in blog.content.split('\n')" :key="i">
            <img v-if="line.match('[IMG]')"
                 class=""
                 style="width:100%;border-radius: 5px;"
                 @click="click_img(line.split('[IMG]')[1])"
                 :src="line.split('[IMG]')[1]">
            <p v-else
               style="text-indent: 2em;">
              {{ line }}
            </p>
          </div>
        </div>
      </div>

      <!--图片-->
      <div>
        <div v-if="blog.imgs_arr.length > 1">
          <div class="mgt10">
            <div v-for="img in blog.imgs_arr" class="mgt5" style="width:100%">
              <img :src="api.mini_img(blog.created_at, img,400)"
                   @click="api.preview_imgs(img, blog.imgs_arr)"
                   class="pointer " style="border:1px solid #ddd;width:100%;border-radius: 5px;">
            </div>
          </div>
          <!--          <div class="fx mgt10" v-if="blog.imgs_arr.length >= 0">-->
          <!--            <div v-for="img in blog.imgs_arr.slice(0,2)" class="mgr10" style="">-->
          <!--              <img :src="api.mini_img(blog.created_at, img,400)"-->
          <!--                   @click="api.preview_imgs(img, blog.imgs_arr)"-->
          <!--                   class="pointer" style="border:1px solid #ddd;width:80%;border-radius: 5px;">-->
          <!--            </div>-->
          <!--          </div>-->
          <!--          <div class="fx mgt10" v-if="blog.imgs_arr.length >= 2">-->
          <!--            <div v-for="img in blog.imgs_arr.slice(2,4)" class="mgr10" style="">-->
          <!--              <img :src="api.mini_img(blog.created_at, img,400)"-->
          <!--                   @click="api.preview_imgs(img, blog.imgs_arr)"-->
          <!--                   class="pointer" style="border:1px solid #ddd;width:80%;border-radius: 5px;">-->
          <!--            </div>-->
          <!--          </div>-->
        </div>
        <div v-else-if="blog.imgs_arr.length == 1" style="width:100%">
          <img :src="api.mini_img(blog.created_at, blog.imgs_arr[0], 400)"
               @click="api.preview_imgs(blog.imgs_arr[0], blog.imgs_arr)"
               class="pointer mgt10" style="border:1px solid #ddd;width:100%;border-radius: 5px;">
        </div>
      </div>


      <!--         count -->
      <div class="mgt10 mgb15" style="overflow-x: hidden">
        <span style="color:#AAA;font-size: 13px;">阅读 {{ blog.read_count }}</span>&nbsp;&nbsp;
        <span style="color:#AAA;font-size: 13px;">
                评论
                {{ blog.comment_count }}
              </span>&nbsp;&nbsp;
        <span style="color:#AAA;font-size: 13px;">
                点赞
                {{ blog.like_count }}
              </span>&nbsp;&nbsp;
        <span style="color:#AAA;font-size: 13px;">分享 {{ blog.share_count }}</span>&nbsp;&nbsp;
      </div>

      <!--      相关商品-->
      <div class="mgb30 mgt10 pointer" v-if="blog.o">
        <div class="" style="font-size: 16px;">
          <b>相关链接：</b>
          <span v-if="blog.o_type == 'Curriculum'"
                @click="api.to_page(`/curriculums/detail/${blog.o_id}`)"
                style="color:#65CAFF">
            <b v-if="blog.o.id == 1">{{ blog.o.title }}</b>
            <b v-else>全栈课堂-第{{ blog.o.no }}章：{{ blog.o.title }}</b>
          </span>
          <span v-if="blog.o_type == 'CurriculumCatalog'"
                @click="api.to_page(`/curriculum_catalogs/detail/${blog.o_id}`)"
                style="color:#65CAFF">
            <b v-if="blog.o.id == 1">{{ blog.o.title }}</b>
            <b v-else>全栈课堂-第{{ blog.o.curriculum.no }}章-第{{ blog.o.no }}节：{{ blog.o.title }}</b>
          </span>
        </div>
      </div>

      <!--  用户  -->
      <div class="">
        <!--          -->
        <div class="fx pd10" style="background: #F4F9FF;border-radius: 10px;">
          <!--       用户头像     -->
          <div class="mgr10" style="">
            <img class="pointer" @click="api.to_page(`/users/detail/${blog.user.uid}`)" :src="blog.user.head_img"
                 style="width:40px;height:40px;border-radius: 50%;border: 2px solid #FFF;">
          </div>
          <!--       用户名称     -->
          <div class="f1">
            <div class="pointer" style="font-size: 16px;" @click="api.to_page(`/users/detail/${blog.user.uid}`)"
            >{{ blog.user.nick_name }}
            </div>
            <div class="mgt5"
                 style="color:#888;font-size: 14px;word-break: break-all;">
              {{ blog.user.info }}
            </div>
          </div>
        </div>
      </div>


      <!--    点赞评论分享-->
      <div class="mgb10 mgt20" style="padding:0 10px 0 10px;">

        <div class="fx-center">
          <!--        点赞-->
          <div class="mgr20">
            <div class="fx-center pointer" @click="click_like(blog.is_like==1?0:1)">
              <van-icon
                  size="15"
                  :name="blog.is_like==1?'like':'like-o'"
                  :color="`red`"
              />
            </div>
            <div class="fx-center" style="font-size: 12px;color:#888;">点赞</div>
          </div>
          <!--        评论-->
          <div class="mgr20">
            <div class="fx-center pointer" @click="user_comment.open('Blog', blog)">
              <van-icon
                  size="15"
                  name="chat-o"
                  :color="`red`"
              />
            </div>
            <div class="fx-center" style="font-size: 12px;color:#888;">评论</div>
          </div>
          <!--        分享-->
          <div class="f1 ">
            <div class="fx" style="font-size: 14px;height:36px;color:#fff;;border-radius: 20px;">
              <div class="f1 fx-center mbtn"
                   @click="share.tips_click_wx=true"
                   style="border-right: 1px solid #fff;background: linear-gradient(to right,#e1ce1e, #ff6020);
                 border-radius: 20px;">
                分享赚学币
              </div>
            </div>
          </div>

          <!--        修改-->
          <div class="mgl20 " v-if="api.current_user('uid') == blog.user.uid">
            <div class="fx-center pointer" @click="update_blog()">
              <van-icon
                  size="15"
                  :name="'edit'"
                  :color="`#555`"
              />
            </div>
            <div class="fx-center" style="font-size: 12px;color:#555;">修改</div>
          </div>
          <!--        删除-->
          <div class="mgl30" v-if="api.current_user('uid') == blog.user.uid">
            <div class="fx-center pointer" @click="delete_blog()">
              <van-icon
                  size="15"
                  :name="'delete-o'"
                  :color="`#ddd`"
              />
            </div>
            <div class="fx-center" style="font-size: 12px;color:#DDD;">删除</div>
          </div>
        </div>
      </div>


      <!--  评论  -->
      <div class="">
        <hr class="mgt30 mgb10">
        <div class="mgb20" style="font-size: 17px;">留言、评论</div>
        <UserComments class="pd10" :data="comments"></UserComments>
        <div class="pd10 text-center" style="color:#888;font-size: 15px;">
          留下你的精彩
          <span style="color:#5EACFF" class="pointer"
                @click="user_comment.open('Blog', blog)">评论或提问</span>吧
        </div>
        <PullButton :data="comments"></PullButton>
      </div>


      <!--  推荐  -->
      <div class="">
        <hr class="mgt30 mgb10">
        <div class="mgb20" style="font-size: 17px;">推荐文章</div>
        <div class="mgt10"
             style="border-bottom: 1px solid #ddd;padding-bottom: 10px;padding-top:10px;"
             v-for="(blog,i) in recommendeds" :key="i" @click="to_blog(blog)">
          <div class="mgr10" style="width: 30%;">
            <img style="border-radius:5px;width: 100%;" class="pointer"
                 :src="api.mini_img(blog.created_at, blog.imgs.split(',')[0], 200)">
          </div>
          <div style="font-size: 15px;word-break: break-all;" class="pointer">
            {{ blog.title ? blog.title : blog.content.slice(0, 30) }}
          </div>
        </div>
      </div>

      <div class="h100"></div>
    </div>
    <UserComment :data="user_comment"></UserComment>
  </div>
</template>

<script>
import api from "@/apis"
import MdEditor from "@/components/base/MdEditor.vue"
import UserComments from "@/pages/base/UserComments.vue"
import UserComment from "@/pages/base/UserComment.vue"
import Share from "@/pages/base/Share.vue"
import BottomBar from "@/pages/base/BottomBar.vue"
import PullButton from "@/components/base/PullButton.vue"

export default {
  components: {
    MdEditor, UserComments, UserComment, BottomBar, Share, PullButton
  },
  props: ['data'],
  data() {
    var vm = this
    return {
      api: api,
      videos: [],
      md_blog: {
        text: '',
        preview_theme: '',
        readonly: true,
      },
      share: {},
      user_comment: {
        comment_success() {
          vm.comment_success()
        },
      },
      comments: {
        click_comment_comment(comment) {
          vm.user_comment.open('UserComment', comment)
        },
        page: 1,
        limit: 10,
        total: 0,
        list: [],
        loading: false,
        get_data() {
          var that = this
          api.get('/user_comments/list', {
            data: {
              o_id: vm.id,
              o_type: 'Blog',
              page: that.page,
              limit: that.limit
            },
            success: function (data) {
              that.get_data_success(data)
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
      blog: {
        user: {},
        imgs: '',
        imgs_arr: [],
        content: ''
      },
      imgs: [],
      recommendeds: []
    }
  },
  methods: {
    to_blog(blog) {
      var vm = this
      api.to_page(`/blogs/detail/${blog.id}`, 'href')
    },
    click_img(img) {
      var vm = this
      wx.previewImage({
        current: img, // 当前显示图片的 http 链接
        urls: vm.imgs // 需要预览的图片 http 链接列表
      })
    },
    update_blog() {
      var vm = this
      if (vm.blog.type == 'dynamic') {
        api.to_page(`/blogs/add_dynamic?update=${vm.id}`)
      } else {
        api.to_page(`/blogs/add_article?update=${vm.id}`)
      }
    },
    delete_blog() {
      var vm = this
      vm.$store.state.dialog.open(function () {
        vm.$store.state.dialog.title = `删除文章`
        vm.$store.state.dialog.content = `你确定要删除自己发布的这篇文章：${vm.blog.title} 吗？`
        vm.$store.state.dialog.left_btn.show = true
        vm.$store.state.dialog.left_btn.name = `再想想`
        vm.$store.state.dialog.left_btn.click = function () {
        }
        vm.$store.state.dialog.right_btn.show = true
        vm.$store.state.dialog.right_btn.name = `确认删除`
        vm.$store.state.dialog.right_btn.click = function () {
          api.post("/blogs/remove", {
            data: {
              id: vm.id,
            },
            success: function (data) {
              api.notify(`你的文章已删除成功`)
              api.to_page(`/blogs`)
            },
            error: function (code, msg, data) {
            },
            must: function (err) {
            }
          })
        }
      })
    },
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
    click_like(state) {
      var vm = this
      api.post("/user_likes/like", {
        data: {
          o_id: vm.id,
          o_type: 'Blog',
          state: state
        },
        success: function (data) {
          vm.blog.is_like = state
          if (state == 1) {
            vm.blog.like_count += 1
          } else {
            vm.blog.like_count -= 1
          }
        },
        error: function (code, msg, data) {
        },
        must: function (err) {
        }
      })
    },
    comment_success() {
      var vm = this
      vm.blog.is_comment = 1
      vm.blog.comment_count += 1
      vm.comments.init()
    },
    img_src(content) {
      return 'https://metayz.club/article_imgs/' + content.value.md5 + '.jpg';
    },
    show_image(content) {
      return content.type == 'image' && content.value && content.value.width > 100
    },
    get_detail() {
      var vm = this
      api.get('/blogs/detail', {
        data: {
          id: vm.id,
        },
        success: function (data) {
          vm.blog = data.detail
          if (vm.blog.imgs) {
            vm.blog.imgs_arr = vm.blog.imgs.split(',')
          } else {
            vm.blog.imgs_arr = []
          }
          vm.recommendeds = data.recommendeds
          // 视频
          if (vm.blog.videos && vm.blog.videos.length > 0) {
            vm.blog.videos.forEach(function (video) {
              vm.videos.clear()
              vm.videos.push({
                o: video,
                o_type: 'Video',
                src: video.src,
                auto_play: true,
                enend() {

                }
              })
            })
          }

          // 图片预览
          if (vm.blog.category == 'text') {
            vm.imgs.clear()
            data.detail.content.split("\n").forEach(function (a) {
              if (a.match('[IMG]')) {
                vm.imgs.push(a.split('[IMG]')[1])
              }
            })
          } else if (data.detail.category == 'md') {
            vm.md_blog.text = data.detail.content
            vm.md_blog.preview_theme = data.detail.md_preview_theme
          }

          // 分享
          if (vm.blog.type == 'article') {
            var share_desc = null
            if (data.detail.content && data.detail.content.length > 10) {
              var connte_first100 = data.detail.content.slice(0, 100)
              share_desc = `${connte_first100.replace(/<br\/>/g, "").replace(/&emsp;/g, "").replace(/`/g, "").replace(/#/g, "").slice(0, 35)}...`
            }
          } else {
          }

          // 回页面顶部
          api.to_page_top()
        },
        error: function (code, msg, data) {
          if (code == 2) {
            setTimeout(function () {
              api.to_page(`/blogs`)
            }, 2000)
          }
        },
        must: function (err) {
        }
      })
    },
    init_data() {
      var vm = this
      vm.get_detail()
      vm.comments.init()
    },
  },
  mounted() {
    var vm = this
    vm.id = vm.$router.currentRoute.value.params.id
    // 记录分享者id
    var share_uid = vm.$route.params.share_uid
    if (share_uid) {
      var current_uid = api.current_user('uid')
      if (current_uid) {
        if (current_uid != vm.$route.params.share_uid) {
          api.add_share_log(share_uid, vm.id, 'Blog')
          setTimeout(function () {
            window.location.href = `/blogs/detail/${vm.id}${current_uid ? `/${current_uid}` : ''}`
          }, 100)
        }
      } else {
        api.add_share_log(share_uid, vm.id, 'Blog')
      }
    }
    if (localStorage.getItem('token')) {
      api.get_current_user()
    }
    vm.init_data()
  }
}
</script>

<style lang="less" scoped>

</style>
