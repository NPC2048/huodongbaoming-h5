<template>
  <!-- 忘记密码 -->
  <van-nav-bar title="忘记密码"/>
  <van-form style="margin-top: 0" @submit="onSubmit" ref="form">
    <!-- 用户名或邮箱 -->
    <van-field
        required v-model="state.name"
        name="name" label="用户名或邮箱" placeholder="请输入用户名或邮箱"
        :rules="[{required: true, message: '请输入用户名或邮箱'}]"
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
    <!-- 邮箱验证码 -->
    <van-field
        required
        v-model="state.code"
        name="code" label="邮箱验证码" placeholder="请输入邮箱验证码"
        :rules="[{required: true, message: '请输入邮箱验证码'}]"
    >
      <template #button>
        <van-button v-if="state.buttonStatus" size="small" type="primary" v-model:loading="state.getCodeLoading"
                    @click="getEmailCode">发送验证码
        </van-button>
        <van-button v-else size="small" type="primary" disabled>发送验证码 {{ state.buttonTimeout }}</van-button>
      </template>
    </van-field>
    <van-button round block type="primary" native-type="submit">重置密码</van-button>
    <van-cell>
      <template #title>
        <a style="color: black" @click="toLogin">登录</a>
      </template>
      <template #default>
        <a style="color: black" @click="toRegister">注册</a>
      </template>
    </van-cell>
  </van-form>
</template>

<script>
import {Cell, Row, Col, NavBar, Form, Button, Field, Toast} from 'vant';
import {reactive} from "vue";
import {router} from "@/router";
import netKit from "@/utils/netKit";

export default {
  name: "forgetPass",
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
      newPass: '',
      confirmPass: '',
      getCodeLoading: false,
      submitLoading: false,
      buttonStatus: true,
      buttonTimeout: 60,
    });
    const buttonStatus = () => {
      if (state.buttonTimeout < 1) {
        state.buttonStatus = true;
        state.buttonTimeout = 60;
        return;
      }
      state.buttonTimeout--;
      setTimeout(buttonStatus, 1000);
    }

    const onSubmit = (values) => {
      netKit.post('/user/modify-pass-by-email', values).then(() => {
        Toast('密码修改成功')
        // 跳转到登录页
        router.replace({name: 'login'})
      });
    }

    return {
      state,
      buttonStatus,
      onSubmit,
      toRegister: () => router.replace({name: 'register'}),
      toLogin: () => router.replace({name: 'login'})
    }
  },
  methods: {
    getEmailCode() {
      const form = this.$refs['form'];
      const validPromise = form.validate(['name']);
      // 表单校验
      validPromise.then(() => {
        // 组装参数
        const {name} = this.state;
        // 获取邮箱验证码
        this.state.getCodeLoading = true;
        netKit.post('/user/forget-code', {
          data: name
        }).then(() => {
          Toast('获取验证码成功，请查收邮件，3 分钟内有效~');
          // 按钮设置为禁选状态
          this.state.buttonStatus = false;
          // 设置定时任务, 60 秒后解除锁定
          this.buttonStatus();
        }).finally(() => {
          this.state.getCodeLoading = false;
        })
      }).catch(reason => {
        console.log('error reason:', reason);
      })
    }
  }
}
</script>

<style scoped>
* {
  margin: 2px;
}
</style>