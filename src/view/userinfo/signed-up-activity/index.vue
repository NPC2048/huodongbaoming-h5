<template>
  <!-- 已报名活动列表 -->
  <!-- 显示已经报名的活动, 生效中的活动排在最前面，其余的按活动时间、报名时间倒序排序 -->
  <van-nav-bar title="已报名的活动" left-arrow @click-left="back"/>
  <van-tabs v-model:active="state.activeName" animated>
    <van-tab v-for="item in state.tabs" :title="item.title" :name="item.name" :key="item.title">
      <ac-activity-list :status="item.status" url="/activity/my-signed-up"/>
    </van-tab>
  </van-tabs>
</template>
<script>
import {reactive} from "vue";
import {router} from "@/router";
import {Cell, Collapse, CollapseItem, List, NavBar, PullRefresh, Tab, Tabs} from "vant";
import {ACTIVITY_STATUS_TABS} from "@/utils/global";
import Status from "@/components/activity/Status";
import ActivityList from "@/components/activity/ActivityList";
import AcActivityList from "@/components/activity/ActivityList";

export default {
  name: 'signed-up',
  setup() {
    const state = reactive({
      activeName: 'all',
      tabs: ACTIVITY_STATUS_TABS
    });
    return {
      state,
      back: () => router.back()
    }
  },
  components: {
    AcActivityList,
    [ActivityList.name]: ActivityList,
    [NavBar.name]: NavBar,
    [Cell.name]: Cell,
    [NavBar.name]: NavBar,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [Status.name]: Status,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
    [Tabs.name]: Tabs,
    [Tab.name]: Tab
  }
}
</script>
<style scoped>

</style>