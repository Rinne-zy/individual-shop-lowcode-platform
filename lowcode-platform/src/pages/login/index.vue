<template>
  <div class="login">
    <div class="login-box">
      <div class="login-box-left">
        <!-- tabs -->
        <div class="login-box-left-tabs">
          <div 
           v-for="tab in tabs"
           :key="tab.value"
           :style="activeTab === tab.value ? activeTabStyle : {}"
           @click="activeTab = tab.value"
          >
            {{ tab.label }}
          </div>
        </div>
        <!-- 登录表单 --> 
        <template v-if="activeTab === 'login'">
          <el-form 
            :model="loginForm" 
            ref="loginRef" 
            :rules="rules"
          >
            <!-- 用户名 -->
            <el-form-item 
              class="login-box-left-item" 
              prop="username"
            >
              <el-input
                v-model="loginForm.username"
                placeholder="请输入用户名"
              />
            </el-form-item>
            <!-- 密码 -->
            <el-form-item
              class="login-box-left-item"
              prop="password"
            >
              <el-input
                v-model="loginForm.password"
                placeholder="请输入密码"
                show-password
              />
            </el-form-item>
          </el-form>
          <!-- 登录按钮 -->
          <el-button
            class="login-form-btn"
            size="large"
            type="primary"
            :round="true"
            @click="() => {
              validateAndLogin(successLoginCallBack);
            }"
          >
            登录
          </el-button>
        </template>
        <!-- 注册表单 -->
        <template v-if="activeTab === 'register'">
          <el-form 
            :model="registerForm"
            ref="registerRef"
            :rules="rules"
          >
            <!-- 用户名 -->
            <el-form-item 
              class="login-box-left-item" 
              prop="username"
            >
              <el-input
                v-model="registerForm.username"
                placeholder="请输入用户名"
              />
            </el-form-item>
            <!-- 密码 -->
            <el-form-item
              class="login-box-left-item"
              prop="password"
            >
              <el-input
                v-model="registerForm.password"
                placeholder="请输入密码"
                show-password
              />
            </el-form-item>
            <el-button
              class="login-form-btn"
              size="large"
              type="primary"
              :round="true"
              @click="() => {
                validateAndRegister(successRegisterCallBack);
              }"
            >
              立即注册
            </el-button>
          </el-form>
        </template>
      </div>
      <div class="login-box-right">
        <img src="/logo.png">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus';
import type { FormRules } from 'element-plus';

import { reactive, ref } from 'vue';
import { useLogin } from 'lowcode-platform/hooks/use-login-hook';
import { useRegister } from 'lowcode-platform/hooks/use-register-hook';
import { useRouter } from 'vue-router';

// 路由
const router = useRouter()

// 切换 tabs
const tabs = [
  { label: "用户登录", value: "login" },
  { label: "快速注册", value: "register" },
]
// 正在激活的 tab
const activeTab = ref('login');
// 处于激活状态的 tab 的样式
const activeTabStyle = {
  fontSize: '24px',
  color: '#337ecc',
  fontWeight: 500,
}

// 登录
const { loginForm, validateAndLogin, loginRef } = useLogin();
// 注册
const { registerForm, validateAndRegister, registerRef } = useRegister();

// 表单校验规则
const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ]
});

// 注册成功回调函数
const successRegisterCallBack = () => {
  // 重置注册表单
  registerForm.username = ''
  registerForm.password = ''
  registerForm.userType = 2
  // 重置登录表单
  loginForm.username = '';
  loginForm.password = '';
  // 注册成功切换 tab 回登录页
  activeTab.value = 'login';
}

// 登录成功回调函数
const successLoginCallBack = () => {
  router.replace('/home');
}
</script>
<style scoped src="./index.scss"></style>