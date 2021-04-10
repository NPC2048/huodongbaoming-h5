<template>
  <!-- 修改个人信息 -->
  <van-nav-bar title="我发布的活动" left-arrow @click-left="back"/>
  <van-form ref="form" style="margin-top: 0" @submit="onSubmit">
    <!-- 用户名 -->
    <van-field
        required v-model="state.name"
        autocomplete="off"
        name="name" label="用户名" placeholder="请输入用户名"
        :rules="[{required: true, message: '请输入用户名'}]"
    />
    <!-- 性别 -->
    <van-field
        required
        autocomplete="off"
        label="性别" placeholder="请选择性别">
      <template #input>
        <van-row gutter="10">
          <van-col>
            <van-checkbox v-model="unknownCheck" @change="value => changeGender(value, 0)">保密</van-checkbox>
          </van-col>
          <van-col>
            <van-checkbox v-model="manChecked" @change="value => changeGender(value, 1)">男</van-checkbox>
          </van-col>
          <van-col>
            <van-checkbox v-model="womanChecked" @change="value => changeGender(value, 2)">女</van-checkbox>
          </van-col>
        </van-row>
      </template>
    </van-field>
    <van-field type="hidden" v-model="state.gender" name="gender"/>
    <van-button round block type="primary" native-type="submit" :loading="state.submitLoading">提交</van-button>
  </van-form>
</template>

<script>
import {Row, Col, Button, Checkbox, CheckboxGroup, Field, Form, NavBar, NoticeBar, Tabs, Toast} from "vant";
import {router} from "@/router";
import {reactive, ref} from "vue";
import {useStore} from "vuex";
import netKit from "@/utils/netKit";

export default {
  name: "modify-info",
  setup() {
    const store = useStore();
    const userinfo = store.state.userinfo;
    const state = reactive({
      name: userinfo.name,
      gender: userinfo.gender,
      submitLoading: false,
    });
    const unknownCheck = ref(false);
    const manChecked = ref(false);
    const womanChecked = ref(false);
    const checkedArr = [unknownCheck, manChecked, womanChecked];
    if (userinfo.gender !== undefined) {
      const check = userinfo.gender ? womanChecked : manChecked;
      check.value = true;
    } else {
      unknownCheck.value = true;
    }
    // 初始化用户信息
    const changeGender = (value, index) => {
      // 选中, 其他的选项取消选中
      const checked = checkedArr.filter((item, i) => i === index);
      const otherChecked = checkedArr.filter((item, i) => i !== index);
      if (value) {
        checked.value = true;
        otherChecked.forEach(item => item.value = false);
      }
    }

    // 提交表单
    const onSubmit = (values) => {
      const checked = checkedArr.map((item, index) => {
        return {item, index}
      }).filter(item => item.item.value);
      if (!checked.length) {
        return Toast('请选择性别');
      }
      const index = checked[0].index - 1;
      values.gender = index < 0 ? null : index;
      // loading
      state.submitLoading = true;
      netKit.post('/user/modify-userinfo', values).then(() => {
        Toast('修改成功')
        // 跳转到用户页
        router.replace({name: 'userinfo'})
      }).finally(() => {
        state.submitLoading = false;
      });
    }

    return {
      state,
      unknownCheck,
      manChecked,
      womanChecked,
      changeGender,
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