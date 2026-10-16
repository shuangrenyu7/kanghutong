<template>
  <div class="navheader">
    <div class="left flex">
      <el-icon size="20" class="flex icon" @click="handleisCollapse"><Fold /></el-icon>
      <ul class="ulstyle flex">
        <li
          v-for="(item, index) in usemeaushili.selectmeau"
          :key="item.path"
          class="listyle flex"
          :class="{ selected: item.meta.path === route.path }"
        >
          <el-icon><component :is="item.meta.icon"></component></el-icon>

          <router-link :to="item.meta.path" class="text flex">{{ item.meta.name }}</router-link>
          <el-icon class="close" @click="closetag(item, index)"><Close /></el-icon>
        </li>
      </ul>
    </div>
    <div class="right">
      <el-dropdown @command="handleClick">
        <div class="el-dropdown-link flex">
          <el-avatar :src="usemeaushili.userInfo.avatar" />
          <p class="user-name">{{ usemeaushili.userInfo.name }}</p>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="cancel">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { usemeau } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
//获取本地存储中的用户数据赋值给userInfo 拿到用户数据渲染头部头像

const usemeaushili = usemeau()
const route = useRoute()
const router = useRouter()
const handleisCollapse = async () => {
  usemeaushili.improveisCollapse()
}
const closetag = (item, index) => {
  usemeaushili.deletemeau(item)
  if (route.path === item.meta.path) {
    if (index === usemeaushili.selectmeau.length) {
      if (index === 0) {
        router.push('/')
      } else {
        router.push(`${usemeaushili.selectmeau[index - 1].meta.path}`)
      }
    } else {
      router.push(`${usemeaushili.selectmeau[index].meta.path}`)
    }
  } else {
    return
  }
}
//处理点击头像下拉处理方法

const handleClick = (command) => {
  if (command === 'cancel') {
    usemeaushili.selectmeau = []
    localStorage.removeItem('pz_token')
    localStorage.removeItem('pz_userInfo')
    localStorage.removeItem('useMeauPinia')
    router.push('/login')
  }
}
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  align-items: center;
}
.navheader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: #fff;
  padding-right: 25px;
  .left {
    height: 100%;
    .icon {
      width: 45px;
      height: 100%;
    }
    .ulstyle {
      height: 100%;
      .icon:hover {
        background-color: #f5f5f5;
        cursor: pointer;
      }
      .listyle {
        height: 100%;
        padding: 0 10px;
        .close {
          visibility: hidden;
        }
        .text {
          margin: 0 5px;
        }
        &.selected {
          a {
            color: #409eff;
          }
          i {
            color: #409eff;
          }
          background-color: #f5f5f5;
        }
      }

      .listyle:hover {
        background-color: #f5f5f5;
        .close {
          visibility: inherit;
          cursor: pointer;
          color: #000;
        }
      }
    }
  }
  .right {
    .el-dropdown-link {
      .user-name {
        margin-left: 10px;
      }
    }
  }
  a {
    color: #333;
    height: 100%;
    font-size: 15px;
  }
}
</style>
