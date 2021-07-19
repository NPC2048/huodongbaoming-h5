<template>
  <!-- 底部导航栏 -->
  <van-tabbar v-model="active" class="tabbar" route placeholder>
    <van-tabbar-item
        v-for="item in store.state.userMenuList"
        :key="item.path"
        :name="item.name"
        :icon="item.icon"
        replace
        :to="item.path">
      {{ item.name }}
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>

import {ref} from 'vue';
import {Tabbar, TabbarItem} from 'vant';
import {useStore} from "vuex";
import netKit from '../utils/netKit';
import {DEFAULT_MENU_LIST} from '../utils/global';

export default {
  name: "tabbar",
  setup() {
    const store = useStore();
    if (!store.state.userMenuList.length) {
      netKit.get('/menu/menus').then(menuList => {
        if (menuList.length) {
          store.commit('setMenuList', menuList);
        } else {
          store.commit('setMenuList', DEFAULT_MENU_LIST);
        }
      })
    }
    return {store, active: ref(0)}
  },
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem
  },
}
</script>

<style scoped>

</style>