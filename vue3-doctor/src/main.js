import { createApp } from 'vue'
import pinia from './stores'
import './style.css'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import panelHeader from '@/components/panelHeader.vue'
import { usemeau } from '@/stores'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)

//处理刷新页面路由丢失问题
const usemeauInstance = usemeau()
const localStoragedata = JSON.parse(localStorage.getItem('useMeauPinia')) || []
if (localStoragedata.newroute) {
  usemeauInstance.handlemeau(localStoragedata.newroute)
  localStoragedata.newroute.forEach((item) => {
    router.addRoute('main', item)
  })
} else {
  usemeauInstance.handlemeau(usemeauInstance.newroute)
  usemeauInstance.newroute.forEach((item) => {
    router.addRoute('main', item)
  })
}
router.beforeEach((to) => {
  const token = localStorage.getItem('pz_token')
  if (!token && to.path !== '/login') {
    return '/login'
  } else if (token && to.path === '/login') {
    return '/'
  } else {
    return true
  }
})
app.use(router)
app.component('panelHeader', panelHeader)
app.mount('#app')
