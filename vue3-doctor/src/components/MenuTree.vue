<template>
  <template v-for="(item, index) in props.menudata" :key="`${props.index}-${index}`">
    <el-menu-item
      @click="handleclick(item, `${props.index}-${item.meta.id}`)"
      v-if="!item.children || item.children.length === 0"
      :index="`${props.index}-${item.meta.id}`"
    >
      <!-- 这里面的index就是图标的下横号，用来打开下拉菜单，所以index如果一样，那么将会导致点开一个下拉菜单，所有下拉菜单都会打开 -->
      <el-icon size="20">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span>{{ item.meta.name }}</span>
    </el-menu-item>

    <el-sub-menu v-else :index="`${props.index}-${item.meta.id}`">
      <template #title>
        <el-icon size="20">
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.name }}</span>
      </template>
      <menu-tree :menudata="item.children" :index="`${props.index}-${item.meta.id}`"></menu-tree>
    </el-sub-menu>
  </template>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { usemeau } from '@/stores'
const usemeaushili = usemeau()
const props = defineProps(['menudata', 'index'])
const router = useRouter()
const handleclick = (item, data) => {
  usemeaushili.getselectmeau(item)
  usemeaushili.handleactive(data)
  router.push(item.meta.path)
}
</script>
