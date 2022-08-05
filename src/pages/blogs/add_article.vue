<template>
  <div class="">
    <van-nav-bar
        :style="`${$store.state.sys_env=='pc'?`width:${$store.state.sys_env=='pc'?'600px':'100%;'};position: fixed;top: 0;`:''}`"
        :fixed="!$store.state.sys_env=='pc'"
        title="发布文章"
        @click-right="save.click()"
    >
      <template #right>
        <div class="fx-center" style="font-size: 14px;color:#0D9EFF">
          发布
        </div>
      </template>
    </van-nav-bar>
    <div style="height:50px;"></div>

    <div class="mgb10 mgt10" style="padding:0 10px 0 10px;">
      <div class="fx-center">
        <div class="w_20"></div>
        <div class="f1 mgr10">
          <div class="fx" style="font-size: 14px;height:30px;color:#fff;">
            <div class="f1 fx-center mbtn"
                 @click="click_right()"
                 style="border-right: 1px solid #fff;background: linear-gradient(to right,#5EACFF, #238DFF);
                     border-top-left-radius: 20px;
                     border-bottom-left-radius: 20px;">
              {{ blog_look.show ? '编辑' : '预览' }}
            </div>
            <!--            <div class="f1 fx-center mbtn"-->
            <!--                 @click="click_right()"-->
            <!--                 style="border-right: 1px solid #fff;background: linear-gradient(to right,#ff5f34, #DD0000);-->
            <!--                     ">-->
            <!--              123-->
            <!--            </div>-->
            <div class="f1 fx-center mbtn"
                 @click="save.click()"
                 style="border-right: 1px solid #fff;background: linear-gradient(to right,#e1ce1e, orange);
                     border-top-right-radius: 20px;
                     border-bottom-right-radius: 20px;">
              发布
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="pd5" v-show="!blog_look.show">
      <Field class="" :data="title"></Field>
      <Field class="" :data="img"></Field>
      <MdEditor class="" :data="blog"></MdEditor>
    </div>
    <div v-show="blog_look.show">
      <div class="mgt10 text-center" style="font-size: 24px">{{ title.value }}</div>
      <MdEditor class="pdl10 pdr10" :data="blog_look"></MdEditor>
    </div>
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
import Field from "@/components/base/Field.vue"

export default {
  components: {
    MdEditor, UserComments, UserComment, BottomBar, Share, PullButton, Field
  },
  props: ['data'],
  data() {
    var vm = this
    return {
      api: api,
      blog: {
        text: "",
        toolbars: false,
        readonly: false,
        preview: false,
        full_screen: false,
        height: '500px',
      },

      blog_look: {
        show: false,
        text: ``,
        readonly: true,
        preview: true,
        full_screen: false,
        height: '800px',
      },


      look: {
        loading: false,
        click() {
          var that = this
          vm.blog_look.show = true
          setTimeout(function () {
            vm.blog_look.text = vm.blog.text
          }, 200)
        }
      },

      title: {
        link: false,
        value: '',
        type: 'text',
        des: '请输入标题',
        title: '',
        title_width: '',
        err: '',
        max_length: 30,
        checks: ['required']
      },
      img_src: null,
      img: {
        title: '', readonly: false, dialog: true, type: 'upload', des: '点此上传图片', width: '', value: '', finish(v) {
          vm.img_src = v
          vm.img.des = '图片已上传成功'
          api.notify(`图片已上传成功`)
        }
      },
      save: {
        loading: false,
        click() {
          var that = this
          if (!vm.title.validate()) {
            api.notify(`标题:${vm.title.errors}`)
            return
          }
          if (vm.blog.text.length < 10) {
            api.notify(`内容至少要10字以上`)
            return
          }
          console.log(that.loading)
          if (that.loading) return
          that.loading = true
          if (vm.id) {
            api.post('/blogs/update', {
              data: {
                id: vm.id,
                title: vm.title.value,
                content: vm.blog.text,
                imgs: vm.img_src,
                category: 'md',
              },
              success: function (data) {
                api.notify(`保存并发布成功`)
                that.loading = false
                setTimeout(function () {
                  api.to_page(`/blogs/detail/${data.id}`)
                }, 1000)
              },
              error: function (code, msg, data) {
                that.loading = false
              },
              must: function (err) {
                that.loading = false
              }
            })
          } else {
            if (!vm.img_src) {
              api.notify(`请上传一张图片`)
              return
            }
            api.post('/blogs/add', {
              data: {
                title: vm.title.value,
                content: vm.blog.text,
                imgs: vm.img_src,
                category: 'md',
              },
              success: function (data) {
                api.notify(`保存成功`)
                that.loading = false
                api.to_page(`/blogs/detail/${data.id}`)
              },
              error: function (code, msg, data) {
                that.loading = false
              },
              must: function (err, data) {
                that.loading = false
              }
            })
          }
        }
      },
    }
  },
  methods: {
    get_detail() {
      var vm = this
      api.get('/blogs/detail', {
        data: {
          id: vm.id,
        },
        success: function (data) {
          vm.blog.text = data.detail.content
          vm.title.value = data.detail.title
        },
        error: function (code, msg, data) {
        },
        must: function (err) {
        }
      })
    },
    click_right() {
      var vm = this
      if (vm.blog_look.show) {

      } else {
        setTimeout(function () {
          vm.blog_look.text = vm.blog.text
        }, 100)
      }
      vm.blog_look.show = !vm.blog_look.show
    }
  },
  mounted() {
    var vm = this
    vm.id = vm.$router.currentRoute.value.query.update
    if (vm.id) vm.get_detail()
    api.get_current_user()
  }
}
</script>

<style lang="less" scoped>

</style>
