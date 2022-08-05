<template>
  <div>
    <div :style="`border-bottom: ${data.bottom_line>0?data.bottom_line:0}px dashed #ddd`" v-for="(v,k) in data.fields">
      <Field :data="v"></Field>
    </div>
  </div>
</template>

<script>
import Field from "./Field.vue"
import api from "@/apis"

export default {
  components: {
    Field
  },
  props: ['data'],
  data() {
    var vm = this
    return {
      errors: [],
    }
  },
  methods: {
    get() {
      var vm = this
      var json = {}
      for (var k in vm.data.fields) {
        json[k] = vm.data.fields[k].value
      }
      return json
    },
    validate() {
      var vm = this
      for (var k in vm.data.fields) {
        if (!vm.data.fields[k].validate()) {
          return
        }
      }
    },
    set(data) {
      var vm = this
      for (let k in vm.data.fields) {
        if (data[k]) {
          vm.data.fields[k].set(data[k])
        }
      }
    }
  },
  mounted() {
    var vm = this
    vm.data.get = vm.get
    vm.data.set = vm.set
    vm.data.validate = vm.validate
  }
}
</script>

<style lang="less" scoped>

</style>
