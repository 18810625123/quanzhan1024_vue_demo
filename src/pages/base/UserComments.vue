<template>
  <div>
    <div v-for="comment in data.list">
      <div class="fx mgb10" v-if="comment.state == 1">
        <!--    头像-->
        <div class="pdr5 mgr5 pointer">
          <img @click="api.to_page(`/users/detail/${comment.user.uid}`)" :src="comment.user.head_img"
               style="width:30px;height:30px;border-radius: 50%;border: 1px solid #eee;">
        </div>

        <div class="w_100">
          <!--    用户名-->
          <div class="pointer" style="font-size: 14px;color: #555;margin-bottom: 3px;">{{ comment.user.nick_name }} <span style="color:#AAA">{{api.get_ip_info_str(comment.ip_info)}}</span></div>
          <!--    内容-->
          <span class="" style="font-size: 14px;color: #000;margin-bottom: 3px;"
                @click="click_comment_comment(comment)">{{ comment.content }}</span>

          <div class="">
            <!--        时间-->
            <span style="font-size: 12px;color: #AAA;">{{
                new Date(comment.created_at).format("MM-dd hh:mm")
              }}</span>
            <!--        评论数-->
            <span @click="like_comment(comment, comment.is_like == 1 ? 0 : 1)" class="fr mgr5 pointer" style="width:55px;">
                  <van-icon color="red"
                            :name="comment.is_like==1?'like':'like-o'"/>
<!--                  <span style="font-size: 13px;color:#888">&nbsp;{{ comment.like_count }} </span>-->
                </span>
            <!--        点赞数-->
            <span @click="click_comment_comment(comment)" class="fr mgr5 pointer" style="width:55px;">
<!--          <van-icon :style="comment.is_data==1?'color:red':''" name="comment-o"></van-icon>-->
                  <span style="font-size: 13px;color:#888;">回复&nbsp;
<!--                    {{ comment.comment_count }}-->
                  </span>
                </span>
            <!--        删除-->
            <span class="fr pointer" style="width:55px;font-size:13px;color:#DDD"
                  v-if="comment.user_id == api.current_user('id')" @click="delete_comment_open(comment)">
<!--                  <van-icon :name="'delete-o'"/>-->
              删除
                </span>
          </div>
        </div>
      </div>

      <!--    子评论-->
      <div class="">
        <div style="width:90%;margin-left: 20px;" :data="comment2" v-for="comment2 in comment.all_comments">
          <div class="fx mgb10"  v-if="comment2.state == 1">
            <!--    头像-->
            <div class="pdr5 mgr5 pointer">
              <img @click="api.to_page(`/users/detail/${comment2.user.uid}`)" :src="comment2.user.head_img"
                   style="width:21px;height:21px;border-radius: 50%;border: 1px solid #eee;">
            </div>

            <div class="w_100">
              <!--    用户名-->
              <div class="" style="font-size: 14px;color: #555;margin-bottom: 3px;">
                <span class="pointer">{{ comment2.user.nick_name }} <span style="color:#AAA">{{api.get_ip_info_str(comment2.ip_info)}}</span></span>
                <span style="font-size: 14px;color:#00a2d4">@ {{ comment2.user.nick_name }}</span>
              </div>
              <!--    内容-->
              <span class="" style="font-size: 14px;color: #000;margin-bottom: 3px;"
                    @click="click_comment_comment(comment2)">{{ comment2.content }}</span>

              <div class="">
                <!--        时间-->
                <span style="font-size: 12px;color: #AAA;">{{
                    new Date(comment2.created_at).format("MM-dd hh:mm")
                  }}</span>
                <!--        评论数-->
                <span @click="like_comment(comment2, comment2.is_like == 1 ? 0 : 1)" class="fr pointer"
                      style="width:55px;">
                  <van-icon color="red"
                            :name="comment2.is_like==1?'like':'like-o'"/>
<!--                  <span style="font-size: 13px;color:#888">&nbsp;{{ comment2.like_count }} </span>-->
                </span>
                <!--        点赞数-->
                <span @click="click_comment_comment(comment2)" class="fr mgr5 pointer" style="width:55px;">
<!--          <van-icon :style="comment.is_data==1?'color:red':''" name="comment-o"></van-icon>-->
                  <span style="font-size: 13px;color:#888;">回复&nbsp;
<!--                    {{ comment2.comment_count }}-->
                  </span>
                </span>
                <!--        删除-->
                <span class="fr pointer" style="width:55px;font-size:13px;color:#DDD"
                      v-if="comment.user_id == api.current_user('id')" @click="delete_comment_open(comment2)">
<!--                  <van-icon :name="'delete-o'"/>-->
              删除
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
    }
  },
  methods: {

    like_comment(comment, state) {
      var vm = this
      api.post("/user_likes/like", {
        data: {
          o_id: comment.id,
          o_type: 'UserComment',
          state: state
        },
        success: function (data) {
          comment.is_like = state
          comment.like_count += state == 1 ? 1 : -1
        },
        error: function (code, msg, data) {
        },
        must: function (err) {
        }
      })
    },
    click_comment_comment(comment) {
      var vm = this
      vm.data.click_comment_comment(comment)
    },
    delete_comment(comment) {
      var vm = this
      api.post("/user_comments/remove", {
        data: {
          id: comment.id,
        },
        success: function (data) {
          comment.state = 0
          comment.comment_count -= 1
        },
        error: function (code, msg, data) {
        },
        must: function (err) {
        }
      })
    },
    delete_comment_open(comment) {
      var vm = this
      vm.$store.state.dialog.open(function () {
        vm.$store.state.dialog.title = `删除评论`
        vm.$store.state.dialog.content = `确认删除你自己的这条评论吗`
        vm.$store.state.dialog.left_btn.show = true
        vm.$store.state.dialog.left_btn.name = `取消`
        vm.$store.state.dialog.left_btn.click = function () {
          vm.$store.state.dialog.show = false
        }
        vm.$store.state.dialog.right_btn.show = true
        vm.$store.state.dialog.right_btn.name = `删除`
        vm.$store.state.dialog.right_btn.click = function () {
          vm.delete_comment(comment)
        }
      })
    }
  },
  watch: {},
  mounted() {
    var vm = this
  }
}
</script>

<style lang="less" scoped>

</style>
