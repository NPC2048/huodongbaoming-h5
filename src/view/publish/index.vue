<template>
  <van-nav-bar title="发布活动"/>
  <van-form ref="form" style="margin-top: 0" @submit="onSubmit">
    <!-- 标题 -->
    <van-field
        required v-model="state.title"
        autocomplete="off"
        name="title" label="标题" placeholder="请输入标题"
        :rules="[{required: true, message: '请输入标题'}]"
    />
    <!-- 内容 -->
    <van-field
        required autosize
        v-model="state.content"
        autocomplete="off"
        name="content" label="描述" placeholder="活动描述"
        type="textarea" rows="2" maxlength="255" show-word-limit
        :rules="[{required: true, message: '请输入描述'}]"
    />
    <!-- 活动人数 -->
    <van-field name="limitNum" label="活动人数">
      <template #input>
        <van-stepper v-model="state.limit"/>
      </template>
    </van-field>
    <!-- 地区 -->
    <van-field
        v-model="state.acArea" clickable required
        name="acAreaName" placeholder="选择活动地区" label="地区"
        autocomplete="off"
        @click="state.showAddress = true"
        :rules="[{required: true, message: '请选择活动地区'}]"
    />
    <!-- 地区编码，不显示 -->
    <van-field type="hidden" v-model="state.acAreaCode" name="acAreaCode"/>
    <!-- 详细地址 -->
    <van-field
        required
        v-model="state.address"
        autocomplete="off"
        name="address" placeholder="请输入详细地址" label="详细地址"
        type="textarea" rows="2" maxlength="255" show-word-limit
        :rules="[{required: true, message: '请输入详细地址'}]"
    />
    <van-popup v-model:show="state.showAddress" position="bottom">
      <van-area
          title="活动地址" :area-list="state.area"
          @confirm="onAreaConfirm"
          @cancel="state.showAddress = false"
      />
    </van-popup>
    <!-- 日期 -->
    <van-field
        v-model="state.date"
        required readonly clickable
        name="date" label="活动日期" placeholder="请选择活动日期"
        @click="state.showDatePicker = true"
        :rules="[{required: true, message: '请选择活动日期'},
         {validator: (value, rule) => validDate(value, rule), message: '日期必须大于当前时间且不能为今天'}]"
    />
    <van-popup v-model:show="state.showDatePicker" position="bottom">
      <van-datetime-picker
          type="datetime"
          :min-date="minDate"
          @confirm="onDatetimePicker"
          @cancel="state.showDatePicker = false"
      />
    </van-popup>
    <van-button round block type="primary" native-type="submit" :loading="state.submitLoading">提交审核</van-button>
  </van-form>
  <tabbar/>
</template>

<script>
import {reactive} from 'vue';
import {Area, Button, DatetimePicker, Field, Form, NavBar, Picker, Popup, Stepper, Toast} from 'vant';
import area from "@/assets/area";
import moment from "moment";
import axios from "axios";
import Tabbar from "@/layout/tabbar";
import {router} from "@/router";

export default {
  name: "publish",
  components: {
    Tabbar,
    [Form.name]: Form,
    [Area.name]: Area,
    [Field.name]: Field,
    [Stepper.name]: Stepper,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    [DatetimePicker.name]: DatetimePicker,
    [Button.name]: Button,
    [NavBar.name]: NavBar
  },
  setup() {
    const state = reactive({
      title: '',
      content: '',
      limit: 0,
      acArea: '',
      acAreaCode: '',
      address: '',
      date: '',
      showDatePicker: false,
      showAddress: false,
      area,
      submitLoading: false
    })

    // 地区选择
    const onAreaConfirm = (value) => {
      // Toast(JSON.stringify(value))
      state.acArea = value.map(item => item.name).toString().replaceAll(',', ' ');
      state.acAreaCode = value.map(item => item.code).toString();
      state.showAddress = false;
    }

    // 日期选择
    const onDatetimePicker = (value) => {
      // 年月日时分
      state.date = moment(value).format('YYYY-MM-DD HH:mm');
      state.showDatePicker = false;
    }

    // 日期校验
    const validDate = (value) => {
      // 如果无值则通过，交给 required 规则校验
      if (!value) {
        return true;
      }
      value = new Date(value);
      const now = new Date();
      // 日期不能小于当前时间
      if (value.getTime() < now.getTime()) {
        return false;
      }
      // 日期不能为今天;
      return !(value.getFullYear() === now.getFullYear()
          && value.getMonth() === now.getMonth()
          && value.getDate() === now.getDate());
    }

    return {
      state,
      onAreaConfirm,
      onDatetimePicker,
      validDate,
      minDate: moment(moment(new Date()).format('YYYY-MM-DD')).add(1, 'days').toDate()
    }
  },
  methods: {
    onSubmit(values) {
      Toast('活动提交中...');
      this.state.submitLoading = true;
      axios.post('/activity/publish', values).then(data => {
        console.log(data);
        Toast('活动提交成功');
        // 重置表单
        // router.replace({name: 'myPublish'})
        router.replace({name: 'homepage'})
      }).finally(() => {
        this.state.submitLoading = false;
      });
    }
  }
}
</script>

<style scoped>
</style>