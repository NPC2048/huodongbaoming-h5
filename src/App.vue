<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import {useStore} from 'vuex';
import netKit from '@/utils/netKit';
import {DEFAULT_MENU_LIST} from './utils/global';

export default {
  name: 'App',
  created() {
    const store = useStore();
    // 页面加载时读取 storage 里的状态信息
    netKit.get('/system/shutdown').then(r => {
      console.log('r:', r);
    })
    console.log(netKit.axios.defaults.baseURL)
    const storageStore = localStorage.getItem('store');
    if (storageStore) {
      store.replaceState(Object.assign({}, store.state, JSON.parse(storageStore)));
      // 拉取菜单
      netKit.get('/menu/menus').then(menuList => {
        // 更新到 store
        if (menuList.length) {
          store.commit('setMenuList', menuList);
        } else {
          store.commit('setMenuList', DEFAULT_MENU_LIST);
        }
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
