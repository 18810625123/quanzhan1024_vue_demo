<template>
  <div :id="id" class="text-center mbtn" @click="data.click(data)"
          :disabled="data.disabled==true?true:false"
          :style="data.style?data.style:default_style">{{ data.name }}
  </div>
</template>

<script>
import api from "@/apis"

export default {
  props: ['data'],
  data() {
    var vm = this
    return {
      id: String.random(11),
      default_style: {
        background: '#fff',
        'font-size': '14px',
        'border': '0px',
        color: '#666'
      }
    }
  },
  methods: {},
  mounted() {
    var vm = this
  }
}
</script>

<style lang="less" scoped>

</style>
