<template>
  <div id="chat-login">

    <a-modal v-model:open="open" :maskClosable="false" :closable="false" :footer="null" :getContainer="() => modalContainer">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="登录"></a-tab-pane>
        <a-tab-pane key="2" tab="注册" force-render></a-tab-pane>
      </a-tabs>

      <a-form :model="formState" ref="formRef" name="basic" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">

        <a-form-item label="用户名" name="username" :validateStatus="nameRepeatError || passwordError ? 'error' : undefined" :help="nameRepeatError ? '该用户名已被注册' : undefined" :rules="[{ required: true, pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_-]{2,16}$/ ,message: '可有 中文 字母 数字 2到16位'}]">
          <a-input v-model:value="formState.username" />
        </a-form-item>

        <a-form-item label="密码" name="password" :validateStatus="passwordError ? 'error' : undefined" :help="passwordError ? '用户名或密码错误' : undefined" :rules="[{ required: true, validator: passValidator , message: '可有 字母 _ - 6到16位' }]">
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <Transition name="confirmPassword">
          <a-form-item v-if="activeKey === '2'" label="确认密码" name="confirmPassword" :rules="[{ required: true, message: '请再次输入以确认新密码', validator: confirmPassValidator }]">
            <a-input-password v-model:value="formState.confirmPassword" />
          </a-form-item>
        </Transition>

        <a-form-item :wrapper-col="{ span: 10, offset:7 }" class="chat-login-btn">
          <a-spin :spinning="spinning">
            <a-button type="primary" html-type="submit">{{ activeKey === '1' ? '登录' : '注册' }}</a-button>
          </a-spin>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { loginUser, registerUser } from '@/api/apis/modules/user'
import { useChatStore } from '@/stores/chatStore'
import { FormInstance } from 'ant-design-vue'
import { onMounted, reactive, ref, watch } from 'vue'

interface FormState {
  username: string
  password: string
  remember: boolean
  confirmPassword: string
}

const chatStore = useChatStore()

const emits = defineEmits(['loginSuccess'])

const open = ref<boolean>(true)
const activeKey = ref('1')
const spinning = ref<boolean>(false)
const nameRepeatError = ref(false)
const passwordError = ref(false)
let modalContainer: HTMLElement | null = null

const formState = reactive<FormState>({
  username: 'admin',
  password: 'admin123',
  confirmPassword: '',
  remember: true
})

const formRef = ref<FormInstance>()

watch(
  () => formState.username,
  () => {
    nameRepeatError.value = false
    passwordError.value = false
  }
)

watch(
  () => formState.password,
  () => {
    passwordError.value = false
  }
)

watch(activeKey, () => {
  formRef.value!.resetFields()
})

function passValidator(rule: any, value: string, callback: any) {
  console.log(rule, callback)

  if (!/^[a-zA-Z0-9_-]{6,16}$/.test(value)) {
    return Promise.reject('Please input the password')
  } else {
    if (formState.password !== '') {
      formRef.value?.validateFields('confirmPassword')
    }
    return Promise.resolve()
  }
}

function confirmPassValidator() {
  if (formState.confirmPassword !== formState.password) {
    return Promise.reject('两次密码不一致')
  } else {
    return Promise.resolve()
  }
}

const onFinish = async (values: authDto) => {
  spinning.value = true
  if (activeKey.value === '1') {
    // 登录
    const res: LoginRes = await loginUser(values)
    if (res.statusCode && res.statusCode === 403) {
      // 失败
      passwordError.value = true
    } else {
      chatStore.currentUser = res.data.user
      chatStore.currentUser.avatar = import.meta.env.VITE_AVATAR_URL + chatStore.currentUser.avatar

      window.localStorage.setItem('token', res.data.token)
      open.value = false
      emits('loginSuccess', 'oldUser')
    }
  } else if (activeKey.value === '2') {
    // 注册
    const { confirmPassword, ...bodyMsg } = values

    const res = await registerUser(bodyMsg)
    if (res.statusCode && res.statusCode === 403) {
      // 错误
      nameRepeatError.value = true
    } else {
      chatStore.currentUser = res.data.user
      chatStore.currentUser.avatar = import.meta.env.VITE_AVATAR_URL + chatStore.currentUser.avatar
      window.localStorage.setItem('token', res.data.token)
      open.value = false
      emits('loginSuccess', 'newUser')
    }
  }
  spinning.value = false
}

const onFinishFailed = async (values: any) => {
  console.log('Failed:', values)
}

console.log(import.meta.env.VITE_BASE_URL)

onMounted(() => {
  modalContainer = document.querySelector('.chat-main')!
})
</script>

<style scoped>
#chat-login {
  /* width: 100%;
  height: 100%;
  position: relative; */

  .chat-login {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .login-panel {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.ant-form-item {
  margin-bottom: 35px;
}
.chat-login-btn {
  margin-bottom: 10px;

  .ant-btn {
    width: 100%;
  }
}

.confirmPassword-enter-active,
.confirmPassword-leave-active {
  transition: all 0.3s linear;
  max-height: 35px;
}

.confirmPassword-enter-from,
.confirmPassword-leave-to {
  opacity: 0;
  max-height: 0px;
  transform: translateX(200px) scale(0.1, 0.1);
}
</style>