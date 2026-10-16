<template>
  <div class="container">
    <div class="user">
      <van-image
        class="img"
        :src="userdata.avatar"
        width="100px "
        height="100px"
      ></van-image>
      <div class="text">{{ userdata.name }}</div>
    </div>
    <!-- 中部 -->
    <div class="order">
      <div class="top">
        <div class="text1">我的订单</div>
        <div class="text2" @click="getOrder()">全部</div>
      </div>
      <div class="buttom">
        <div class="item" @click="getOrder(1)">
          <van-image src="/images/od_10.png" width="40" height="40"></van-image>
          <div>待支付</div>
        </div>
        <div class="item" @click="getOrder(2)">
          <van-image src="/images/od_20.png" width="40" height="40"></van-image>
          <div>待服务</div>
        </div>
        <div class="item" @click="getOrder(3)">
          <van-image src="/images/od_30.png" width="40" height="40"></van-image>
          <div>已完成</div>
        </div>
        <div class="item" @click="getOrder(4)">
          <van-image src="/images/od_40.png" width="40" height="40"></van-image>
          <div>已取消</div>
        </div>
      </div>
    </div>
    <!-- 底部 -->
    <div class="foot">
      <div class="foot1">
        <div class="text1">
          <van-image
            width="20px"
            height="20px"
            src="/images/ic_clients.png"
          ></van-image>
          服务对象管理
        </div>
        <div class="text2"><van-icon name="arrow" /></div>
      </div>
      <div class="foot2">
        <div class="text1">
          <van-image
            width="20px"
            height="20px"
            src="/images/ic_share.png"
          ></van-image>
          分享转发
        </div>
        <div class="text2"><van-icon name="arrow" /></div>
      </div>
    </div>
    <van-button type="danger" class="quit" @click="show = true" size="large"
      >退出登录</van-button
    >
    <van-dialog
      v-model:show="show"
      @cancel="show = false"
      @confirm="over"
      title="提示 "
      show-cancel-button
    >
      <div class="quit_text">是否确认退出登录</div>
    </van-dialog>
  </div>
</template>
<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const userdata = computed(() => {
  return JSON.parse(localStorage.getItem("h5_userInfo")) || {};
});
const getOrder = (item) => {
  router.push(`/order?active=${item}`);
};
const show = ref(false);
const over = () => {
  localStorage.removeItem("h5_userInfo");
  localStorage.removeItem("h5_token");
  router.push("/login");
};
</script>
<style lang="less" scoped>
.container {
  background-color: #f0f0f0;
  height: 100vh;
  overflow: hidden;
  .user {
    width: 95%;
    height: 200px;
    background-color: #fff;
    text-align: center;
    border-radius: 10px;
    margin: 10px;
    .img {
      margin-top: 30px;
    }
    .text {
      line-height: 30px;
      font-weight: bold;
    }
  }
  .order {
    width: 90%;
    margin: 10px;
    border-radius: 5px;
    background-color: #fff;
    padding: 10px;
    .top {
      margin: 10px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      .text1 {
        color: #333;
      }
      .text2 {
        color: #999;
      }
      border-bottom: 0.5px solid #f5f5f5;
    }
    .buttom {
      padding: 10px;
      display: flex;
      justify-content: space-around;
      .item {
        font-size: 14px;
        color: #999;
      }
    }
  }
  .foot {
    margin: 0 10px;
    padding: 10px;
    line-height: 50px;
    background-color: #fff;
    .foot1,
    .foot2 {
      display: flex;
      justify-content: space-between;
      color: #555;
    }
    .foot1 {
      border-bottom: 0.5px solid #f5f5f5;
    }
  }
  .quit {
    width: 90%;
    margin: 20px;
  }
  .quit_text {
    margin: 20px 0;
    text-align: center;
  }
}
</style>
