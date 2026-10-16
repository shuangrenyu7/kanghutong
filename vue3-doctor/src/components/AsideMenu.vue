<template>
  <el-menu
    :collapse="usemeaushili.isCollapse"
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="el-menu-vertical-demo"
    id="meau"
    :default-active="usemeaushili.meauactive"
    text-color="#fff"
  >
    <p class="logo-lg">{{ usemeaushili.isCollapse === false ? 'DIDI问诊' : 'DIDI' }}</p>
    <MenuTree :menudata="usemeaushili.newroute" :index="1"></MenuTree>
  </el-menu>
</template>
<script setup>
import MenuTree from './MenuTree.vue'
import { usemeau } from '@/stores'
const usemeaushili = usemeau()
</script>
<style lang="less" scoped>
.el-menu-vertical-demo {
  height: 100%;
  .logo-lg {
    color: #fff;
    text-align: center;
    font-size: 20px;
    height: 50px;
  }
}
</style>
