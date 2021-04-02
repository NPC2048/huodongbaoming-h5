<template>
  <!-- 登录 -->
  <van-nav-bar title="登录"/>
  <van-form style="margin-top: 0" @submit="onSubmit">
    <!-- 用户名 -->
    <van-field
        required v-model="state.username"
        name="username" label="用户名" placeholder="请输入用户名"
        :rules="[{required: true, message: '请输入用户名'}]"
    />
    <!-- 密码 -->
    <van-field
        type="password"
        required
        v-model="state.password"
        name="password" label="密码" placeholder="请输入密码"
        :rules="[{required: true, message: '请输入密码'}]"
    />
    <van-button round block type="primary" native-type="submit" :loading="state.submitLoading">登录</van-button>
    <van-cell>
      <template #title>
        <a style="color: black" @click="toRegister">注册</a>
      </template>
      <template #default>
        <a style="color: black" @click="forgetPass">忘记密码</a>
      </template>
    </van-cell>
  </van-form>
</template>

<script>
import {Cell, Row, Col, NavBar, Form, Button, Field, Toast} from 'vant';
import netKit from "@/utils/netKit";
import {reactive} from "vue";
import {router} from '@/router';
import {useStore} from 'vuex';

export default {
  name: "login",
  components: {
    [Cell.name]: Cell,
    [Row.name]: Row,
    [Col.name]: Col,
    [NavBar.name]: NavBar,
    [Form.name]: Form,
    [Button.name]: Button,
    [Field.name]: Field,
  },
  setup() {
    const state = reactive({
      username: '',
      password: '',
      submitLoading: false,
    });
    const store = useStore();
    // 菜单重置
    store.commit('initUserMenus');
    // 提交表单
    const onSubmit = (values) => {
      state.submitLoading = true;
      netKit.post('/user/login-email', values).then(data => {
        // 保存 token 信息
        const {tokenInfo, tokenInfo: {tokenValue}, menuList, avatar} = data;
        store.commit('loginStore', menuList);
        store.commit('setAvatar', avatar);
        localStorage.setItem("tokenInfo", JSON.stringify(tokenInfo));
        localStorage.setItem("token", tokenValue);
        // 设置用户角色信息
        // 提示消息
        Toast('登录成功');
        // 跳转到首页
        router.replace({name: 'homepage'});
      }).finally(() => {
        state.submitLoading = false;
      })
    }
    // 去注册页面
    const toRegister = () => {
      router.replace({name: 'register'});
    }
    // 忘记密码
    const forgetPass = () => {
      router.push({name: 'forgetPass'});
    }
    return {
      state,
      onSubmit,
      toRegister,
      forgetPass
    }
  },
}
</script>

<style scoped>
* {
  margin: 2px;
}
</style>