<template>
  <div class="">
    <van-nav-bar
        :style="`${$store.state.sys_env=='pc'?`width:${$store.state.sys_env=='pc'?'600px':'100%;'};position: fixed;top: 0;`:''}`"
        :fixed="!$store.state.sys_env=='pc'"
        title="发布笔记、心情"
        @click-right="save.click()"
    >
      <!--      <template #right>-->
      <!--        <div class="fx-center" style="font-size: 14px;color:#0D9EFF">-->
      <!--          发布-->
      <!--        </div>-->
      <!--      </template>-->
    </van-nav-bar>
    <div style="height:50px;" v-if="$store.state.sys_env=='pc'"></div>

    <van-notice-bar
        left-icon="volume-o"
        text="发布你的心情、笔记、日常到广场，根据内容质量、长度会获得2-10学币不等的奖励（每日最多奖励3次）"
    />

    <div class="pd5" v-show="!blog_look.show">
      <MdEditor class="" :data="blog"></MdEditor>
      <div class="mgt20 fx-center" style="color:#555;font-size:14px;">上传图片(最多9张，一次可上传多张）</div>
      <div class="fx-center">
        <van-uploader
            class=" mgt10"
            v-model="imgs"
            multiple
            :max-size="6 * 1024 * 1024"
            :max-count="9"
            @oversize="onOversize"
            :after-read="afterRead"/>
      </div>
      <div class="fx-center">
        <div class="fx-center mgt20 mbtn"
             @click="save.click()"
             style="border-right: 1px solid #fff;color:#fff;height:35px;width:80%;background: linear-gradient(to right,#e1ce1e, #ff6020);
                 border-radius: 20px;">
          发布
        </div>
      </div>
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
import BottomBar from "@/pages/base/BottomBar.vue"
import PullButton from "@/components/base/PullButton.vue"
import Field from "@/components/base/Field.vue"

export default {
  components: {
    MdEditor, UserComments, UserComment, BottomBar,  PullButton, Field
  },
  props: ['data'],
  data() {
    var vm = this
    return {
      api: api,
      share: {},
      blog: {
        text: "",
        toolbars: false,
        readonly: false,
        preview: false,
        full_screen: false,
        height: '300px',
      },
      imgs: [],

      blog_look: {
        show: false,
        text: ``,
        readonly: true,
        preview: true,
        full_screen: false,
        height: '600px',
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
      save: {
        loading: false,
        click() {
          var that = this
          if (vm.blog.text.length < 5) {
            api.notify(`内容至少要5字以上`)
            return
          }
          console.log(that.loading)
          if (that.loading) return
          that.loading = true

          if(vm.update_id > 0){
            api.post('/blogs/update', {
              data: {
                id: vm.update_id,
                content: vm.blog.text,
              },
              success: function (data) {
                api.notify(`修改成功`)
                api.to_page(`/blogs/detail/${data.id}`)
                that.loading = false
              },
              error: function (code, msg, data) {
                that.loading = false
              },
              must: function (err, data) {
                that.loading = false
              }
            })
          }else{
            api.post('/blogs/add_dynamic', {
              data: {
                o_id: vm.o_id,
                o_type: vm.o_type,
                content: vm.blog.text,
                imgs: vm.imgs.map(function (a) {
                  return a.src
                }).join(','),
                category: 'md',
              },
              success: function (data) {
                vm.$store.state.dialog.open(function () {
                  vm.$store.state.dialog.title = `发布成功`
                  vm.$store.state.dialog.content = `已获得${data.score}学币奖励`
                  vm.$store.state.dialog.left_btn.show = true
                  vm.$store.state.dialog.left_btn.name = `确认`
                  vm.$store.state.dialog.left_btn.click = function () {
                    api.to_page(`/blogs/detail/${data.id}`)
                    vm.$store.state.dialog.show = false
                  }
                  vm.$store.state.dialog.right_btn.show = false
                  vm.$store.state.dialog.right_btn.name = ``
                  vm.$store.state.dialog.right_btn.click = function () {
                    vm.$store.state.dialog.show = false
                  }
                })
                that.loading = false
              },
              error: function (code, msg, data) {
                that.loading = false
                if (code == 100801) {
                  vm.$store.state.dialog.open(function () {
                    vm.$store.state.dialog.title = `内容审核不通过，需要修改`
                    vm.$store.state.dialog.content = `${msg}`
                    vm.$store.state.dialog.left_btn.show = true
                    vm.$store.state.dialog.left_btn.name = `确认`
                    vm.$store.state.dialog.left_btn.click = function () {
                      vm.$store.state.dialog.show = false
                    }
                    vm.$store.state.dialog.right_btn.show = false
                    vm.$store.state.dialog.right_btn.name = ``
                    vm.$store.state.dialog.right_btn.click = function () {
                      vm.$store.state.dialog.show = false
                    }
                  })
                }
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
    onOversize(file) {
      var vm = this
      api.notify(`文件大小不能超过 6M`)
    },

    afterRead(files) {
      var vm = this
      if (Array.isArray(files)) {
        files.forEach(function (file) {
          file.status = 'uploading';
          file.message = '上传中...';
          api.upload_file({
            file: file.file,
            success: function (res) {
              var img_url = `https://img.177weilai.com/${res.key}`
              console.log(`上传成功，查看链接：\n${img_url}`)
              file.src = img_url
              file.status = 'success';
              file.message = '上传成功';
            },
            error: function (err) {
              console.error(err)
              file.status = 'failed';
              file.message = '上传失败';
            }
          })
        })
      } else {
        var file = files
        file.status = 'uploading';
        file.message = '上传中...';
        api.upload_file({
          file: file.file,
          success: function (res) {
            var img_url = `https://img.177weilai.com/${res.key}`
            console.log(`上传成功，查看链接：\n${img_url}`)
            file.src = img_url
            file.status = 'success';
            file.message = '上传成功';
          },
          error: function (err) {
            console.error(err)
            file.status = 'failed';
            file.message = '上传失败';
          }
        })
      }
    },
  },
  mounted() {
    var vm = this
    if (vm.$route.query.o_id) vm.o_id = vm.$route.query.o_id
    if (vm.$route.query.o_type) vm.o_type = vm.$route.query.o_type
    if (vm.$route.query.update) {
      vm.update_id = vm.$route.query.update
      api.get('/blogs/detail', {
        data: {
          id: vm.update_id,
        },
        success: function (data) {
          vm.blog.text = data.detail.content
          vm.title.value = data.detail.title
          if(data.detail.imgs) {
            vm.imgs.clear()
            data.detail.imgs.split(",").forEach(function(a){
              vm.imgs.push({
                url: a,
                src: a,
                status: 'success',
                message: '',
              })
            })
          }

        },
        error: function (code, msg, data) {
        },
        must: function (err) {
        }
      })
    }
    api.get_current_user()
  }
}
</script>

<style lang="less" scoped>

</style>
