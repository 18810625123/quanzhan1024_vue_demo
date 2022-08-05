<template>
  <div>
    <template v-if="data.type == 'select'">
      <Select :data="data">
        <slot></slot>
      </Select>
    </template>
    <template v-if="data.type == 'text' || data.type == 'textarea' || data.type == 'password'">
      <Text :data="data">
        <slot></slot>
      </Text>
    </template>
    <template v-if="data.type == 'date'">
      <Date :data="data">
        <slot></slot>
      </Date>
    </template>
    <template v-if="data.type == 'upload'">
      <Upload2 :data="data">
        <slot></slot>
      </Upload2>
    </template>
  </div>
</template>

<script>
import Text from "./Text.vue"
import Select from "./Select.vue"
import Date from "./Date.vue"
import Upload2 from "./Upload2.vue"
import api from "@/apis"
export default {
  components: {
    Text, Select, Date,Upload2
  },
  props: ['data'],
  data() {
    var vm = this
    return {
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
