<template>
  <view>
    <u-tabs :list="tabs" @click="changeTabBar"></u-tabs>
    <view class="form">
      <u-form
        labelPosition="left"
        labelWidth="78"
        ref="form"
        :model="formInfo"
        :rules="rules"
		  >
        <u-form-item
          label="用户名："
          prop="username"
          leftIcon="account"
        >
          <u-input
            v-model="formInfo.username"
            border="surround"
            clearable
          />
        </u-form-item>
        <u-form-item
          label="密码："
          prop="password"
          leftIcon="lock"
        >
          <u-input
            v-model="formInfo.password"
            type="password"
            border="surround"
            clearable
          />
        </u-form-item>
      </u-form>
      <view class="submit-btn">
        <u-button type="primary" :text="active === Status.Login ? '登录': '注册'" @click="submit" />  
      </view>
      <view style="margin-top: 20px;">
        <u-button type="success" text="微信登录" @click="wxLogin"/>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { login, register } from 'lowcode-platform-weixin-renderer/api/user';
import { useUserStore } from 'lowcode-platform-weixin-renderer/store/user';
import { navigateBack } from 'lowcode-platform-weixin-renderer/utils/router';
import { showFailToast } from 'lowcode-platform-weixin-renderer/utils/toast';

enum Status {
  Login = 0,
  Register = 1,
};

// tab 数据
const tabs = [
  {
    name: '登录',
    active: Status.Login
  },
  {
    name: '注册',
    active: Status.Register
  }
];

// 表单信息
const formInfo = reactive({
  username: '',
  password: '',
  userType: 1,
});
// 当前激活的状态
const active = ref<Status>(Status.Login);
// 表单实例
const form = ref();

const rules = {
	username: [
		{
			required: true,
			message: '请输入用户名',
			trigger: ['blur', 'change'],
		},
	],
  password: [
		{
			required: true,
			message: '请输入密码',
			trigger: ['blur', 'change'],
		},
	]
}

// 切换 tabbar
const changeTabBar = (item: typeof tabs[0]) => {
  active.value = item.active;
  resetFormInfo();
}

// 重置
const resetFormInfo = () => {
  formInfo.password = '';
  formInfo.username = '';
}
// 登录
const submit = async () => {
  form.value.validate().then(async (res: boolean) => {
    if(!res) return;
    // 登录
    if(active.value === Status.Login) {
      const res = await login(formInfo.username, formInfo.password);
      const { username, token } = res;
      if(!username || !token) return;

      const userStore = useUserStore();
      userStore.setLoginUserInfo(username, '/static/m.png', token);
      setTimeout(() => {
        navigateBack();
      }, 1000);
      return;
    };

    // 注册
    await register(formInfo.username, formInfo.password, formInfo.userType);
    resetFormInfo();
    active.value = Status.Login;
  }).catch(() => {
    showFailToast('请输入的用户名和密码');
  })
}
// 微信登录
const wxLogin = async () => {
  uni.redirectTo({
    url: '/pages/wx-auth/index'
  })
}
</script>

<style lang="scss" scoped src="./index.scss"></style>