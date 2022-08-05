<template>
  <div class="w_100">
    <div v-for="(k,v) in data.fields" :key="k">{{k}}</div>
<!--    <MyField v-for="(k,v) in data.fields" :data="v"></MyField>-->
  </div>
</template>

<script>
import MyField from "./Field.vue"
import api from "@/apis"
export default {
  components: {
    MyField
  },
  props: ['data'],
  data() {
    var vm = this
    return {}
  },
  methods: {},
  mounted() {
    var vm = this
  }
}
</script>

<style lang="less" scoped>

</style>
