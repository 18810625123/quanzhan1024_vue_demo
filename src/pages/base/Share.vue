<template>
  <div class="">
    <van-share-sheet
        v-model:show="data.show"
        title="立即分享给好友"
        description=""
        @select="click"
        :options="options"
    />

    <!--    提示用户点击微信分享按钮 -->
    <van-overlay :show="data.tips_click_wx" @click="data.tips_click_wx = false" z-index="9999">
      <div class="wrapper" @click="data.tips_click_wx = false">
        <div v-if="$store.state.sys_env == 'wx'">
          <div class="pos-abs" style="right:10px;top:0px;">
            <img src="https://img.177weilai.com/share/tips.png" style="color:red;">
          </div>
          <div class="pos-abs" style="color:#fff;top:20px;right:80px;font-size: 22px">
            <div>点击微信右上角三个点分享</div>
          </div>
        </div>



        <div v-if="$store.state.sys_env == 'h5'">
          <div class="pos-abs" style="right:10px;top:0px;">
            <img src="https://img.177weilai.com/share/tips.png" style="color:red;">
          </div>
          <div class="pos-abs" style="color:#fff;top:20px;right:80px;font-size: 22px">
            <div>点击浏览器分享按钮</div>
            <div>（safari在下面中间）</div>
          </div>
        </div>


        <div v-if="$store.state.sys_env == 'pc'">
          <div class="pos-abs" style="right:30%;top:0px;">
            <img src="https://img.177weilai.com/share/tips.png" style="color:red;">
          </div>
          <div class="pos-abs" style="color:#fff;top:20px;right:40%;font-size: 22px">
            <div>复制浏览器链接发送给他人</div>
          </div>
        </div>

        <div v-if="$store.state.sys_env == 'wx-xcx'">
          <div class="pos-abs" style="right:50px;top:0px;">
            <img src="https://img.177weilai.com/share/tips.png" style="color:red;">
          </div>
          <div class="pos-abs" style="color:#fff;top:20px;right:80px;font-size: 22px">
            <div>点击小程序右上角三个点</div>
            <div>转发给朋友</div>
          </div>
        </div>

        <!--        <span v-else>点击右上角微信三个点</span>-->
<!--        <div v-if="$store.state.sys_env == 'h5'">分享当前页给好友</div>-->
<!--        <div v-else>分享当前页到微信</div>-->

        <div class="pos-abs pd10 " style="top:230px;left:26%;width:230px;background:#fff;border-radius: 10px;">
          <div style="font-size: 15px;">{{ params.title }}</div>
          <div class="fx-center mgt5 mgb10">
            <div class="f1 mgr5" style="font-size: 13px;color:#888">{{ params.desc }}</div>
            <div class="fx-center">
              <img :src="params.img" style="width:40px;height:40px;border-radius: 5px;" alt="">
            </div>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>
<script>
import api from "@/apis"

export default {
  components: {},
  props: ['data'],
  data() {
    var vm = this
    return {
      api: api,
      tips_click_wx: false,
      params: {},
      default: {
        title: '全栈课堂-零基础入门编程学习社区',
        desc: '本网站致力于打造一个轻松愉快的轻社交编程学习环境，提供精品编程入门学习视频课，零基础想学编程的可从第一课开始学习，先了解什么是编程',
        img: 'https://img.177weilai.com/19670880-0b52-11ed-9efe-61c69686f827__w200.png',
        url: window.location.href,
      },
      click(option, index) {
        var vm = this
        option.click()
      },
      options: [
        [
          {
            name: '支付', icon: 'wechat', click() {
              vm.chooseWXPay()
            }
          },
          {
            name: '扫一扫', icon: 'wechat', click() {
              vm.scanQRCode()
            }
          },
          {
            name: '位置', icon: 'wechat-moments', click() {
              vm.getLocation()
            }
          },
          {
            name: '地图', icon: 'wechat-moments', click() {
              vm.openLocation()
            }
          },
          {
            name: '选图', icon: 'wechat-moments', click() {
              vm.chooseImage()
            }
          },
          {
            name: '看图', icon: 'wechat-moments', click() {
              vm.previewImage()
            }
          },
        ],
        [
          {
            name: '朋友1', icon: 'wechat', click() {
              vm.updateAppMessageShareData()
            }
          },
          {
            name: '朋友2', icon: 'wechat', click() {
              vm.onMenuShareAppMessage()
            }
          },
          {
            name: '朋友圈1', icon: 'wechat-moments', click() {
              vm.updateTimelineShareData()
            }
          },
          {
            name: '朋友圈2', icon: 'wechat-moments', click() {
              vm.onMenuShareTimeline()
            }
          },
          {
            name: '微博', icon: 'weibo', click() {
              vm.onMenuShareWeibo()
            }
          },
          {
            name: 'QQ', icon: 'qq', click() {
              vm.onMenuShareQQ()
            }
          },
        ],
        [
          {name: '复制链接', icon: 'link'},
          {name: '分享海报', icon: 'poster'},
          {name: '二维码', icon: 'qrcode'},
          {name: '小程序码', icon: 'weapp-qrcode'},
        ],
      ]
    }
  },
  methods: {
    share_success(name, a) {
      var vm = this
    },
    updateAppMessageShareData(params) {
      var vm = this
      // console.log('share_init_updateAppMessageShareData', params)
      // console.log('updateAppMessageShareData 自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）')
      wx.updateAppMessageShareData({
        title: params.title, // 分享标题
        desc: params.desc, // 分享描述
        link: params.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
        imgUrl: params.img, // 分享图标
        success: function (res) {
          // 设置成功
          vm.share_success(111, res)
        }
      })
    },
    updateTimelineShareData(params) {
      var vm = this
      // console.log('share_init_updateTimelineShareData', params)
      // console.log('updateTimelineShareData 自定义“分享到朋友圈”及“分享到 QQ 空间”按钮的分享内容（1.4.0）')
      wx.updateTimelineShareData({
        title: params.title, // 分享标题
        desc: params.desc, // 分享描述
        link: params.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
        imgUrl: params.img, // 分享图标
        success: function (res) {
          // 设置成功
          vm.share_success(333, res)
        }
      })
    },

    onMenuShareAppMessage() {
      var vm = this
      // console.log('onMenuShareAppMessage 获取“分享给朋友”按钮点击状态及自定义分享内容接口（即将废弃）')
      wx.onMenuShareAppMessage({
        title: vm.data.title, // 分享标题
        desc: vm.data.title, // 分享描述
        link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
        imgUrl: vm.data.imgUrl, // 分享图标
        type: 'video', // 分享类型,music、video或link，不填默认为link
        dataUrl: vm.data.dataUrl, // 如果 type 是music或video，则要提供数据链接，默认为空
        success: function (res) {
          // 用户点击了分享后执行的回调函数
          vm.share_success(222, res)

        }
      })
    },
    onMenuShareTimeline() {
      var vm = this
      // console.log('onMenuShareTimeline 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口（即将废弃')
      wx.onMenuShareTimeline({
        title: vm.data.title, // 分享标题
        link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
        imgUrl: vm.data.imgUrl, // 分享图标
        success: function (res) {
          // 用户点击了分享后执行的回调函数
          vm.share_success(444, res)

        }
      })
    },
    onMenuShareQQ() {
      var vm = this
      console.log('onMenuShareQQ 获取“分享到QQ”按钮点击状态及自定义分享内容接口（即将废弃）')
      wx.onMenuShareQQ({
        title: vm.data.title, // 分享标题
        desc: vm.data.title, // 分享描述
        link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
        imgUrl: vm.data.imgUrl, // 分享图标
        success: function () {
          // 用户确认分享后执行的回调函数
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
        }
      });
    },
    onMenuShareWeibo() {
      var vm = this
      console.log('onMenuShareWeibo 获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口')
      wx.onMenuShareWeibo({
        title: vm.data.title, // 分享标题
        desc: vm.data.title, // 分享描述
        link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
        imgUrl: vm.data.imgUrl, // 分享图标
        success: function () {
          // 用户确认分享后执行的回调函数
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
        }
      })
    },
    onMenuShareQZone() {
      var vm = this
      console.log('onMenuShareQZone 获取“分享到 QQ 空间”按钮点击状态及自定义分享内容接口（即将废弃')
      wx.onMenuShareQZone({
        title: vm.data.title, // 分享标题
        desc: vm.data.title, // 分享描述
        link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
        imgUrl: vm.data.imgUrl, // 分享图标
        success: function () {
          // 用户确认分享后执行的回调函数
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
        }
      })
    },
    chooseImage() {
      var vm = this
      console.log('chooseImage 拍照或从手机相册中选图接口')
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          var localIds = res.localIds; // 返回选定照片的本地 ID 列表，localId可以作为 img 标签的 src 属性显示图片
        }
      })
    },
    previewImage() {
      var vm = this
      console.log('previewImage 预览图片接口')
      wx.previewImage({
        current: vm.data.imgUrl, // 当前显示图片的 http 链接
        urls: [vm.data.imgUrl] // 需要预览的图片 http 链接列表
      })
    },
    openLocation() {
      var vm = this
      console.log('openLocation 使用微信内置地图查看位置接口')
      wx.openLocation({
        latitude: 0, // 纬度，浮点数，范围为90 ~ -90
        longitude: 0, // 经度，浮点数，范围为180 ~ -180。
        name: '', // 位置名
        address: '', // 地址详情说明
        scale: 1, // 地图缩放级别,整型值,范围从1~28。默认为最大
        infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
      })
    },
    getLocation() {
      var vm = this
      console.log('getLocation 获取地理位置接口')
      wx.getLocation({
        type: 'wgs84', // 默认为wgs84的 gps 坐标，如果要返回直接给 openLocation 用的火星坐标，可传入'gcj02'
        success: function (res) {
          var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
          var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
          var speed = res.speed; // 速度，以米/每秒计
          var accuracy = res.accuracy; // 位置精度
          console.log(`获取地理位置成功：${latitude}-${longitude}`)
          // alert(`获取地理位置成功：${latitude}-${longitude}`)
        }
      })
    },
    scanQRCode() {
      var vm = this
      console.log('scanQRCode 调起微信扫一扫接口')
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
          var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
          console.log(`扫码返回：${result}`)
        }
      })
    },
    chooseWXPay() {
      var vm = this
      console.log('chooseWXPay 发起一个微信支付请求')
      wx.chooseWXPay({
        timestamp: 0, // 支付签名时间戳，注意微信 jssdk 中的所有使用 timestamp 字段均为小写。但最新版的支付后台生成签名使用的 timeStamp 字段名需大写其中的 S 字符
        nonceStr: '', // 支付签名随机串，不长于 32 位
        package: '', // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
        signType: '', // 微信支付V3的传入 RSA ,微信支付V2的传入格式与V2统一下单的签名格式保持一致
        paySign: '', // 支付签名
        success: function (res) {
          // 支付成功后的回调函数
          console.log(`支付成功后的回调函数: ${res}`)
        }
      })
    },
    init(params) {
      var vm = this
      // if (vm.$store.state.shareing == true) {
      //   return
      // }


      if (!params.img) params.img = vm.default.img
      if (!params.title) params.title = vm.default.title
      if (!params.desc) params.desc = vm.default.desc
      params.title = params.title.split("\n").join('')
      params.url = window.location.href
      vm.params = params

      // 如果是小程序内，则不初始化分享（因为小程序不支持分享）
      var is_xcx = false
      if (wx && wx.miniProgram) {
        wx.miniProgram.getEnv(function (res) {
          if (res.miniprogram) {
            is_xcx = true
          }
        })
      }
      if (is_xcx) return

      api.wx_signature(params.url, function (data) {
        var apis = [
          "checkJsApi",
          "updateAppMessageShareData",
          "updateTimelineShareData",
          "onMenuShareTimeline",
          "onMenuShareAppMessage",
          "onMenuShareQQ",
          "onMenuShareWeibo",
          "onMenuShareQZone",
          "chooseImage",
          "previewImage",
          "getNetworkType",
          "openLocation",
          "getLocation",
          "hideMenuItems",
          "showMenuItems",
          "hideAllNonBaseMenuItem",
          "showAllNonBaseMenuItem",
          "closeWindow",
          "scanQRCode",
          "chooseWXPay",
        ]
        wx.config({
          debug: false, // 开启调试模式,调用的所有 api 的返回值会在客户端 alert 出来，若要查看传入的参数，可以在 pc 端打开，参数信息会通过 log 打出，仅在 pc 端时才会打印。
          appId: data.appid,
          timestamp: `${data.timestamp}`,
          nonceStr: data.nonce_str,
          signature: data.signature,
          jsApiList: apis
        });
        wx.ready(function (a) {
          vm.updateAppMessageShareData(params)
          vm.updateTimelineShareData(params)
          // vm.$store.state.shareing = false
        });
        wx.error(function (res) {
          // alert(`config错误:${JSON.stringify(res)}`)
          console.log(`config错误:${JSON.stringify(res)}`)
          // config信息验证失败会执行 error 函数，如签名过期导致验证失败，具体错误信息可以打开 config 的debug模式查看，也可以在返回的 res 参数中查看，对于 SPA 可以在这里更新签名。
        });
        // wx.checkJsApi({
        //   jsApiList: apis, // 需要检测的 JS 接口列表，所有 JS 接口列表见附录2,
        //   success: function (res) {
        //     // 以键值对的形式返回，可用的 api 值true，不可用为false
        //     // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
        //   }
        // });
      })
    }
  },
  watch: {},
  mounted() {
    var vm = this
    vm.data.init = vm.init
  }
}
</script>

<style lang="less" scoped>

</style>
