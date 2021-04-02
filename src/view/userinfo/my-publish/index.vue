<template>
  <!-- 上一页 -->
  <van-nav-bar title="我发布的活动" left-arrow @click-left="back"/>
  <!-- 页签 -->
  <van-tabs v-model:active="state.activeName" animated>
    <van-tab v-for="item in state.tabs" :title="item.title" :name="item.name" :key="item.title">
      <ac-activity-list :status="item.status" url="/activity/my-publish"/>
    </van-tab>
  </van-tabs>
</template>

<script>
import {Cell, Collapse, CollapseItem, List, NavBar, PullRefresh, Tab, Tabs} from "vant";
import Status from "@/components/activity/Status";
import {reactive} from "vue";
import {router} from "@/router";
import {ACTIVITY_STATUS_TABS} from "@/utils/global";
import ActivityList from "@/components/activity/ActivityList";

export default {
  name: "myPublish",
  setup() {
    const state = reactive({
      activeName: 'all',
      tabs: ACTIVITY_STATUS_TABS
    })
    return {
      state,
      back: () => router.back()
    }
  },
  components: {
    [ActivityList.name]: ActivityList,
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