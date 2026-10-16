<template>
  <div class="container">
    <div class="header">
      <van-icon
        name="arrow-left"
        class="header-left"
        size="30"
        @click="goBack"
      />
      填写服务订单
    </div>
    <statusBar :item="0"></statusBar>
    <!-- 单元格 -->
    <van-cell class="cell">
      <template #title>
        <van-image
          wdith="25"
          height="25"
          :src="orderdetails.service.serviceImg"
        ></van-image>
        <span class="server-name">{{ orderdetails.service.serviceName }} </span>
      </template>
      <template #default>
        <div class="service-text">服务内容</div>
      </template>
    </van-cell>
    <!-- 需求分组 -->
    <van-cell-group class="cell">
      <!-- 医院名字 -->
      <van-cell is-link title="就诊医院">
        <template #default>
          <div @click="hospitalvisible = true">
            {{ createOrderData.hospital_name || "请选择就诊医院" }}
          </div>
        </template>
      </van-cell>
      <!-- 选择就诊时间 -->
      <van-cell title="就诊时间" is-link>
        <div @click="showTime = true">{{ datestr || "请选择就诊时间" }}</div>
      </van-cell>
      <van-cell title="陪诊师" is-link>
        <div @click="showPeople = true">
          {{ companion_name || "请选择陪护师" }}
        </div>
      </van-cell>
      <van-cell title="接送地址">
        <template #default>
          <van-field
            class="text"
            input-align="right"
            v-model="createOrderData.receiveAddress"
            placeholder="请填写就诊人地址"
          />
        </template>
      </van-cell>
      <van-cell title="联系电话">
        <template #default>
          <van-field
            class="text"
            input-align="right"
            v-model="createOrderData.tel"
            placeholder="请填写联系电话"
          />
        </template>
      </van-cell>
    </van-cell-group>
    <!-- 服务需求 -->
    <van-cell-group class="cell" title="服务需求">
      <van-field
        v-model="createOrderData.demand"
        rows="4"
        autosize
        type="textarea"
        placeholder="请简单描述您要就诊的科室..."
      />
    </van-cell-group>
    <van-button type="primary" @click="submit" class="sumbit" size="large"
      >提交订单</van-button
    >
    <!-- 医院名字弹出层 -->
    <van-popup
      v-model:show="hospitalvisible"
      position="bottom"
      :style="{ height: '30%' }"
    >
      <van-picker
        ref="picker"
        :columns="hospitalcolumns"
        @confirm="onConfirm()"
        @cancel="hospitalvisible = false"
      />
    </van-popup>
    <!-- 就诊时间弹出层 -->
    <van-popup
      v-model:show="showTime"
      position="bottom"
      :style="{ height: '30%' }"
    >
      <van-date-picker
        title="选择日期"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="timeConfirm"
        @cancel="showTime = false"
      />
    </van-popup>
    <!-- 陪护师弹出层 -->
    <van-popup
      v-model:show="showPeople"
      position="bottom"
      :style="{ height: '30%' }"
    >
      <van-picker
        ref="peoplepicker"
        :columns="peoplecolumns"
        @confirm="peopleConfirm"
        @cancel="showPeople = false"
      />
    </van-popup>
    <!-- 显示微信支付弹窗 -->、
    <van-dialog v-model:show="showpay" :show-confirm-button="false">
      <van-icon name="cross" class="close" @click="close" />
      <div>微信支付</div>
      <van-image :src="payimg" width="150px" height="150px"></van-image>
      <div>请使用本人微信扫描二维码</div>
    </van-dialog>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import statusBar from "../../components/statusBar.vue";
import { onMounted, ref, getCurrentInstance, computed } from "vue";
import dayjs from "dayjs";
import Qrcode from "qrcode";
const show = ref(false);
//创建订单接口所需要的数据
const createOrderData = ref({
  hospital_id: "",
  hospital_name: "",
  demand: "",
  companion_id: "",
  receiveAddress: "",
  tel: "",
  starttime: "",
});
//提交订单和微信支付页面
const showpay = ref(false);
const payimg = ref();
const submit = async () => {
  closeNotify();
  const prams = [
    "hospital_id",
    "hospital_name",
    "demand",
    "companion_id",
    "receiveAddress",
    "tel",
    "starttime",
  ];
  //校验是否为空
  for (const i of prams) {
    if (!createOrderData.value[i]) {
      showNotify({ type: "warning", message: "请填写每一项" });
      console.log(i + "有问题");
      return;
    }
  }
  const telReg = /^1[3-9]\d{9}$/;
  if (!telReg.test(createOrderData.value.tel)) {
    console.log("手机格式有问题");
    showNotify({ type: "warning", message: "手机号格式不正确" });
    return;
  }

  const { data } = await proxy.$api.createorder(createOrderData.value);

  Qrcode.toDataURL(data.data.wx_code).then((url) => {
    payimg.value = url;
    showpay.value = true;
  });
};
//关闭微信支付
const close = () => {
  showpay.value = false;
  router.push("/order");
};
//获取订单数据并且渲染页面
const { proxy } = getCurrentInstance();
const orderdetails = ref({
  companion: [],
  hospitals: [],
  service: {},
});
onMounted(async () => {
  const { data } = await proxy.$api.getorderdetails();
  Object.assign(orderdetails.value, data.data);
});
//点击回退标签
const router = useRouter();
const goBack = () => {
  router.go(-1);
};
//做一个医院名字弹出层
const hospitalvisible = ref(false);
//医院名字弹出层中的选择器
const hospitalcolumns = computed(() => {
  return orderdetails.value.hospitals.map((item) => {
    return { text: item.name, value: item.id };
  });
});
const picker = ref();
const onConfirm = () => {
  createOrderData.value.hospital_name =
    picker.value.getSelectedOptions()[0].text;
  createOrderData.value.hospital_id =
    picker.value.getSelectedOptions()[0].value;
  hospitalvisible.value = false;
};
//选择就诊时间
//
//
const showTime = ref(false);
const minDate = ref(new Date());
const now = new Date();
const maxDate = ref(new Date(now.setDate(now.getDate() + 365)));
const datestr = ref("");
const timeConfirm = (item) => {
  datestr.value = item.selectedValues.join("-");
  const datenum = dayjs(datestr.value).valueOf();
  createOrderData.value.starttime = datenum;
  showTime.value = false;
};
//选择陪护师
//
//
const showPeople = ref(false);
const peoplepicker = ref();
const peoplecolumns = computed(() => {
  return orderdetails.value.companion.map((item) => {
    return { text: item.name, value: item.id };
  });
});
const companion_name = ref("");
const peopleConfirm = () => {
  createOrderData.value.companion_id =
    peoplepicker.value.getSelectedOptions()[0].value;
  companion_name.value = peoplepicker.value.getSelectedOptions()[0].text;
  showPeople.value = false;
};
</script>
<style lang="less" scoped>
.container {
  background-color: #f0f0f0;
  height: 100vh;
}
.header {
  padding: 10px 0;
  text-align: center;
  line-height: 30px;
  font-size: 15px;
  .header-left {
    float: left;
  }
}

.cell {
  width: 95%;
  margin: 5px auto;
  background-color: #fff;
  ::v-deep(.van-field__control) {
    color: var(--van-cell-value-color);
  }
  ::v-deep(.van-cell__title) {
    display: flex;
    align-items: center;
  }
  .server-name {
    margin-left: 10px;
  }
}
.service-text {
  background: url(data:image/png;base64,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)
    no-repeat center center;
  background-size: 20px;
}
.sumbit {
  position: absolute;
  bottom: 0;
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
