<template>
  <div>
    <van-field
        v-model="data.value"
        is-link
        readonly
        :label="data.title"
        :placeholder="data.desc"
        @click="show = true"
    />
    <van-popup v-model:show="show" round position="bottom">
      <van-cascader
          v-model="value"
          :title="data.desc"
          :options="options"
          @close="show = false"
          @change="onChange"
          @finish="onFinish"
      />
    </van-popup>
  </div>
</template>

<script>
import api from "@/apis"

export default {
  props: ['data'],
  data() {
    var vm = this
    if (!vm.data.options_key) {
      console.error(`${vm.data.title} 缺少 options_key`)
      return
    }
    var arr = vm.data.options_key.split('__')
    var state_options = vm.$store.state.options[arr[0]][arr[1]]
    var options = api.state_options_to_arr(state_options)
    // if(vm.data.title == '所在城市'){
    //   debugger
    // }
    // console.log(vm.data.title, options)
    return {
      errors: [],
      show: false,
      state_options: state_options,
      options: options,
      value: '',
    }
  },
  methods: {
    onFinish(v) {
      var vm = this
      vm.show = false
      vm.value = v.selectedOptions.map(function (a) {
        return a.value
      })
      vm.data.value = v.selectedOptions.map(function (a) {
        return a.text
      }).join('/')
      if (typeof (vm.data.finish) == 'function') {
        vm.data.finish(vm.value)
      }
    },
    onChange(v) {
      var vm = this
    },
    validate() {

    },
    get() {
      var vm = this
      return vm.value
    },
    set(arr) {
      var vm = this
      if (!Array.isArray(arr)) {
        arr = [arr]
      }
      var kv = vm.state_options[arr[0]]
      if(!kv){
        console.error(`${vm.type} set出错！ ${vm.data.title}(${vm.data.options_key}['${arr[0]}']) 没有找到这个key：${arr[0]}`)
        return
      }
      if (!kv['name']) {
        console.error(`${vm.type} set出错！ ${vm.data.title}(${vm.data.options_key}): 没有name这个key  ${arr[0]}`)
        return
      }
      var vs = [kv.name]
      kv = kv.children
      for (let i = 1; i < arr.length; i++) {
        kv = kv[arr[i]]
        vs.push(kv.name)
        kv = kv.children
      }
      vm.data.value = vs.join('/')
    },
  },
  watch: {
    //change事件
    'data.value': function (new_value, old_value) {
      // var vm = this
      // console.log(123, new_value)
      // vm.value = new_value.join('/')
      // console.log(111, vm.value)
    }
  },
  mounted() {
    var vm = this
    vm.data.validate = vm.validate
    vm.data.errors = vm.errors
    vm.data.get = vm.get
    vm.data.set = vm.set
  }
}
</script>

<style lang="less" scoped>

</style>
