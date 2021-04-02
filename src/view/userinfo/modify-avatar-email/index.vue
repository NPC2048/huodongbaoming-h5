<template>
  <!-- 修改头像/邮箱 -->
  <van-nav-bar title="修改头像/邮箱" left-arrow @click-left="back"/>
  <van-form ref="form" style="margin-top: 0" @submit="onSubmit">
    <!-- 邮箱头像更新 -->
    <van-notice-bar text="自定义头像到 gravatar 官网上传即可"/>
    <van-field
        required v-model="state.email"
        name="email" label="头像与邮箱" placeholder="请输入 gravatar 邮箱"
        :rules="[{required: true, message: '请输入邮箱'}]"
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
    <van-button round block type="primary" native-type="submit" :loading="state.submitLoading">提交</van-button>
  </van-form>
</template>

<script>
import {reactive} from "vue";
import {router} from "@/router";
import {Button, Field, Form, NavBar, NoticeBar, Toast} from "vant";
import netKit from "@/utils/netKit";

export default {
  name: "modify-avatar-email",
  setup() {
    const state = reactive({
      email: '',
      submitLoading: false,
      getCodeLoading: false,
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
      netKit.post('/user/modify-email', values).then(() => {
        Toast('邮箱修改成功')
        // 跳转到登录页
        router.replace({name: 'userinfo'})
      });
    }

    return {
      state,
      buttonStatus,
      onSubmit,
      back: () => router.back()
    }
  },
  methods: {
    getEmailCode() {
      const form = this.$refs['form'];
      const validPromise = form.validate(['email']);
      // 表单校验
      validPromise.then(() => {
        // 组装参数
        const {email} = this.state;
        // 获取邮箱验证码
        this.state.getCodeLoading = true;
        netKit.post('/user/modify-mail-code', {
          data: email
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
  },
  components: {
    [NavBar.name]: NavBar,
    [NoticeBar.name]: NoticeBar,
    [Field.name]: Field,
    [Button.name]: Button,
    [Form.name]: Form,
  }
}
</script>

<style scoped>

</style>