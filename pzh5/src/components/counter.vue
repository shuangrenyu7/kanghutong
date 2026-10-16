<template>
  <div class="counter-text">{{ durationText }}</div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";

const props = defineProps({
  second: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["counterOver"]);

// 内部维护的剩余时间（毫秒）
const remaining = ref(0);
let timer = null;

// 将毫秒转换为 hh:mm:ss 格式
const durationText = computed(() => {
  if (remaining.value <= 0) return "00:00:00";

  const time = remaining.value;
  const h = Math.floor((time / 1000 / 60 / 60) % 24);
  const m = Math.floor((time / 1000 / 60) % 60);
  const s = Math.floor((time / 1000) % 60);

  // 补零函数
  const format = (val) => (val < 10 ? "0" + val : val);
  return `${format(h)}:${format(m)}:${format(s)}`;
});

const startTimer = () => {
  // 清除旧定时器防止重叠
  stopTimer();

  // 初始赋值
  remaining.value = props.second;

  // 如果初始时间已经结束
  if (remaining.value <= 0) {
    emit("counterOver");
    return;
  }

  timer = setInterval(() => {
    remaining.value -= 1000;

    if (remaining.value <= 0) {
      remaining.value = 0;
      stopTimer();
      emit("counterOver");
    }
  }, 1000);
};

const stopTimer = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

// 监听 props 变化，确保数据更新时倒计时重置
watch(
  () => props.second,
  () => {
    startTimer();
  },
);

onMounted(() => {
  startTimer();
});

// 组件卸载时必须清除定时器！！
onUnmounted(() => {
  stopTimer();
});
</script>

<style scoped>
.counter-text {
  /* 可以在这里加样式，或者保持默认 */
  display: inline-block;
}
</style>
