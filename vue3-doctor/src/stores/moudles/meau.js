import { defineStore } from 'pinia'
import { ref } from 'vue'
export const usemeau = defineStore('useMeauPinia', () => {
  const isCollapse = ref(false)
  const selectmeau = ref([])
  //从vue里面获取的conponent
  const componentway = ref({})
  //修改route路由重新储存
  const newroute = ref([])
  //菜单收缩功能
  const improveisCollapse = () => {
    isCollapse.value = !isCollapse.value
  }
  //菜单选项高亮
  const meauactive = ref('')
  const handleactive = (data) => {
    meauactive.value = data
  }
  //这里userInfo
  const userInfo = ref(JSON.parse(localStorage.getItem('pz_userInfo') || '{}'))
  //修改userInfo
  const setUserInfo = (data) => {
    userInfo.value = data
  }
  //头顶菜单显示功能获取
  const getselectmeau = (chuan) => {
    if (selectmeau.value.findIndex((item) => item.meta.path === chuan.meta.path) == -1) {
      selectmeau.value.push(chuan)
    } else {
      return
    }
  }
  const deletemeau = (pay) => {
    const date = selectmeau.value.findIndex((item) => item.meta.path === pay.meta.path)
    selectmeau.value.splice(date, 1)
  }
  //通过刚登录酒处理菜单
  const handlemeau = (data) => {
    const moudles = import.meta.glob('../../views/**/**/*.vue')
    componentway.value = moudles
    setRoute(data)
  }

  //重新建立路由
  const setRoute = (data) => {
    data.forEach((item) => {
      if (!item.children) {
        const url = `../../views${item.meta.path}/index.vue`
        item.component = componentway.value[url]
      } else {
        setRoute(item.children)
      }
    })
    newroute.value = data
  }
  return {
    isCollapse,
    selectmeau,
    newroute,
    meauactive,
    userInfo,
    improveisCollapse,
    getselectmeau,
    deletemeau,
    handlemeau,
    setRoute,
    handleactive,
    setUserInfo,
  }
})
