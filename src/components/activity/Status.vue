<template>
  <!-- 审核状态 -->
  <van-tag v-if="status === 1" type="success">通过</van-tag>
  <van-tag v-else-if="status === 2" type="danger">拒绝</van-tag>
  <van-tag v-else-if="status === 3" type="warning">已过期</van-tag>
  <van-tag v-else-if="status === 4" color="#66ccff" text-color="white">已完成</van-tag>
  <van-tag v-else-if="status === 5" color="#7232dd" text-color="white">进行中</van-tag>
  <van-tag v-else type="warning">未审核</van-tag>
</template>

<script>
import {Tag} from 'vant';

export default {
  name: "ac-status",
  props: {status: Number},
  components: {
    [Tag.name]: Tag
  }
}
</script>

<style scoped>

</style>