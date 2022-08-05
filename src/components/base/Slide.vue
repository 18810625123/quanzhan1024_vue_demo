<template>
  <div>
    <div :style="`padding-left:10px;padding-right:10px;${data.btn_div_style}`">
      <div class="fx">
        <div class="f1 fx-center" v-for="(btn ,i) in btns" :key="`i:${i}`">
          <Button :data="btn"></Button>
<!--          &nbsp;&nbsp;&nbsp;<van-badge :content="10">-->
<!--            <div class="child" />-->
<!--          </van-badge>-->
        </div>
      </div>
      <div class="fx">
        <div class="f1 fx-center" v-for="(btn ,i) in btns" :key="`j:${i}`">
          <div v-show="data.active == i" style="background: red;height:3px;width:30px;border-radius: 3px;"></div>
        </div>
      </div>
    </div>
    <!--    v-show="data.active == i"-->
    <van-swipe
        ref="swpie"
        class="my-swipe"
        :autoplay="0"
        :loop="false"
        @change="change"
        :style="data.div_style">
      <slot></slot>
      <template v-if="data.show_num!=false" #indicator="{ active, total }">
        <!--      <div class="custom-indicator">{{ active + 1 }}/{{ 4 }}</div>-->
      </template>
    </van-swipe>
  </div>

</template>

<script>
import api from "@/apis"
import Button from "./Button.vue";

export default {
  components: {
    Button
  },
  props: ['data'],
  data() {
    var vm = this
    var font_size = vm.data.font_size ? vm.data.font_size : '17px'
    var default_btn_style = {
      background: '#fff',
      'font-size': font_size,
      padding: '7px 0 7px 0',
      color: '#333',
    }
    var active_btn_style = {
      background: '#fff',
      'font-size': font_size,
      padding: '7px 0 7px 0',
      color: '#52A7FF',
    }
    var btns = vm.data.list.map(function (a, i) {
      return {
        name: a.name,
        i: i,
        style: default_btn_style,
        click() {
          vm.click_tab(this.i, this.name)
        }
      }
    })
    return {
      default_btn_style: default_btn_style,
      active_btn_style: active_btn_style,
      btns: btns,
    }
  },
  methods: {
    click_tab(i) {
      var vm = this
      console.log('click_tab', i)
      vm.data.active = i
      vm.set_active_btn_style(i)
      vm.to(i)
      if (typeof (vm.data.change) == 'function') vm.data.click_tab(i)
    },
    change(i) {
      var vm = this
      vm.data.active = i
      vm.set_active_btn_style(i)
      console.log('change', i)
      if (typeof (vm.data.change) == 'function') vm.data.change(i)
    },
    set_active_btn_style(i) {
      var vm = this
      vm.btns.forEach(function (btn) {
        btn.style = vm.default_btn_style
      })
      console.log(i, vm.btns[i])
      vm.btns[i].style = vm.active_btn_style
    },
    to(i) {
      var vm = this
      console.log('to:',i)
      vm.$refs.swpie.swipeTo(i)
    }
  },
  mounted() {
    var vm = this
    vm.set_active_btn_style(vm.data.active)
    vm.$refs.swpie.swipeTo(vm.data.active)
    vm.data.to = vm.to
    vm.data.update_name = function (i, name) {
      vm.btns[i].name = name
    }
  }
}
</script>

<style lang="less" scoped>
.my-swipe .van-swipe-item {
  color: #fff;
  text-align: center;
  background-color: #39a9ed;
}

.custom-indicator {
  position: absolute;
  right: 5px;
  bottom: 5px;
  padding: 2px 5px;
  font-size: 13px;
  color: #fff;
  text-shadow: 1px 1px 1px #555;
}
</style>
