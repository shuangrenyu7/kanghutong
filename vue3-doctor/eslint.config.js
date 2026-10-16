import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,js,mjs,jsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        // 在这里添加 Element Plus 的全局变量
        ElMessage: 'readonly',
        ElMessageBox: 'readonly',
        ElLoading: 'readonly',
        ElNotification: 'readonly',
      },
    },
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  // 添加自定义规则配置
  {
    name: 'vue/custom-rules',
    files: ['**/*.vue'],
    rules: {
      // 关闭多单词组件名规则
      'vue/multi-word-component-names': 'off',

      // 如果需要，可以添加其他自定义规则
      // 'vue/no-unused-vars': 'warn',
    },
  },

  skipFormatting,
])
