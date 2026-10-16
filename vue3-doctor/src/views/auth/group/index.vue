<template>
  <panelHeader :route="route"></panelHeader>
  <div class="btns">
    <div>
      <el-button type="primary" @click="open(null)" :icon="Plus" size="small">新建</el-button>
    </div>
    <el-table :data="tabledata.list" width="100%">
      <el-table-column prop="id" label="id"> </el-table-column>
      <el-table-column prop="name" label="昵称"></el-table-column>
      <el-table-column prop="permissionName" label="权限" width="500px"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" @click="open(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-info">
      <el-pagination
        v-model:currentPage="page.pageNum"
        :page-size="page.pageSize"
        :page-sizes="[2, 3, 4, 5]"
        size="small"
        :total="tabledata.total || 0"
        layout="total,sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      v-model="dialogvisable"
      width="500px"
      :before-close="beforeclose"
      title="添加权限"
      draggable
    >
      <el-form
        :model="formvalue"
        ref="formRef"
        :rules="formrules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item v-show="false">
          <el-input v-model="formvalue.id"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="formvalue.name" placeholder="请填写权限名称"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="permissions">
          <el-tree
            :data="treedata"
            style="max-width: 600px"
            show-checkbox
            node-key="id"
            ref="treeRef"
            :default-checked-keys="defaultchecked"
            :default-expanded-keys="defaultchecked"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="confirm()">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { meauAdminList, usersetmeau, getmeauAdminList } from '@/api/index'
import { Plus } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
const route = useRoute()
//控制弹窗显示是否
const dialogvisable = ref(false)
const treedata = ref([])
const treeRef = ref()
const formRef = ref()
//获取列表数据需要的分页数据
const page = ref({
  pageNum: 1, //显示第几页
  pageSize: 3, //
})
//默认被选中的id号
const defaultchecked = [4, 5]
onMounted(async () => {
  const { data } = await meauAdminList()
  treedata.value = data.data
  getlist()
})
const formvalue = ref({
  name: '',
  permissions: '',
  id: '',
})
//获取权限列表数据
const tabledata = ref({
  list: [],
  total: '',
})
const getlist = () => {
  getmeauAdminList(page.value).then(({ data }) => {
    tabledata.value.list = data.data.list
    tabledata.value.total = data.data.total
  })
}
//确认按钮和表单校验
const formrules = {
  name: [{ required: true, trigger: 'blur', message: '请填写权限名称' }],
}
const confirm = async () => {
  await formRef.value.validate()
  formvalue.value.permissions = JSON.stringify(treeRef.value.getCheckedKeys())
  usersetmeau({
    name: formvalue.value.name,
    permissions: formvalue.value.permissions,
    id: formvalue.value.id,
  }).then(() => {
    getlist()
    //重置表单
    formRef.value.resetFields()
    //重置树组件
    treeRef.value.setCheckedKeys(defaultchecked)
  })

  dialogvisable.value = false
}
//编辑函数 打开弹窗或者修改
const open = (rowDate = {}) => {
  dialogvisable.value = true
  if (rowDate) {
    nextTick(() => {
      Object.assign(formvalue.value, { id: rowDate.id, name: rowDate.name })
      treeRef.value.setCheckedKeys(rowDate.permission)
    })
  } else {
    nextTick(() => {
      page.value.pageNum = Math.ceil((tabledata.value.total + 1) / page.value.pageSize)
    })
  }
}
//点击弹窗关闭x号
const beforeclose = () => {
  dialogvisable.value = false
  //重置表单
  formRef.value.resetFields()
  //重置树组件
  treeRef.value.setCheckedKeys(defaultchecked)
}
//改变当前页
const handleCurrentChange = (val) => {
  page.value.pageNum = val
  getlist()
}
//改变分页数量
const handleSizeChange = (val) => {
  page.value.pageSize = val
  getlist()
}
</script>
<style lang="less" scoped>
.btns {
  padding: 10px 0px 10px 10px;
  background-color: #fff;
}
</style>
