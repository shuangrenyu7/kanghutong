<template>
  <div>
    <panelHeader :route="route"></panelHeader>
    <div class="btns">
      <el-button @click="handleAdd" :icon="Plus" size="samll" type="primary">新增</el-button>
      <el-popconfirm
        width="220"
        :icon="InfoFilled"
        icon-color="#626AEF"
        title="是否确认删除?"
        confirm-button-text="是"
        cancel-button-text="否"
        @confirm="onConfirm"
      >
        <template #reference>
          <el-button type="danger" :icon="Delete" size="samll">删除</el-button>
        </template>
      </el-popconfirm>
    </div>
    <!-- 列表 -->
    <el-table :data="tabledata.list" @selection-change="handleSelectionChange" width="100%">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="id"> </el-table-column>
      <el-table-column prop="name" label="昵称"></el-table-column>
      <el-table-column prop="avatar" label="头像"
        ><template #default="scope">
          <el-image :src="scope.row.avatar" style="width: 75px; height: 75px"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template #default="scope">
          <span>{{ Number(scope.row.sex) === 1 ? '男' : '女' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="age" label="年龄"></el-table-column>
      <el-table-column prop="mobile" label="手机号"></el-table-column>
      <el-table-column label="状态">
        <template #default="scope">
          <el-tag v-if="Number(scope.row.active) === 1" type="success">生效</el-tag>
          <el-tag v-else type="warning">失效</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="230px">
        <template #default="scope">
          <div class="flex-box">
            <el-icon><Clock /></el-icon>
            <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="ediot(scope.row)" type="primary">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 列表分页 -->
    <div class="pagination-info">
      <el-pagination
        v-model:currentPage="page.pageNum"
        :pageSize="page.pageSize"
        :page-sizes="[2, 3, 4, 5]"
        size="small"
        :total="tabledata.total || 0"
        layout="tatal,sizes,prev,pager,next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <!-- 弹窗 -->
    <el-dialog v-model="dialogVisible" title="陪护师添加" width="500px" :before-close="closedialog">
      <el-form
        ref="formRef"
        :model="formdata"
        label-width="80px"
        label-position="left"
        :rules="rules"
      >
        <el-form-item label="id" v-show="false" prop="id">
          <el-input v-model="formdata.id"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="name">
          <el-input v-model="formdata.name" placeholder="请选择昵称"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-button v-if="!formdata.avatar" type="primary" @click="dialogPhoto = true"
            >上传头像</el-button
          >
          <el-image
            v-else
            :src="formdata.avatar"
            @click="dialogPhoto = true"
            style="width: 100px; height: 100px"
          ></el-image>
        </el-form-item>
        <el-form-item label="性别" prop="formale">
          <!-- 单选性别 -->
          <el-select v-model="formdata.formale" placeholder="请选择性别" style="width: 100%">
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="formdata.number" :min="18" :max="60" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formdata.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="是否生效">
          <el-radio-group v-model="formdata.radiovalue">
            <el-radio :value="2">失效</el-radio>
            <el-radio :value="1">生效</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <!-- 确认按钮 -->
      <template #footer>
        <el-button type="primary" @click="confirm">确认</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogPhoto" title="添加陪护师头像" width="680px">
      <div class="image-list">
        <div
          class="img-box"
          v-for="(item, index) in photo"
          :key="item.name"
          @click="selectindex = index"
        >
          <div class="select" v-if="selectindex === index">
            <el-icon color="fff"><Check /></el-icon>
          </div>
          <el-image :src="item.url" style="width: 148px; height: 148px"></el-image>
        </div>
      </div>
      <!-- 确认按钮 -->
      <template #footer
        ><el-button @click="dialogPhoto = false">取消</el-button>
        <el-button type="primary" @click="chooseimg">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { onMounted, ref, nextTick } from 'vue'
import dayjs from 'dayjs'
import { getcompanionList, photoList, setcompanion, deletecompanionList } from '@/api'
import { Plus, Delete, InfoFilled } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
const route = useRoute()
//分页
const page = ref({
  pageNum: 1,
  pageSize: 5,
})
const tabledata = ref({
  list: [],
  total: '',
})
const handleSizeChange = (num) => {
  page.value.pageSize = num
  gettable()
}
const handleCurrentChange = (num) => {
  page.value.pageNum = num
  gettable()
}
//弹窗里面的选择头像以及弹窗里面的选择头像弹窗
const selectindex = ref(0)
const dialogPhoto = ref(false)
const photo = ref([])
onMounted(() => {
  photoList().then(({ data }) => {
    photo.value = data.data
  })
  gettable()
})
const gettable = () => {
  getcompanionList(page.value).then(({ data }) => {
    data.data.list.forEach((item) => {
      item.create_time = dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss')
    })
    tabledata.value.list = data.data.list
    tabledata.value.total = data.data.total
  })
}
const chooseimg = () => {
  formdata.value.avatar = photo.value[selectindex.value].url || ''
  dialogPhoto.value = false
  nextTick(() => {
    formRef.value.validateField('avatar')
  })
}
//弹窗控制属性
const dialogVisible = ref(false)
const handleAdd = () => {
  clearform()
  dialogVisible.value = true
  console.log(formdata.value.avatar)
}
//弹窗确认属性
const confirm = async () => {
  await formRef.value.validate()
  setcompanion({
    id: formdata.value.id,
    mobile: formdata.value.phone,
    active: formdata.value.radiovalue,
    age: formdata.value.number,
    avatar: formdata.value.avatar,
    name: formdata.value.name,
    sex: formdata.value.formale,
  }).then(() => {
    clearform()
    gettable()
  })

  dialogVisible.value = false
}
//弹窗里面的表单属性
const formRef = ref()
const formdata = ref({
  id: '',
  name: '',
  avatar: '',
  formale: '',
  number: 18,
  phone: '',
  radiovalue: '',
})
//清空表单函数
const clearform = () => {
  formdata.value = {
    id: '',
    name: '',
    avatar: '',
    formale: '',
    number: 18,
    phone: '',
    radiovalue: '',
  }
  nextTick(() => {
    if (formRef.value) {
      formRef.value.clearValidate()
    }
  })
}
//给表单配规则
const rules = {
  name: { required: true, trigger: 'blur', message: '昵称不能为空' },
  avatar: { required: true, message: '请上传头像' },
  formale: { required: true, trigger: 'change', message: '请选择性别' },
  phone: [
    { required: true, trigger: 'blur', message: '手机号不能为空' },
    {
      pattern: /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
      message: '请输入正确的手机号',
      trigger: 'blur',
    },
  ],
}
//单选性别
const options = [
  { value: '1', label: '男' },
  { value: '0', label: '女' },
]
//关闭弹窗×号
const closedialog = () => {
  clearform()
  dialogVisible.value = false
}
//表格中的点击操作按钮
const ediot = (row) => {
  console.log(row)
  formdata.value = {
    id: row.id,
    name: row.name,
    avatar: row.avatar,
    formale: row.sex,
    number: row.age,
    phone: row.mobile,
    radiovalue: row.active,
  }
  dialogVisible.value = true
}
//表格多选
const selectdata = ref([])
const handleSelectionChange = (val) => {
  selectdata.value = val
}
const onConfirm = () => {
  if (!selectdata.value.length) {
    ElMessage.warning('请选择至少一项数据')
  } else {
    deletecompanionList({ id: selectdata.value }).then(() => {
      gettable()
    })
  }
}
</script>
<style lang="less" scoped>
.btns {
  padding: 10px 0px 10px 10px;
  background-color: #fff;
}
.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .img-box {
    position: relative;
    .select {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
.flex-box {
  display: flex;
  align-items: center;
}
</style>
