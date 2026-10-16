<template>
  <div class="container">
    <div class="header">我的订单</div>
    <van-tabs v-model:active="active" @click-tab="onClickTab">
      <van-tab title="全部" name=""></van-tab>
      <van-tab title="待支付" name="1"></van-tab>
      <van-tab title="待服务" name="2"></van-tab>
      <van-tab title="已完成" name="3"></van-tab>
      <van-tab title="已取消" name="4"></van-tab>
    </van-tabs>
    <van-row
      @click="router.push(`/detail?oid=${item.out_trade_no}`)"
      v-for="(item, index) in listdata"
      :key="index"
    >
      <van-col span="5">
        <van-image
          :src="item.serviceImg"
          height="50px"
          width="50px"
          radius="5"
        ></van-image
      ></van-col>
      <van-col span="14">
        <div class="text1">{{ item.service_name }}</div>
        <div class="text2">
          <div>{{ item.hospital_name }}</div>
          <div>预约时间{{ item.starttime }}</div>
        </div>
      </van-col>
      <van-col
        class="text2"
        :style="{ color: statecolor[item.trade_state] }"
        span="5"
      >
        <div>
          {{ item.trade_state }}
        </div>
        <counter
          :second="item.timer"
          v-if="item.trade_state === '待支付'"
        ></counter>
      </van-col>
    </van-row>
    <div class="bottom-text">没有更多了</div>
  </div>
</template>
<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import counter from "../../components/counter.vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const { proxy } = getCurrentInstance();
const active = ref("");
const listdata = ref([]);
const statecolor = {
  待支付: "#ffa200",
  待服务: "#1da6fd",
  已完成: "#21c521",
};
onMounted(() => {
  const id = route.query.active || "";
  active.value = id;
  getdata(id);
});
const onClickTab = ({ name }) => {
  getdata(name);
};
const getdata = async (name) => {
  const { data } = await proxy.$api.getorderlist({ state: String(name) });

  data.data.forEach((item) => {
    item.timer = item.order_start_time + 7200000 - Date.now();
  });
  listdata.value = data.data;
};
</script>
<style lang="less" scoped>
.container {
  background-color: #f0f0f0;
  height: 100vh;
}
.header {
  background-color: #fff;
  line-height: 40px;
  text-align: center;
}
.van-row {
  background-color: #fff;
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  .text1 {
    font-size: 16px;
    line-height: 25px;
    font-weight: bold;
  }
  .text2 {
    font-size: 14px;
    line-height: 20px;
    color: #999999;
  }
}
.bottom-text {
  line-height: 50px;
  text-align: center;
  color: #999999;
}
</style>
