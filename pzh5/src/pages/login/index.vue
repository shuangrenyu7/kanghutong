<template>
  <div>
    <h1>用户登录</h1>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="formdata.userName"
          name="username"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="formdata.passWord"
          name="password"
          type="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <div class="btn">
        <van-button type="primary" block round native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
import { ref, getCurrentInstance } from "vue";
//通过vue方法getCurrentInstance解构出vue实例proxy，在进行调用里面的属性方法
const { proxy } = getCurrentInstance();
//表单登录数据
const formdata = ref({
  userName: "",
  passWord: "",
});
const onSubmit = async () => {
  const { data } = await proxy.$api.login(formdata.value);
  if (data.code === 10000) {
    localStorage.setItem("h5_token", data.data.token);
    localStorage.setItem("h5_userInfo", JSON.stringify(data.data.userInfo));
    showSuccessToast("登录成功");
    router.push("/home");
  } else {
    showFailToast(data.message);
  }
};
</script>
<style lang="less" scoped>
h1 {
  text-align: center;
}
.btn {
  margin: 16px;
}
</style>
