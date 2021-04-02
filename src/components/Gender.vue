<template>
  <van-tag v-if="gender === 0" type="primary">男</van-tag>
  <van-tag v-else-if="gender === 1" color="pink">女</van-tag>
  <van-tag v-else type="warning">保密</van-tag>
</template>

<script>
import {Tag} from 'vant';

export default {
  name: "ac-gender",
  components: {
    [Tag.name]: Tag
  },
  props: {
    gender: Number
  }
}
</script>

<style scoped>

</style>