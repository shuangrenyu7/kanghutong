<template>
  <el-row class="login-container" justify="center" :align="'middle'">
    <el-card style="max-width: 480px">
      <template #header>
        <div class="card-header">
          <img :src="url" alt="" />
        </div>
      </template>
      <div class="jump-link">
        <el-link type="primary" @click="improvestata">{{
          stateswitching ? '注册账号' : '返回登录'
        }}</el-link>
      </div>
      <div>
        <el-form :model="userdata" :rules="rules" ref="formvail">
          <el-form-item prop="username">
            <el-input placeholder="手机号" prefix-icon="Avatar" v-model="userdata.username" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input placeholder="密码" prefix-icon="Lock" v-model="userdata.password" />
          </el-form-item>
          <el-button v-if="stateswitching" type="primary" style="width: 100%" @click="userlogin"
            >登录</el-button
          >
          <div v-else>
            <el-form-item>
              <el-input placeholder="验证码" prefix-icon="Lock" v-model="userdata.valicode">
                <template #append>
                  <el-button @click="getvailcode">{{ vail.codetext }}</el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-button type="primary" style="width: 100%" @click="userlogin">注册账号</el-button>
          </div>
        </el-form>
      </div>
    </el-card>
  </el-row>
</template>
<script setup>
import { ref } from 'vue'
import { getcode, userAuthentication, Login, getmUserMeauPermissionData } from '@/api/index'
import router from '@/router'
import { usemeau } from '@/stores'
const usemeauInstance = usemeau()
const url = new URL('@/accest/login-head.png', import.meta.url).href
const stateswitching = ref(true)
const formvail = ref()
const rules = {
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { pattern: /^\d{6,10}$/, message: '请输入6到10位的密码', trigger: 'blur' },
  ],
  username: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    {
      pattern: /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
      message: '请输入正确的手机号',
      trigger: 'blur',
    },
  ],
}

const userdata = ref({
  username: '',
  password: '',
  valicode: '',
})
const vail = ref({
  codetext: '获取验证码',
  codetime: 60,
})
let state = false
let timer = null
const improvestata = () => {
  stateswitching.value = !stateswitching.value
}
const getvailcode = async () => {
  if (state) return
  await formvail.value.validate()
  if (timer) {
    clearInterval(timer)
  }
  timer = setInterval(() => {
    if (vail.value.codetime <= 0) {
      vail.value.codetext = '重新获取验证码'
      vail.value.codetime = 60
      state = false
      clearInterval(timer)
      timer = null
    } else {
      vail.value.codetime--
      vail.value.codetext = `剩余${vail.value.codetime}秒`
    }
  }, 1000)
  getcode({ tel: userdata.value.username }).then(({ data }) => {
    if (data.code === 10000) {
      ElMessage.success('发送成功')
    }
  })
  state = true
}
const userlogin = () => {
  const requestData = {
    userName: userdata.value.username,
    passWord: userdata.value.password,
    validCode: userdata.value.valicode,
  }
  if (!stateswitching.value) {
    userAuthentication(requestData).then(({ data }) => {
      if (data.code === 10000) {
        ElMessage.success('注册成功，请进行登录')
        stateswitching.value = !stateswitching.value
      }
    })
  } else {
    Login(requestData).then(({ data }) => {
      if (data.code === 10000) {
        ElMessage.success('登录成功')
        localStorage.setItem('pz_token', data.data.token)
        localStorage.setItem('pz_userInfo', JSON.stringify(data.data.userInfo))
        usemeauInstance.setUserInfo(data.data.userInfo)
        getmUserMeauPermissionData().then(({ data }) => {
          usemeauInstance.handlemeau(data.data)

          //让登录时自动添加路由
          usemeauInstance.newroute.forEach((item) => {
            router.addRoute('main', item)
          })
          router.push('/')
        })
      }
    })
  }
}
</script>
<style lang="less" scoped>
:deep(.el-card__header) {
  padding: 0;
}
.login-container {
  height: 100%;
  .card-header {
    background-color: #899fe1;
    img {
      width: 430px;
    }
  }
  .jump-link {
    text-align: right;
    margin-bottom: 10px;
  }
}
</style>
