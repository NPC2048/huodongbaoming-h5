<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
// import tabbar from "@/layout/tabbar";
import {useStore} from "vuex";
import netKit from "@/utils/netKit";

export default {
  name: 'App',
  components: {
    // tabbar
  },
  created() {
    const store = useStore();
    // 页面加载时读取 storage 里的状态信息

    const storageStore = localStorage.getItem('store');
    if (storageStore) {
      store.replaceState(Object.assign({}, store.state, JSON.parse(storageStore)));
      // 拉取菜单
      netKit.get('/menu/menus').then(menuList => {
        // 更新到 store
        store.commit('setMenuList', menuList);
      })
    }
    // 页面刷新时存储 store 到 sessionStorage
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('store', JSON.stringify(store.state));
    })
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  margin-top: 10px;
}
</style>
