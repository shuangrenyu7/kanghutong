<script setup>
  import AsideMenu from '@/components/AsideMenu.vue';
  import navHeader from '@/components/navHeader.vue';
  import { usemeau } from '@/stores';
  const usemeaushili=usemeau()
</script>
<template>
  <div class="common-layout">
    <el-container>
      <el-aside :style="{width:usemeaushili.isCollapse?'64px':'230px'}">
        <AsideMenu></AsideMenu>
      </el-aside>
      <el-container>
        <el-header>
          <navHeader></navHeader>
        </el-header>
        <el-main>
          <RouterView></RouterView>
        </el-main>
      </el-container>
    </el-container>
  </div>
  <!-- <div class="common-layout">
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div> -->
</template>
<style lang="less" scoped>
.common-layout{
  height: 100%;
  .el-container{
    height: 100%;
  }
}
</style>

