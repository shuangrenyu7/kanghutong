<template>
  <div class="container">
    <div class="header">
      <van-icon
        name="arrow-left"
        class="header-left"
        size="30"
        @click="router.go(-1)"
      />
      订单详情
    </div>
    <statusBar :item="stateMap[detaildata.trade_state]"></statusBar>
    <div class="dzf" v-if="detaildata.trade_state === '待支付'">
      <div class="text1">订单待支付</div>
      <div class="text2">
        请在<counter :second="second" />内完成支付,超时订单自动取消
      </div>
      <div class="text3">
        <van-button type="success" @click="paybutton"
          >立即支付(0.1)元</van-button
        >
      </div>
    </div>
    <div class="dzf" v-if="detaildata.trade_state === '待服务'">
      <div class="text1">正在为您安排服务专员...</div>
      <div class="text2">请保持手机畅通，稍后将有服务专员与您联系</div>
    </div>
    <div class="dzf" v-if="detaildata.trade_state === '已完成'">
      <div class="text1">服务已完成...</div>
      <div class="text2">感谢您的使用，如有售后问题请联系客服</div>
    </div>
    <div class="dzf" v-if="detaildata.trade_state === '已取消'">
      <div class="text1">服务已取消</div>
      <div class="text2">期待下次为您服务,如需帮助可咨询客服</div>
    </div>
    <!-- 分组信息 -->
    <van-cell-group class="card">
      <div class="header-text">预约信息</div>

      <van-cell title="预约服务" :value="detaildata.service_name" />
      <van-cell title="就诊医院" :value="detaildata.hospital_name" />
      <van-cell title="期望就诊时间" :value="detaildata.starttime" />
      <van-cell title="就诊人" :value="myname" />
      <van-cell title="就诊人电话" :value="mymobile" />
      <van-cell title="接送地址" :value="detaildata.receiveAddress" />
      <van-cell title="其他需求" :value="detaildata.demand" />
    </van-cell-group>

    <van-cell-group class="card">
      <div class="header-text">订单信息</div>
      <van-cell title="联系电话" :value="detaildata.tel" />
      <van-cell title="下单时间" :value="starttime" />
      <van-cell title="应付金额" :value="detaildata.paidPrice" />
      <van-cell title="订单编号" :value="detaildata.out_trade_no" />
      <van-cell is-link title="联系客服" value="疑问或投诉" />
    </van-cell-group>
    <!-- 微信支付 -->
    <van-dialog v-model:show="showpay" :show-confirm-button="false">
      <van-icon name="cross" class="close" @click="close" />
      <div>微信支付</div>
      <van-image :src="payimg" width="150px" height="150px"></van-image>
      <div>请使用本人微信扫描二维码</div>
    </van-dialog>
  </div>
</template>
<script setup>
import { useRouter, useRoute } from "vue-router";
import counter from "../../components/counter.vue";
import Qrcode from "qrcode";
const router = useRouter();
const route = useRoute();
import { ref, getCurrentInstance, onMounted, computed } from "vue";
import dayjs from "dayjs";
const { proxy } = getCurrentInstance();
const detaildata = ref({});
//枚举状态
const stateMap = {
  待支付: 10,
  待服务: 20,
  已完成: 30,
  已取消: 40,
};
//就诊人和电话
const myname = ref("");
const mymobile = ref("");
//下单时间
const starttime = computed(() => {
  return dayjs(detaildata.order_start_time).format("YYYY年MM月DD日 HH:mm:ss");
});
//倒计时间
const second = computed(() => {
  return detaildata.value.order_start_time
    ? detaildata.value.order_start_time + 7200000 - Date.now()
    : 0;
});
//微信支付
const showpay = ref(false);
//微信支付支付码
const payimg = ref("");
//点击微信支付
const paybutton = () => {
  showpay.value = true;
};
const close = () => {
  showpay.value = false;
};
onMounted(async () => {
  const { data } = await proxy.$api.getorderdetail({ oid: route.query.oid });
  Qrcode.toDataURL(data.data.code_url).then((url) => {
    payimg.value = url;
  });
  myname.value = data.data.client.name;
  mymobile.value = data.data.client.mobile;
  detaildata.value = data.data;
  console.log(detaildata.value);
});
</script>

<style lang="less" scoped>
.xxx {
  margin-bottom: 15px;
}
.container {
  background-color: #f0f0f0;
  height: 100vh;
}
.header {
  background-color: #fff;
  line-height: 40px;
  text-align: center;
  .header-left {
    float: left;
  }
}
.card {
  margin: 15px 0;
  padding: 10px;
  .header-text {
    padding-left: 5px;
    line-height: 30px;
    font-size: 16px;
    font-weight: bold;
    border-left: 4px solid red;
  }
}
.dzf {
  padding: 20px;
  .text1 {
    font-size: 20px;
    font-weight: bold;
    line-height: 30px;
    color: #666;
  }
  .text2 {
    font-size: 14px;
    color: #666;
  }
  .text3 {
    text-align: center;
    .van-button {
      margin-top: 10px;
      margin-left: 10px;
      width: 80%;
      font-weight: bold;
    }
  }
}
::v-deep(.van-dialog__content) {
  text-align: center;
  padding: 20px;
  .close {
    position: absolute;
    left: 20px;
  }
}
</style>
