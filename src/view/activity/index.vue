<template>
  <!-- 搜索框 -->
  <van-search
      v-model="state.params.keyword"
      placeholder="请输入关键字"
      @search="onSearch"
      @update:model-value="onUpdateSearch"
  />
  <!-- 列表 -->
  <van-pull-refresh v-model="state.refreshing" @refresh="onSearch">
    <van-list class="van-list"
              v-model:loading="state.loading"
              :finished="state.finished"
              finished-text="没有更多了"
              @load="nextPage"
              :offset="300"
              :immediate-check="false"
    >
      <van-cell :title="item.title" v-for="item in state.list" :key="item.id" @click="(e) => activityClick(item, e)">
        <template #title>
          <van-row class="van-hairline--bottom" justify="start">
            <van-col span="16">
              {{ item.title }}
            </van-col>
            <van-col span="8">
              <van-row justify="end" v-text="item.date"/>
            </van-col>
          </van-row>
        </template>
        <template #label>
          <van-row gutter="10" justify="start">
            {{ item.content }}
          </van-row>
          <van-row>
            {{ item.area }}
          </van-row>
          <van-row gutter="10" justify="end">
            <van-col span="10">
              {{ item.acAreaName }}
            </van-col>
            <van-col span="10">
              {{ item.address }}
            </van-col>
            <van-col span="4" style="text-align: right">
              {{ item.num }}/{{ item.limitNum }}
            </van-col>
          </van-row>
          <van-row gutter="10">
            <van-col span="10">
              {{ item.publisher }}
            </van-col>
            <van-col span="10">
              {{ item.email }}
            </van-col>
          </van-row>
        </template>
      </van-cell>
    </van-list>
  </van-pull-refresh>
  <tabbar/>
</template>

<script>
import {reactive} from 'vue';
import {
  ActionBar,
  ActionBarButton,
  ActionBarIcon,
  Cell,
  Checkbox,
  CheckboxGroup,
  Col,
  Dialog,
  DropdownItem,
  DropdownMenu,
  Field,
  List,
  PullRefresh,
  Row,
  Search,
  Tag,
  Toast
} from 'vant';
import Status from "@/components/activity/Status";
import netKit from "@/utils/netKit";
import Tabbar from "@/layout/tabbar";
import pageKit from "@/utils/pageKit";

export default {
  name: "admin",
  setup() {
    const state = reactive({
      params: {
        keyword: '',
      },
      list: [],
      pagination: {
        current: 1,
        pages: 0,
        size: 10
      },
      refreshing: false,
      loading: false,
      finished: false,
      updateSearchId: 0,
    })

    const activityClick = (e) => {
      Dialog.confirm({
        title: '确定要报名此活动吗？',
        message: e.title
      }).then(() => {
        netKit.post('/activity/signup', {data: e.id}).then(() => {
          Toast('报名成功');
          pageKit.fetchPage(state);
        });
      });
    }

    // 初始化加载
    const url = '/activity/list';
    pageKit.fetchPage(state, url);
    return {
      state,
      onSearch: (value) => {
        console.log('onsearch:', value);
        pageKit.onSearch(state, url, {keyword: value})
      },
      nextPage: () => pageKit.nextPage(state, url, {keyword: state.params.keyword}),
      onUpdateSearch: (value) => pageKit.onUpdateSearch(state, url, {keyword: value}),
      activityClick
    }
  },
  components: {
    [Tabbar.name]: Tabbar,
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
    [Status.name]: Status,
    [Field.name]: Field
  },
}

</script>

<style scoped>

.van-dropdown-menu >>> div {
  box-shadow: unset;
}

.van-checkbox >>> .van-checkbox__label {
  width: 100%;
}

</style>