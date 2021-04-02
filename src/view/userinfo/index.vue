<template>
  <van-row class="user" gutter="10">
    <van-col span="6">
      <van-image
          class="user-thumb"
          round
          width="5rem"
          height="5rem"
          :key="state.componentKey"
          :src="state.avatar"
      >
        <template v-slot:loading>
          <van-loading type="spinner"/>
        </template>
      </van-image>
    </van-col>
    <van-col span="18">
      <van-row>
        <van-cell :title="store.state.userinfo.name" size="large"/>
      </van-row>
      <van-row>
        <van-cell>
          <ac-gender :gender="store.state.userinfo.gender"/>
        </van-cell>
      </van-row>
    </van-col>
  </van-row>
  <!-- 收藏区域 -->
  <van-grid :column-num="3">
    <van-grid-item icon="edit" text="修改个人信息" to="modifyInfo"/>
    <van-grid-item icon="clock-o" text="已报名活动" to="signedUp"/>
    <van-grid-item icon="share-o" text="我发布的活动" to="myPublish"/>
  </van-grid>
  <!-- 信息区域 -->
  <van-cell-group>
    <van-cell title="修改头像/邮箱" is-link to="modifyAvatarEmail"/>
    <van-cell title="修改密码" is-link to="modifyPass"/>
    <van-cell title="退出登录" is-link @click="logout"/>
  </van-cell-group>
  <tabbar/>
</template>

<script>
import {reactive} from 'vue';
import {Image, Row, Col, Cell, NavBar, CellGroup, Grid, GridItem, Dialog, Toast, Loading} from 'vant';
import Gender from "@/components/Gender";
import netKit from "@/utils/netKit";
import {useStore} from "vuex";
import Tabbar from "@/layout/tabbar";
import axios from "axios";
import {router} from "@/router";

export default {
  name: "publish",
  components: {
    Tabbar,
    [Image.name]: Image,
    [Cell.name]: Cell,
    [Row.name]: Row,
    [Col.name]: Col,
    [NavBar.name]: NavBar,
    [CellGroup.name]: CellGroup,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
    [Gender.name]: Gender,
    [Loading.name]: Loading
  },
  setup() {
    const store = useStore();
    const state = reactive({
      userinfo: {
        name: '',
        gender: -1,
        email: '',
      },
      avatar: store.state.avatar,
      componentKey: 0
    });

    // 拉取用户信息
    netKit.get('/user/info').then(data => {
      // 存储到 store 中
      store.commit('setUserInfo', data);
      state.userinfo = data;
      state.avatar = data.gratavar;
      state.componentKey = state.componentKey + 1;
    });

    // 退出登录
    const logout = () => {
      Dialog.confirm({
        message: '确认要退出登录吗？'
      }).then(() => {
        axios.post('/user/logout').then(() => {
          Toast('退出登录');
          // 清除 token 与用户信息
          localStorage.removeItem('token');
          store.commit('setUserInfo', {});
          // 跳转到登录页
          router.replace({name: 'login'});
        })
      }).catch(() => {
        Toast('取消操作');
      })
    }

    return {
      state,
      store,
      logout
    }
  },
}
</script>

<style scoped>
.user-thumb {
  padding: 10px;
}
</style>