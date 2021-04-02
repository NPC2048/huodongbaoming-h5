<template>
  <!-- 修改个密码 -->
  <van-nav-bar title="修改密码" left-arrow @click-left="back"/>
  <van-form ref="form" style="margin-top: 0" @submit="onSubmit" @failed="onFailed">
    <!-- 旧密码 -->
    <van-field
        type="password"
        required v-model="state.oldPass"
        autocomplete="off"
        name="oldPass" label="旧密码" placeholder="请输入旧密码"
        :rules="[{required: true, message: '请输入旧密码'}]"
    />
    <!-- 新密码 -->
    <van-field
        type="password"
        required v-model="state.newPass"
        autocomplete="off"
        name="newPass" label="新密码" placeholder="请输入新密码"
        :rules="[{required: true, message: '请输入新密码'}]"
    />
    <!-- 确认新密码 -->
    <van-field
        type="password"
        required v-model="state.confirmPass"
        autocomplete="off"
        name="confirmPass" label="确认新密码" placeholder="请确认新密码"
        :rules="[{required: true, message: '请确认新密码'}]"
    />
    <van-button round block type="primary" native-type="submit" :loading="state.submitLoading">提交</van-button>
  </van-form>
</template>

<script>
import {Button, Checkbox, CheckboxGroup, Col, Field, Form, NavBar, NoticeBar, Row, Tabs, Toast} from "vant";
import {router} from "@/router";
import {reactive} from "vue";
import netKit from "@/utils/netKit";

export default {
  name: "modify-info",
  setup() {
    const state = reactive({
      oldPass: '',
      newPass: '',
      confirmPass: '',
      submitLoading: false,
    });

    // 提交表单
    const onSubmit = (values) => {
      // loading
      state.submitLoading = true;
      netKit.post('/user/modify-pass', values).then(() => {
        Toast('修改成功')
        // 跳转到用户页
        router.replace({name: 'userinfo'})
      }).finally(() => {
        state.submitLoading = false;
      });
    }

    return {
      state,
      onSubmit,
      back: () => router.back()
    }
  },
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Tabs.name]: Tabs,
    [NavBar.name]: NavBar,
    [NoticeBar.name]: NoticeBar,
    [Form.name]: Form,
    [Field.name]: Field,
    [CheckboxGroup.name]: CheckboxGroup,
    [Checkbox.name]: Checkbox,
    [Button.name]: Button
  }
}
</script>

<style scoped>

</style>