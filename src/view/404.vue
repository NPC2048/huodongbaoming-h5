<template>
  <div>
    <van-row>i m 404</van-row>
    <van-row>页面找不到了~</van-row>
    <tabbar/>
  </div>
</template>

<script>
import tabbar from "@/layout/tabbar";
import {Row} from "vant";

export default {
  name: "404",
  components: {tabbar, [Row.name]: Row}
}
</script>

<style scoped>

</style>