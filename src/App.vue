<template>
  <div id="" class="" style="width:100%;height:100%;">

    <div v-if="$store.state.sys_env=='pc'"
         :style="`color: #fff;font-size:17px;z-index: 0;${app_align=='pos-fixed top0 left0'?'right':'left'}:10px;top:10px;`"
         :class="`${app_align=='pos-fixed top0 left0'?'pos-fixed top0 right0 h_100':'pos-fixed top0 left0 h_100'}`">
      <div>APP位置</div>
      <div class="">
        <div class="pointer mgt5 "
             :style="`${app_align=='pos-fixed top0 left0'?'color:#FF7E5D':''}`"
             @click="set_app_align('pos-fixed top0 left0')"
        >
          靠左
        </div>
        <div class="pointer mgt5"
             :style="`${app_align==''?'color:#FF7E5D':''}`"
             @click="set_app_align('')"
        >
          居中
        </div>
        <div class="pointer mgt5"
             :style="`${app_align=='pos-fixed top0 right0'?'color:#FF7E5D':''}`"
             @click="set_app_align('pos-fixed top0 right0')"
        >
          靠右
        </div>
        <div class="pointer mgt20"
             :style="`${update_bg_img?'color:orange':'red'}`"
             @click="update_bg_img?close_bg_img():open_bg_img()"
        >
          {{ update_bg_img ? '关闭背景图' : '开启背景图' }}
        </div>
      </div>
      <!--      pc备案号-->
      <div class="pointer mgb10 pos-abs"
           :style="`text-shadow: 1px 1px 1px #555;bottom:20px;
           ${app_align=='pos-fixed top0 left0'?'right':'left'}:10px;
           width:230px;`">
        <a style="color:#FFF;font-size:15px;" target="_blank" href="https://beian.miit.gov.cn/#/Integrated/recordQuery">©
          2022 京ICP备2022017918号-3</a>
      </div>
    </div>

    <div
        :class="app_align=='pos-fixed top0 right0'?'pos-abs right0':(app_align==''?'':'pos-abs left0')"
        :style="`background:#fff;margin:0 auto;height:100%;width:${$store.state.sys_env=='pc'?'600px':'100%'};`">
      <router-view class="router-view" style="background:#fff;" v-slot="{ Component }">
        <transition :name="transitionName">
          <component :is="Component"/>
        </transition>
      </router-view>

      <!--    全局弹窗1-->
      <van-dialog v-model:show="$store.state.dialog.show"
                  :title="$store.state.dialog.title"
                  :show-cancel-button="$store.state.dialog.left_btn.show"
                  :cancel-button-text="$store.state.dialog.left_btn.name"
                  @cancel="$store.state.dialog.left_btn.click"

                  :show-confirm-button="$store.state.dialog.right_btn.show"
                  :confirm-button-text="$store.state.dialog.right_btn.name"
                  @confirm="$store.state.dialog.right_btn.click"
      >
        <div class="pd20" style="color:#777">{{ $store.state.dialog.content }}</div>
      </van-dialog>

      <!--    全局弹窗2-->
      <van-dialog v-model:show="$store.state.qrcode2.show"
                  :title="$store.state.qrcode2.title"
                  :show-cancel-button="$store.state.qrcode2.left_btn.show"
                  :cancel-button-text="$store.state.qrcode2.left_btn.name"
                  @cancel="$store.state.qrcode2.left_btn.click"

                  :show-confirm-button="$store.state.qrcode2.right_btn.show"
                  :confirm-button-text="$store.state.qrcode2.right_btn.name"
                  @confirm="$store.state.qrcode2.right_btn.click"
      >
        <div class="pd10" style="color:#777;width:100%;">
          <div>{{ $store.state.qrcode2.content }}</div>
          <canvas :id="$store.state.qrcode2.id"></canvas>
        </div>
      </van-dialog>

      <div style="height:100px;width:100%;background:#fff;"></div>
      <BottomBar v-show="$router.currentRoute.value.path != '/messages/detail'"></BottomBar>
    </div>
  </div>

</template>

<script>
import api from "@/apis"
import BottomBar from "@/pages/base/BottomBar.vue"

export default {
  components: {
    BottomBar
  },
  data() {
    var vm = this
    var app_align = localStorage.getItem('app_align')
    if (app_align == 'pos-fixed top0 left0' || app_align == 'pos-fixed top0 right0' || app_align == '') {
    } else {
      app_align = ''
      localStorage.setItem('app_align', '')
    }
    return {
      update_bg_img: true,
      app_align: app_align,
      pc_bg_imgs: [
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.jj20.com%2Fup%2Fallimg%2F811%2F051214110451%2F140512110451-7.jpg&refer=http%3A%2F%2Fpic.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660313933&t=7552b89f503bff697121c7222aa8e8ff',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fphoto%2F2011-11-28%2Fenterdesk.com-DEB497A5F0F8C581A045154E4A8E51A4.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660314052&t=561aca5caf9ac8bd3dd461ea6550eecc',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic%2F14%2F05%2Fc5%2F1405c5797ed37bb54f1f8ad0edb3a6b5.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660314072&t=c6d643a142acb14a5ed04638e92b6db4',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.jj20.com%2Fup%2Fallimg%2F611%2F010913163107%2F130109163107-7.jpg&refer=http%3A%2F%2Fpic.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660314094&t=0ebe8bbf47f681d780cc2dffc2b6ebf3',
        'https://img1.baidu.com/it/u=357253313,4109281191&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fphoto%2F2008-6-13%2F200806131108306030.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660314113&t=4bf698bcb0eb36339529531e2d91d4f0',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.jj20.com%2Fup%2Fallimg%2F411%2F042411233529%2F110424233529-7.jpg&refer=http%3A%2F%2Fpic.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660314605&t=97da0b17c6d975c0f188bc8a3b8095ea',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.jj20.com%2Fup%2Fallimg%2F1112%2F12101P11147%2F1Q210011147-3.jpg&refer=http%3A%2F%2Fpic.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660314608&t=aade19bd4a4124ec475cecc800b4c991',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fphoto%2F2011-7-2%2Fenterdesk.com-4A8357D54379BED19FDCF5E6BD6B85CA.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660314612&t=1f3c5e1a5d61528b35b76f3640338ffc',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic%2F24%2F5c%2F92%2F245c9290aedf43d68b0bf4d90fadf30f.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660314620&t=8b3b137c176c0008e3a266bde985ecde',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.jj20.com%2Fup%2Fallimg%2F1112%2F11251Q24100%2F1Q125124100-5.jpg&refer=http%3A%2F%2Fpic.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660314629&t=e747e30c01a99c9799ac8003e68d7f05',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fphoto%2F2011-7-28%2Fenterdesk.com-0F4792E996928CB05897EEE6F2A06669.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660314687&t=8d46b46ec3d088f637ec8c7f27d2de27',
      ],
      api: api,
      transitionName: 'slide-left',
      loading: false,
      flush() {
        if (typeof (vm.$store.state.flush) == "function") vm.$store.state.flush()
        setTimeout(function () {
          vm.loading = false
        }, 1500)
      }
    }
  },
  methods: {
    close_bg_img() {
      var vm = this
      clearInterval(vm.set_pc_imgs_loop)
      vm.set_pc_imgs_loop = null
      document.getElementsByTagName('body')[0].setAttribute("style", `background: #666;`)
      vm.update_bg_img = false
    },
    open_bg_img() {
      var vm = this
      var width = document.documentElement.clientWidth
      // alert(width)
      // if (width > 1400) {
      //   vm.$store.state.pc_width = '600px'
      // } else if (width > 1200) {
      //   vm.$store.state.pc_width = '600px'
      // } else if (width > 1000) {
      //   vm.$store.state.pc_width = '600px'
      // } else if (width > 800) {
      //   vm.$store.state.pc_width = '600px'
      // } else {
      //   vm.$store.state.pc_width = '600px'
      // }
      var body = document.getElementsByTagName('body')[0]
      if (!vm.set_pc_imgs_loop) {
        var img_index = parseInt(Math.random() * 100)
        body.setAttribute("style",
            `background: #fff;background-size: 100%;background-position: top;background-image: url('${vm.pc_bg_imgs[img_index % (vm.pc_bg_imgs.length)]}')`)
        localStorage.setItem('img_index', img_index)
        vm.set_pc_imgs_loop = setInterval(function () {
          var img_index = parseInt(localStorage.getItem('img_index'))
          if (!img_index) img_index = 1
          img_index += 1
          body.setAttribute("style",
              `background: #fff;background-size: 100%;background-position: top;background-image: url('${vm.pc_bg_imgs[img_index % (vm.pc_bg_imgs.length)]}')`)
          localStorage.setItem('img_index', img_index)
        }, 40000)
      }
      vm.update_bg_img = true
    },
    set_app_align(align) {
      var vm = this
      vm.app_align = align
      localStorage.setItem('app_align', vm.app_align)
    },
  },
  watch: {
    $route(to, from) {
      // 有主级到次级
      if (to.meta.index > from.meta.index) {
        this.transitionName = 'slide-left' // 向左滑动
      } else if (to.meta.index < from.meta.index) {
        // 由次级到主级
        this.transitionName = 'slide-right'
      } else {
        this.transitionName = ''   //同级无过渡效果
      }
    }
  },
  mounted() {
    var vm = this
    api.sys_env()
    // 如果是小程序环境，把xcx_code先放到localStorage里，等用户登录之后进行绑定
    setTimeout(function () {
      if (api.sys_env() == 'wx-xcx') {
        if (vm.$route.query.code) {
          localStorage.setItem('xcx_code', vm.$route.query.code)
          // alert(localStorage.getItem('xcx_code'))
          vm.$router.push({query: {}})
        }
      }
    }, 3000)

    if (vm.$store.state.sys_env == 'pc') {
      vm.open_bg_img()
    } else {
      document.getElementsByTagName('body')[0].setAttribute("style", 'background:#FFF;')
    }

    // 如果当前未登录，且是微信环境，触发用户自动登录
    if (!localStorage.getItem('token') && !localStorage.getItem('user') && !vm.$store.state.user.uid)
      if (typeof (WeixinJSBridge) == 'undefined') {
        var auto_login_dialog_count = parseInt(localStorage.getItem('auto_login_dialog_count'))
        if (!auto_login_dialog_count) {
          auto_login_dialog_count = 0
          localStorage.setItem('auto_login_dialog_count', auto_login_dialog_count)
        }
        if (auto_login_dialog_count > 5) {
          return
        }
        var auto_login_dialog_random = parseFloat(localStorage.getItem('auto_login_dialog_random'))
        if (!auto_login_dialog_random) {
          auto_login_dialog_random = 1
          localStorage.setItem('auto_login_dialog_random', auto_login_dialog_random)
        } else {
          if (auto_login_dialog_random < 0.03) {
            auto_login_dialog_random = 0.3
            localStorage.setItem('auto_login_dialog_random', auto_login_dialog_random)
          }
        }
        var rand = Math.random()
        console.log(`${rand} < ${auto_login_dialog_random}`)
        if (rand < auto_login_dialog_random) {
          setTimeout(function () {
            if (api.current_user('uid') || vm.$router.currentRoute.value.path == '/login') {
              return
            }
            localStorage.setItem('auto_login_dialog_count', auto_login_dialog_count + 1)
            vm.$store.state.dialog.open(function () {
              vm.$store.state.dialog.title = `你还未登录`
              vm.$store.state.dialog.content = `首次注册登录奖励100学币`
              vm.$store.state.dialog.left_btn.show = true
              vm.$store.state.dialog.left_btn.name = `先看看`
              vm.$store.state.dialog.left_btn.click = function () {
                vm.$store.state.dialog.show = false
              }
              vm.$store.state.dialog.right_btn.show = true
              vm.$store.state.dialog.right_btn.name = `微信一键登录`
              vm.$store.state.dialog.right_btn.click = function () {
                api.wx_login()
              }
            })
          }, 3000)
        }
      }
  }
}
</script>

<style lang="less">
html, body, #app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

.doge {
  width: 140px;
  height: 72px;
  margin-top: 8px;
  border-radius: 4px;
}
</style>
