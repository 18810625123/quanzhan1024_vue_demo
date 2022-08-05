<template>
  <div>

    <md-editor v-if="data.toolbars==false"
        v-model="data.text"
               :preview-only="data.readonly"
               :preview="data.preview"
               :previewTheme="data.preview_theme ? data.preview_theme : `cyanosis`"
               :codeTheme="`kimbie`"
               :theme="`light`"
               :toolbars="[]"
               :footers="['markdownTotal']"
               :style="`height:${data.height?data.height:'300px'};`"
               :pageFullScreen="data.full_screen"
               :toolbarsExclude="excludes"
    >
    </md-editor>
    <md-editor v-else
               v-model="data.text"
               :preview-only="data.readonly"
               :preview="data.preview"
               :previewTheme="data.preview_theme ? data.preview_theme : `cyanosis`"
               :codeTheme="`kimbie`"
               :theme="`light`"
               :footers="['markdownTotal']"
               :pageFullScreen="data.full_screen"
               :toolbarsExclude="excludes"
    >
    </md-editor>
  </div>
</template>

<script>
import api from "@/apis"
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

export default {
  components: {
    MdEditor
  },
  props: ['data'],
  data() {
    var vm = this
    return {
      excludes: [
        'save', 'github'
      ],
      excludes2: [
        'save', 'github', 'copy', 'shear', 'delete', 'underline',
        'italic', 'h1', 'h1-h6', 'superscript','code block','insert space','bold text',
        'subscript', 'quote', 'link', 'withdraw', 'line-through', 'forward', 'table'
      ]
    }
  },
  methods: {
    confirm() {
      var vm = this
      if (typeof (vm.data.confirm) == 'function') vm.data.confirm()
    },
    cancel() {
      var vm = this
      if (typeof (vm.data.confirm) == 'function') vm.data.cancel()
    },
  },
  mounted() {
    var vm = this
  }
}
</script>

<style lang="less" scoped>

</style>
