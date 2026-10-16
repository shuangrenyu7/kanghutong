<template>
  <div>
    <panelHeader :route="route"></panelHeader>
    <el-table :data="tabledata.list" width="100%">
      <el-table-column prop="id" label="id"> </el-table-column>
      <el-table-column prop="name" label="昵称"></el-table-column>
      <el-table-column label="所属类别">
        <template #default="scope">
          {{ getClassById(scope.row.permissions_id) }}
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号"></el-table-column>
      <el-table-column prop="active" label="状态">
        <template #default="scope">
          <el-tag v-if="scope.row.active === 1" type="success" effect="plain"> 正常 </el-tag>
          <el-tag v-else type="danger" effect="plain">异常</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间">
        <template #default="scope">
          <div class="flex-box">
            <el-icon><Clock /></el-icon>
            <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope"
          ><el-button @click="handle(scope.row)" type="primary">编辑</el-button></template
        >
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-info">
      <el-pagination
        v-model:currentPage="page.pageNum"
        :page-size="page.pageSize"
        size="small"
        :total="tabledata.total || 0"
        :page-sizes="[2, 3, 4, 5]"
        layout="total,sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog v-model="dialogvisable" title="编辑用户">
      <el-form
        :model="formvalue"
        ref="formRef"
        :rules="rules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="formvalue.mobile" disabled></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="name">
          <el-input v-model="formvalue.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单权限" prop="selectvalue">
          <el-select v-model="formvalue.selectvalue" style="width: 240px">
            <el-option
              v-for="item in selecteddata"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer><el-button type="primary" @click="confirm">确认</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { authAdminList, getAdminmeauselected, userDataUpdate } from '@/api/index'
import { onMounted, ref } from 'vue'
import { getmUserMeauPermissionData } from '@/api/index'
import { Clock } from '@element-plus/icons-vue'
import router from '@/router'
import dayjs from 'dayjs'
import { usemeau } from '@/stores'
import { useRoute } from 'vue-router'
const route = useRoute()
const usemeauInstance = usemeau()

//分页
const page = ref({
  pageNum: 1,
  pageSize: 3,
})
//弹窗显示控制
const dialogvisable = ref(false)
//弹窗表单校验规则
const rules = {
  name: [{ required: true, trigger: 'blur', message: '请输入昵称' }],
  selectvalue: [{ required: true, trigger: 'blur', message: '请输入昵称' }],
}
//下拉菜单权限数据
const selecteddata = ref([])
//弹窗里的表单
const formRef = ref()
const formvalue = ref({
  mobile: '',
  name: '',
  selectvalue: '',
})
const tabledata = ref({
  list: [],
  total: '',
})

//钩子生命函数中的获取初始table表格数据
const gettabledatalist = () => {
  authAdminList(page.value).then(({ data }) => {
    data.data.list.forEach((item) => {
      item.create_time = dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss')
    })
    tabledata.value.list = data.data.list
    tabledata.value.total = data.data.total
    formvalue.value.mobile = tabledata.value.list[0].mobile
    formvalue.value.name = tabledata.value.list[0].name
  })
}
//钩子生命函数
onMounted(() => {
  //将账号管理数据获取并且赋值给表格数据
  gettabledatalist()
  //获取所属类别id对应的类别名称
  getAdminmeauselected().then(({ data }) => {
    selecteddata.value = data.data
  })
})
//处理编辑函数
const handle = (rowdata) => {
  dialogvisable.value = true
  formvalue.value.selectvalue = getClassById(rowdata.permissions_id)
}
//确认函数
const confirm = async () => {
  await formRef.value.validate()
  userDataUpdate({ name: formvalue.value.name, permissions_id: formvalue.value.selectvalue }).then(
    async ({ data }) => {
      if (data.code === 10000) {
        ElMessage.success('更新成功')
        gettabledatalist()
        const newuser = usemeauInstance.userInfo
        newuser.name = formvalue.value.name
        localStorage.setItem('pz_userInfo', JSON.stringify(newuser))
        dialogvisable.value = false
        //更新控制台管理等等
        getmUserMeauPermissionData().then(async ({ data }) => {
          usemeauInstance.newroute = []
          await usemeauInstance.handlemeau(data.data)
          usemeauInstance.newroute.forEach((item) => {
            router.addRoute('main', item)
          })
        })
      } else {
        ElMessage.success('更新失败')
      }
    },
  )
}

//通过id号来匹配所属组别
const getClassById = (id) => {
  const dataone = selecteddata.value.find((item) => item.id === id) || {}
  if (dataone) {
    return dataone.name
  } else {
    return '没有此类别名'
  }
}
//改变当前页
const handleCurrentChange = (val) => {
  page.value.pageNum = val
  gettabledatalist()
}
//改变分页数量
const handleSizeChange = (val) => {
  page.value.pageSize = val
  gettabledatalist()
}
</script>
<style lang="less" scoped>
.flex-box {
  display: flex;
  align-items: center;
}
</style>
