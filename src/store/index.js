import {createStore} from 'vuex'
import {DEFAULT_MENU_LIST} from "@/utils/global";


export const store = createStore({
  state() {
    return {
      userMenuList: DEFAULT_MENU_LIST,
      userinfo: {},
      isLogin: false,
      // 用户头像信息, 登陆后服务器返回
      avatar: '',
    }
  },
  mutations: {
    initUserMenus(state) {
      state.userMenuList = DEFAULT_MENU_LIST
    },
    setMenuList(state, userMenuList) {
      state.userMenuList = userMenuList;
    },
    loginStore(state, userMenuList) {
      state.userMenuList = userMenuList;
      state.isLogin = true;
    },
    setUserInfo(state, userinfo) {
      state.userinfo = userinfo;
    },
    setAvatar(state, avatar) {
      state.avatar = avatar;
    }
  }
})