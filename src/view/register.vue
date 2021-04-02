<template>
  <van-nav-bar title="注册"/>
  <van-form ref="form" style="margin-top: 0" @submit="onSubmit">
    <!-- 用户名 -->
    <van-field
        required v-model="state.name"
        name="name" label="用户名" placeholder="请输入用户名"
        :rules="[{required: true, message: '请输入用户名'}]"
    />
    <!-- 邮箱 -->
    <van-field
        required v-model="state.email"
        name="email" label="邮箱" placeholder="请输入邮箱"
        :rules="[{required: true, message: '请输入邮箱'}]"
    />
    <!-- 密码 -->
    <van-field
        type="password"
        required
        v-model="state.password"
        name="password" label="密码" placeholder="请输入密码"
        :rules="[{required: true, message: '请输入密码'}]"
    />
    <!-- 确认密码 -->
    <van-field
        type="password"
        required
        v-model="state.confirmPass"
        name="confirmPass" label="确认密码" placeholder="请确认密码"
        :rules="[{required: true, message: '请输入确认密码'}]"
    />
    <!-- 邮箱验证码 -->
    <van-field
        required
        v-model="state.code"
        name="code" label="邮箱验证码" placeholder="请输入邮箱验证码"
        :rules="[{required: true, message: '请输入邮箱验证码'}]"
    >
      <template #button>
        <van-button v-if="state.buttonStatus" size="small" type="primary" @click="getEmailCode">发送验证码</van-button>
        <van-button v-else size="small" type="primary" disabled>发送验证码 {{ state.buttonTimeout }}</van-button>
      </template>
    </van-field>
    <van-button round block type="primary" native-type="submit">注册</van-button>
    <van-cell>
      <template #title>
        <a style="color: black" @click="toLogin">已有账号？登录</a>
      </template>
    </van-cell>
  </van-form>
</template>

<script>
import netKit from "@/utils/netKit";
import {reactive} from "vue";
import {router} from '@/router'
import {Button, Cell, Col, Field, Form, NavBar, Row, Toast} from "vant";

export default {
  name: "register",
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
      name: '',
      email: '',
      password: '',
      confirmPass: '',
      code: '',
      buttonStatus: true,
      buttonTimeout: 60,
    });

    const onSubmit = (values) => {
      netKit.post('/user/register', values).then(data => {
        console.log('注册成功:', data);
        Toast('注册成功，请登录')
        // 跳转到登录页
        router.replace({name: 'login'})
      });
    }

    const toLogin = () => {
      router.replace({name: 'login'});
    }

    const buttonStatus = () => {
      if (state.buttonTimeout < 1) {
        state.buttonStatus = true;
        state.buttonTimeout = 60;
        return;
      }
      state.buttonTimeout--;
      setTimeout(buttonStatus, 1000);
    }

    return {
      state,
      toLogin,
      onSubmit,
      buttonStatus
    };
  },
  methods: {
    getEmailCode() {
      const form = this.$refs['form'];
      const validPromise = form.validate(['name', 'email', 'password', 'confirmPass']);
      // 表单校验
      validPromise.then(() => {
        // 组装参数
        const {name, password, confirmPass, email} = this.state;
        // 获取邮箱验证码
        // 按钮设置为禁选状态
        this.state.buttonStatus = false;
        netKit.post('/user/mail-code', {
          name, password, confirmPass, email
        }).then(() => {
          Toast('获取验证码成功，请查收邮件，3 分钟内有效~');
        })
        // 设置定时任务, 60 秒后解除锁定
        this.buttonStatus();
      }).catch(reason => {
        console.log('error reason:', reason);
      })
    }
  }
}
</script>

<style scoped>

</style>