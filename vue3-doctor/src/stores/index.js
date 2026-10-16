import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(
  createPersistedState({
    // 全局配置
    storage: localStorage,
    // 自动序列化/反序列化
    serializer: {
      serialize: JSON.stringify,
      deserialize: JSON.parse,
    },
    // 可以设置所有 store 都持久化
    auto: true, // 自动持久化所有 store
  }),
)
export default pinia
import { usemeau } from './moudles/meau'
export { usemeau }
