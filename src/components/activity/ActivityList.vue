<template>
  <!-- 我发布的活动列表组件 -->
  <van-pull-refresh v-model="state.refreshing" @refresh="onSearch">
    <van-list class="van-list"
              v-model:loading="state.loading"
              :finished="state.finished"
              finished-text="没有更多了"
              @load="nextPage"
              :offset="300"
              :immediate-check="false"
    >
      <van-collapse v-model="state.activeName">
        <van-collapse-item v-for="item in state.list" :title="item.title" :key="item.id">
          <template #value>
            <ac-status :status="item.status"/>
          </template>
          <template #default>
            <van-field label="描述" readonly :model-value="item.content"/>
            <van-field label="地区" readonly :model-value="item.acAreaName"/>
            <van-field label="详细地址" readonly :model-value="item.address"/>
            <van-field label="活动日期" readonly :model-value="item.date"/>
            <van-field label="人数统计" readonly :model-value="`${item.num}/${item.limitNum}`"/>
            <van-field label="发布人" readonly :model-value="item.publisher"/>
            <van-field label="联系邮箱" readonly :model-value="item.email"/>
            <van-divider>报名用户</van-divider>
            <van-row v-if="item.listUser.length < 1" justify="center">没有报名用户</van-row>
            <van-cell v-else v-for="peo in item.listUser" :key="peo.id">
              <template #title>
                <van-field label="用户名" readonly :model-value="peo.name"/>
                <van-field label="联系邮箱" readonly :model-value="peo.email"/>
              </template>
            </van-cell>
          </template>
        </van-collapse-item>
      </van-collapse>
    </van-list>
  </van-pull-refresh>
</template>

<script>
import {Cell, Col, Collapse, CollapseItem, Field, List, PullRefresh, Row, Tab, Tabs, Divider} from "vant";
import Status from "@/components/activity/Status";
import AcStatus from "@/components/activity/Status";
import {reactive, ref} from "vue";
import {baseState, nextPage, onSearch, onUpdateSearch} from "@/utils/pageKit";
import netKit from "@/utils/netKit";

export default {
  name: "ac-activity-list",
  props: ['status', 'url'],
  setup(props) {
    const state = reactive({
      ...baseState,
      params: {
        keyword: '',
        status: ''
      },
      peopleListShow: ref(false),
      peopleList: {},
      activeName: ref(['1'])
    })
    onSearch(state, props.url, {status: props.status});
    // 报名人信息
    const peopleInfo = (id) => {
      // 打开
      netKit.post('/activity/list-user', {data: id}).then(data => {
        state.peopleList[id] = data;
        // 打开 dialog
        state.peopleListShow = true;
      });
    }
    return {
      state,
      peopleInfo,
      onSearch: (value) => onSearch(state, props.url, {keyword: value, status: props.status}),
      nextPage: () => nextPage(state, props.url, {keyword: state.params.keyword, status: props.status}),
      onUpdateSearch: (value) => onUpdateSearch(state, props.url, {keyword: value, status: props.status}),
    }
  },
  components: {
    AcStatus,
    [Row.name]: Row,
    [Col.name]: Col,
    [Cell.name]: Cell,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [Status.name]: Status,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [Field.name]: Field,
    [Divider.name]: Divider
  }
}
</script>

<style scoped>

</style>