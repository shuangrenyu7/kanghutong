<template>
  <div>
    <panelHeader :route="route"></panelHeader>
    <div class="btns">
      <el-input v-model="selectorder" style="width: 200px" placeholder="订单号" />
      <el-button class="btnleft" @click="selectorderdata" type="primary">查询</el-button>
      <el-button class="btnleft" @click="reset" type="primary">全部订单</el-button>
    </div>
    <el-table :data="tabledata">
      <el-table-column width="130" prop="out_trade_no" label="订单号"></el-table-column>
      <el-table-column prop="hospital_name" label="就诊医院"></el-table-column>
      <el-table-column prop="service_name" label="陪诊服务"></el-table-column>
      <el-table-column prop="companion.avatar" label="陪护师">
        <template #default="scope">
          <el-avatar
            :src="scope.row.companion.avatar"
            radius="5"
            style="width: 60px; height: 60px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="companion.mobile" label="陪护师手机号"></el-table-column>
      <el-table-column width="70" prop="price" label="总价"></el-table-column>
      <el-table-column width="70" prop="paidPrice" label="已付"></el-table-column>
      <el-table-column prop="order_start_time" label="下单时间"></el-table-column>
      <el-table-column prop="trade_state" label="订单状态">
        <template #default="scope">
          <el-tag v-if="scope.row.trade_state === '待服务'" type="primary">{{
            scope.row.trade_state
          }}</el-tag>
          <el-tag v-else type="info">{{ scope.row.trade_state }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="service_state" label="接单状态"></el-table-column>
      <el-table-column prop="tel" label="联系人手机号"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-popconfirm
            v-if="scope.row.trade_state === '待服务'"
            confirm-button-text="是"
            cancel-button-text="否"
            :icon="InfoFilled"
            icon-color="#626AEF"
            title="请再次确认服务完成了吗?"
            @confirm="confirmEvent(scope.row)"
          >
            <template #reference>
              <el-button type="primary" link>确认服务完成</el-button>
            </template>
          </el-popconfirm>
          <el-button v-else type="primary" disabled link>暂无服务</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="!selectorder || total !== 1"
      v-model:currentPage="page.pageNum"
      :page-size="page.pageSize"
      :page-sizes="[2, 3, 4, 5]"
      size="small"
      :total="total || 0"
      layout="total,sizes, prev, pager, next"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { getorderlistdata, updatastate } from '@/api/index'
import { useRoute } from 'vue-router'
import { InfoFilled } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
const selectorder = ref('')
const selectorderdata = () => {
  getorderlistdata({
    pageNum: page.value.pageNum,
    pageSize: page.value.pageSize,
    out_trade_no: selectorder.value,
  }).then(({ data }) => {
    data.data.list.forEach((item) => {
      item.order_start_time = dayjs(item.order_start_time).format('YYYY年MM月DD日 HH:mm:ss')
    })
    tabledata.value = data.data.list
    total.value = data.data.total
  })
}
const reset = () => {
  selectorder.value = ''
  getorderlistdata({
    pageNum: page.value.pageNum,
    pageSize: page.value.pageSize,
    out_trade_no: selectorder.value,
  }).then(({ data }) => {
    data.data.list.forEach((item) => {
      item.order_start_time = dayjs(item.order_start_time).format('YYYY年MM月DD日 HH:mm:ss')
    })
    tabledata.value = data.data.list
    total.value = data.data.total
  })
}
const route = useRoute()
const page = ref({
  pageNum: 1,
  pageSize: 5,
})
const tabledata = ref([])
const total = ref()
onMounted(() => {
  getdatalist()
})
const getdatalist = () => {
  getorderlistdata(page.value).then(({ data }) => {
    data.data.list.forEach((item) => {
      item.order_start_time = dayjs(item.order_start_time).format('YYYY年MM月DD日 HH:mm:ss')
    })
    tabledata.value = data.data.list
    total.value = data.data.total
  })
}
//改变服务状态
const confirmEvent = (row) => {
  updatastate({ id: row.out_trade_no }).then(() => {
    getdatalist()
  })
}
const handleSizeChange = (num) => {
  page.value.pageSize = num
  getdatalist()
}
const handleCurrentChange = (num) => {
  page.value.pageNum = num
  getdatalist()
}
</script>
<style lang="less" scoped>
.btns {
  padding: 10px 10px 10px 980px;
  background-color: #fff;
  .btnleft {
    margin-left: 30px;
  }
}
</style>
