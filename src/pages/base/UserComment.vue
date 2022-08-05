<template>
  <div >
    <van-popup
        v-model:show="comment.show"
        close-icon="close"
        position="bottom"
        :style="{ height: '30%'}">
      <div class="pdl10 pdr10 mgt10 text-center" style="color:#666">
        {{ at }}
      </div>
      <van-field v-model="comment.value"
                 type="textarea"
                 :rows="4"
                 :placeholder="comment.des">
      </van-field>


      <div class="pos-abs text-center " style="bottom:10px;width:100%;">
        <!--      评论快捷键-->
<!--        <div class="pd5 fx-center"-->
<!--             style="background-color: red;font-size: 14px;color:#fff;width:90%;margin:0 auto;-->
<!--             background: linear-gradient(to right,#6FB5FF, #3295FF);border-radius: 15px;">-->
<!--          <div v-for="(btn, i) in btns" @click="btn.click()" class="f1 pointer"-->
<!--               style="font-size:13px;border-right: 1px solid #fff;border-left: 1px solid #fff;border-radius: 10px;">-->
<!--            {{ btn.name }}-->
<!--          </div>-->
<!--        </div>-->
        <div class="mgt10 mgb10 fx-center">
          <div @click="send()" class="mbtn" style="width:90%;background: red;color:#fff;font-size: 14px;">
            点击发送提问或评论
          </div>
        </div>
      </div>
    </van-popup>
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
      o: {},
      btns: [
        {
          name: '好课，666',
          templates: ['好课，666'],
          click() {
            var i = parseInt((Math.random() * this.templates.length))
            vm.comment.value = this.templates[i]
          }
        },
        {
          name: '通俗易懂',
          templates: ['通俗易懂'],
          click() {
            var i = parseInt((Math.random() * this.templates.length))
            vm.comment.value = this.templates[i]
          }
        },
        {
          name: '有点难',
          templates: ['有点难'],
          click() {
            var i = parseInt((Math.random() * this.templates.length))
            vm.comment.value = this.templates[i]
          }
        },
        {
          name: '太难了',
          templates: ['太难了'],
          click() {
            var i = parseInt((Math.random() * this.templates.length))
            vm.comment.value = this.templates[i]
          }
        },
      ],
      at: "",
      send() {
        vm.add_comment()
        vm.comment.show = false
      },
      comment: {
        value: '',
        show: false,
        o_id: '',
        o_type: '',
        des: '可以在此提问或发表你的评论、学习心得、笔记等哦',
      },
    }
  },
  methods: {
    random_comment(type) {
      var vm = this
      return vm.comment_templates[type][parseInt(Math.random() * 10)]
    },
    add_comment() {
      var vm = this
      if(!vm.comment.value){
        api.notify(`没有填写任何内容`)
        return
      }
      api.post("/user_comments/add", {
        data: {
          o_id: vm.comment.o_id,
          o_type: vm.comment.o_type,
          content: vm.comment.value,
        },
        success: function (data) {
          vm.comment.value = ''
          vm.data.comment_success(data, vm.o)
        },
        error: function (code, msg, data) {

        },
        must: function (err) {
        }
      })
    },
    remove_comment(comment) {
      var vm = this
      api.post("/user_comments/remove", {
        data: {
          id: comment.id,
        },
        success: function (data) {
          vm.data.remove_comment_success(state)
        },
        error: function (code, msg, data) {

        },
        must: function (err) {
        }
      })
    },
    open(o_type, o, desc = null) {
      var vm = this
      vm.o = o
      vm.comment.show = true
      vm.comment.o_type = o_type
      vm.comment.o_id = o.id
      vm.comment.value = ''

      console.log('open_comment', o)
      if (o_type == 'UserComment') {
        var str = `回复 ${o.user.nick_name}：${o.content}`
        if(str.length > 14) str = str.slice(0, 14) + '...'
        vm.at = `${str}`
      } else if (o_type == 'CurriculumCatalog') {
        var str = o.title
        if(str.length > 14) str = str.slice(0, 14) + '...'
        vm.at = `小节提问：${str}`
      } else if (o_type == 'Curriculum') {
        var str = o.title
        if(str.length > 14) str = str.slice(0, 14) + '...'
        vm.at = `课程评价：${str}`
      } else if (o_type == 'Blog') {
        var str = o.title
        if(o.type == 'dynamic') str = o.content
        if(str.length > 14) str = str.slice(0, 14) + '...'
        vm.at = `评论${o.type == 'article' ? '文章' : '动态'}：${str}`
      }
    }
  },
  watch: {},
  mounted() {
    var vm = this
    vm.data.open = vm.open
  }
}
</script>

<style lang="less" scoped>
.mbtn {
  padding: 7px 0px 7px 0px;
  border: 0px;
  color: #000;
  width: 100%;
  border-radius: 10px;
  background: #ddd;
}

.mbtn:active {
  opacity: 0.8;
}
</style>
