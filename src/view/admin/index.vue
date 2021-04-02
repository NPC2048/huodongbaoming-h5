<template>
  <!-- 默认显示所有未审核的活动, 可切换查看未审核的活动 -->
  <van-row>
    <van-col span="18">
      <!-- 搜索框 -->
      <van-search
          v-model="state.params.keyword"
          placeholder="请输入关键字"
          @search="onSearch"
          @update:model-value="onUpdateSearch"
      />
    </van-col>
    <van-col span="6">
      <!-- 状态下拉菜单 -->
      <van-dropdown-menu>
        <van-dropdown-item v-model="state.params.status" :options="state.statusOption" @change="stateChange"/>
      </van-dropdown-menu>
    </van-col>
  </van-row>
  <!-- 活动列表 -->
  <van-pull-refresh v-model="state.refreshing" @refresh="onSearch">
    <van-list class="van-list"
              :immediate-check="false"
              v-model:loading="state.loading"
              :finished="state.finished"
              finished-text="没有更多了"
              @load="nextPage"
              style="margin-bottom: 50px"
    >
      <!-- 复选框组 -->
      <van-checkbox-group v-model="state.checked" ref="checkboxGroup">
        <van-checkbox class="van-checkbox" v-for="item in state.list" :key="item.id" :name="item.id">
          <!-- 活动标题 -->
          <van-cell center :title="item.title">
            <!-- 活动内容和地址 -->
            <template #label>
              {{ item.content }}
              {{ item.address }}
            </template>
            <!-- 活动状态 -->
            <template #extra>
              <ac-status :status="item.status"/>
            </template>
          </van-cell>
        </van-checkbox>
      </van-checkbox-group>
    </van-list>
  </van-pull-refresh>
  <!-- 审核按钮 -->
  <van-action-bar class="van-action-bar">
    <van-action-bar-button @click="checkAll">
      <van-checkbox @click="checkAll" v-model="state.groupChecked">全选</van-checkbox>
    </van-action-bar-button>
    <van-action-bar-button icon="success" color="green" text="通过" @click="pass"/>
    <van-action-bar-button icon="cross" type="danger" text="拒绝" @click="refuse"/>
  </van-action-bar>
  <tabbar/>
</template>

<script>
import {reactive, ref} from 'vue';
import {
  ActionBar,
  ActionBarButton,
  ActionBarIcon,
  Cell,
  Checkbox,
  CheckboxGroup,
  Col,
  DropdownItem,
  DropdownMenu,
  List,
  PullRefresh,
  Row,
  Search,
  Tag,
  Toast
} from 'vant';
import Status from "@/components/activity/Status";
import AcStatus from "@/components/activity/Status";
import netKit from "@/utils/netKit";
import Tabbar from "@/layout/tabbar";
import axios from "axios";

export default {
  name: "admin",
  setup() {
    const state = reactive({
      params: {
        keyword: '',
        status: '',
      },
      statusOption: [
        {text: '所有活动', value: ''},
        {text: '未审核', value: 0},
        {text: '通过', value: 1},
        {text: '拒绝', value: 2},
      ],
      list: [],
      pagination: {
        current: 1,
        pages: 0,
        size: 10
      },
      checked: [],
      groupChecked: false,
      refreshing: false,
      loading: false,
      finished: false,
      updateSearchId: 0,
    })

    // 搜索
    const onSearch = (value) => {
      fetchSearch({keyword: value, current: 1});
    }

    // 下一页
    const nextPage = () => {
      fetchSearch({current: state.pagination.current + 1}, true);
    }

    // 从服务器查询活动数据
    const fetchSearch = ({
                           keyword = state.params.keyword,
                           status = state.params.status,
                           current = state.pagination.current
                         }, isAppend) => {
      state.finished = true;
      state.loading = true;
      state.refreshing = true;
      // 组装参数
      const params = {keyword, status, current};
      // 发送请求
      netKit.post('/admin/list', params).then(data => {
        const {records, current, pages} = data;
        // 列表
        if (isAppend) {
          records.forEach(item => {
            state.list.push(item);
          })
        } else {
          state.list = records;
        }
        state.pagination.current = current;
        state.pagination.pages = pages;
        state.checked = [];
      }).finally(() => {
        state.loading = false;
        state.refreshing = false;
        state.finished = state.pagination.current >= state.pagination.pages;
      });
    }

    // 输入框更新时间
    const onUpdateSearch = (value) => {
      // 函数防抖
      if (state.updateSearchId) {
        clearTimeout(state.updateSearchId);
      }
      state.updateSearchId = setTimeout(() => {
        onSearch(value);
      }, 1000);
    }

    // 状态切换
    const stateChange = (value) => {
      state.params.status = value;
      fetchSearch({status: value, current: 1});
    }

    // 全选反选
    const checkboxGroup = ref(null);
    const checkAll = () => {
      checkboxGroup.value.toggleAll(state.groupChecked = !state.groupChecked);
    }

    // 通过
    const pass = () => {
      const {checked} = state;
      if (!checked.length) {
        return Toast('请选择活动');
      }

      axios.post('/admin/pass', {data: checked}).then(() => {
        Toast('操作成功');
        // 刷新页面
        onSearch();
      })
    }

    // 拒绝
    const refuse = () => {
      const {checked} = state;
      if (!checked.length) {
        return Toast('请选择活动');
      }
      axios.post('/admin/refuse', {data: checked}).then(() => {
        onSearch();
        Toast('操作成功');
      })
    }

    // 初始化加载
    onSearch();

    return {
      state,
      onSearch,
      nextPage,
      onUpdateSearch,
      stateChange,
      checkAll,
      checkboxGroup,
      pass,
      refuse
    }
  },
  // vant 组件注册
  components: {
    [Tabbar.name]: Tabbar,
    AcStatus,
    [Search.name]: Search,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [Row.name]: Row,
    [Col.name]: Col,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [Cell.name]: Cell,
    [ActionBar.name]: ActionBar,
    [ActionBarIcon.name]: ActionBarIcon,
    [ActionBarButton.name]: ActionBarButton,
    [CheckboxGroup.name]: CheckboxGroup,
    [Checkbox.name]: Checkbox,
    [Tag.name]: Tag,
    [Status.name]: Status
  },
}

</script>

<style scoped>
@import "index.less";

.van-dropdown-menu >>> div {
  box-shadow: unset;
}

.van-checkbox >>> .van-checkbox__label {
  width: 100%;
}

</style>