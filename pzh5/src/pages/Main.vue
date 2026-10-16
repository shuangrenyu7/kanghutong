<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const active = ref(0);
const data = ref([]);
onMounted(() => {
  data.value = router.options.routes[0].children;
  active.value = data.value.findIndex(
    (item) => router.path === "/" + item.path,
  );
});
</script>
<template>
  <RouterView></RouterView>
  <van-tabbar v-model="active">
    <van-tabbar-item
      v-for="item in data"
      :key="data.path"
      :icon="item.meta.icon"
      :url="`#${item.path}`"
      >{{ item.meta.name }}</van-tabbar-item
    >
  </van-tabbar>
</template>
