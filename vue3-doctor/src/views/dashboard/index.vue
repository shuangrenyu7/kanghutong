<template>
  <div>
    <panelHeader :route="route"></panelHeader>
    <div class="container">
      <el-row :gutter="20">
        <el-col :span="12">
          <div style="background-color: #fff" class="text1 grid-content ep-bg-purple">
            <div class="img-style">
              <el-image :src="userInfo.user_img" style="width: 100px; height: 100px"></el-image>
              <span class="name-style"> {{ userInfo.user_name }}</span>
            </div>
            <div class="word1">当前权限：{{ userInfo.permission }}</div>
            <div class="word2">登录的ip：{{ userInfo.ip }}</div>
          </div>
        </el-col>

        <el-col :span="12">
          <div class="text2 grid-content ep-bg-purple component" style="background-color: #fff">
            <template v-if="types.length > 0">
              <div class="flex-div">
                <el-image class="icon-box red" :src="dzfImg"></el-image>
                <div class="detail-box">
                  <div class="num">{{ types[0].num }}</div>
                  <div class="txt">待支付</div>
                </div>
              </div>
              <div class="flex-div">
                <el-image class="icon-box purple" :src="dfwImg"></el-image>
                <div class="detail-box">
                  <div class="num">{{ types[1].num }}</div>
                  <div class="txt">待服务</div>
                </div>
              </div>
              <div class="flex-div">
                <el-image class="icon-box blue" :src="ywcImg"></el-image>
                <div class="detail-box">
                  <div class="num">{{ types[2].num }}</div>
                  <div class="txt">已完成</div>
                </div>
              </div>
              <div class="flex-div">
                <el-image class="icon-box green" :src="yqxImg"></el-image>
                <div class="detail-box">
                  <div class="num">{{ types[3].num }}</div>
                  <div class="txt">已取消</div>
                </div>
              </div>
            </template>
          </div>
        </el-col>
      </el-row>

      <div class="chart-box">
        <div ref="chartDom" style="width: 100%; height: 400px"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { report } from '@/api/index'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
// --- 【新增】引入 echarts ---
import * as echarts from 'echarts'

import dzfImg from '../../accest/dzf.png'
import dfwImg from '../../accest/dfw.png'
import ywcImg from '../../accest/ywc.png'
import yqxImg from '../../accest/yqx.png'

const route = useRoute()
const userInfo = ref({})
const types = ref([])
const typeList = ref([])

// --- 【新增】定义图表 DOM 的引用 ---
const chartDom = ref(null)

onMounted(() => {
  report().then((data) => {
    console.log(data.data)
    userInfo.value = data.data.data.user
    types.value = data.data.data.types
    typeList.value = data.data.data.typeList

    // --- 【新增】数据回来后，初始化图表 ---
    initChart()
  })
})

// --- 【新增】初始化图表的方法 ---
const initChart = () => {
  if (!chartDom.value) return // 如果DOM还没准备好，就不执行

  const myChart = echarts.init(chartDom.value)

  // 提取数据：把 typeList 里的 date 和 order_sum 拿出来变成数组
  const dateArr = typeList.value.map((item) => item.date)
  const valueArr = typeList.value.map((item) => item.order_sum)

  const option = {
    title: {
      text: '订单数',
      left: '20px',
      top: '15px',
      textStyle: { fontSize: 14, color: '#666' },
    },
    tooltip: { trigger: 'axis' },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dateArr, // 使用接口返回的日期
      axisLine: { lineStyle: { color: '#eee' } },
      axisLabel: { color: '#999' },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#eee' } },
      axisLabel: { color: '#999' },
      interval: 1,
    },
    series: [
      {
        name: '订单数',
        type: 'line',
        smooth: true, // 平滑曲线
        showSymbol: false,
        data: valueArr, // 使用接口返回的数值
        itemStyle: { color: '#85b6b2' }, // 线条颜色 (类似你截图的青色)
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(133, 182, 178, 0.5)' },
            { offset: 1, color: 'rgba(133, 182, 178, 0.01)' },
          ]),
        },
      },
    ],
  }

  myChart.setOption(option)

  // 窗口大小改变时自动调整图表大小
  window.addEventListener('resize', () => {
    myChart.resize()
  })
}
</script>

<style scoped lang="less">
.container {
  margin-top: 20px;
  width: 97%;

  .text1 {
    height: 205px;
    border-radius: 5px;
  }

  .text2 {
    height: 205px;
    border-radius: 5px;
  }
}

/* --- 【新增】图表容器样式 --- */
.chart-box {
  margin-top: 20px; /* 距离上面方块的间距 */
  background-color: #fff; /* 白色背景 */
  border-radius: 5px; /* 圆角 */
  padding: 10px;
  height: 400px; /* 容器高度 */
}

.img-style {
  display: flex;
  padding: 15px;
  border-bottom: 1px solid #f1eeee;
}

.name-style {
  align-self: center;
  font-weight: bold;
  font-size: large;
}

.word1 {
  font-size: small;
  padding: 13px 0 6px 18px;
  color: #625c5c;
}

.word2 {
  font-size: small;
  padding: 0 0 0 18px;
  color: #625c5c;
}

.component {
  display: flex;
  flex-wrap: wrap; /* 允许换行 */
  align-content: flex-start; /* 顶部对齐 */
  height: 100%; /* 占满父容器高度 */
  padding-top: 30px;
  box-sizing: border-box;
}

.flex-div {
  width: 50%; /* 每个占一半宽度，形成2x2布局 */
  height: 50%; /* 高度占一半 */
  display: flex; /* 开启Flex布局 */
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}

/* 图标样式 */
.icon-box {
  width: 45px;
  height: 45px;
  border-radius: 5px;
  padding: 5px;
  box-sizing: border-box;
}

/* 右侧文字区域样式 */
.detail-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
}

.num {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  line-height: 1.2;
}

.txt {
  font-size: 12px;
  color: #999;
}

/* 颜色样式 */
.red {
  background-color: rgb(236, 82, 82);
}
.purple {
  background-color: rgb(80, 59, 130);
}
.blue {
  background-color: #6dc6e1;
}
.green {
  background-color: rgb(148, 210, 56);
}
</style>
