<template>
  <div>
    <van-tabs v-model:active="active">
      <van-form class="form" ref="form" @submit="submit">
          <van-cell-group inset>
            <van-field
              v-model="formInfo.username"
              name="用户名"
              label="用户名"
              placeholder="用户名"
              :rules="[{ required: true, message: '请填写用户名' }]"
            />
            <van-field
              v-model="formInfo.password"
              type="password"
              name="密码"
              label="密码"
              placeholder="密码"
              :rules="[{ required: true, message: '请填写密码' }]"
            />
          </van-cell-group>
        </van-form>
      <van-tab :name="Status.Login" title="登录">
        <div style="margin: 16px;">
          <van-button round block type="primary" @click="handleConfirm">
            登录
          </van-button>
          <van-button v-if="isWeiXin" round block type="success" @click="wxUserLogin" style="margin-top: 20px;">
            微信登录
          </van-button>
        </div>
      </van-tab>
      <van-tab :name="Status.Register" title="注册">
        <div style="margin: 16px;">
          <van-button round block type="primary" @click="handleConfirm">
            注册
          </van-button>
        </div>
      </van-tab>
    </van-tabs>
  </div>
  <van-overlay :show="showWxLoginLoading">
    <div class="loading-wrapper">
      <van-loading size="24px" vertical>登录中，请稍后...</van-loading>
    </div>  
  </van-overlay>
</template>

<script setup lang="ts">
import { 
  Button as VanButton,
  Form as VanForm,
  Field as VanField,
  CellGroup as VanCellGroup,
  Tab as VanTab,
  Tabs as VanTabs,
  Overlay as VanOverlay,
  Loading as VanLoading,
} from 'vant';
import type { FormInstance } from 'vant';
import { reactive, ref } from 'vue';
import { login, register, wxLogin } from 'lowcode-platform-h5-renderer/api/user';
import { useUserStore } from 'lowcode-platform-h5-renderer/store/user';
import { useRouter } from 'vue-router';
import { LOCAL_STORAGE_KEY_OF_WX_OPENID } from 'lowcode-platform-common/common';

enum Status {
  Login = 0,
  Register = 1,
}

const router = useRouter();
// 表单信息
const formInfo = reactive({
  username: '',
  password: '',
  userType: 1,
});
// 当前激活的状态
const active = ref<Status>(Status.Login);
//表单实例
const form = ref<FormInstance>();
// 是否在微信
const isWeiXin = /MicroMessenger/i.test(window.navigator.userAgent.toLowerCase());
// 微信登录 Loading
const showWxLoginLoading = ref(false);

// 点击按钮
const handleConfirm = () => {
  form.value?.submit();
}
// 重置
const resetFormInfo = () => {
  formInfo.password = '';
  formInfo.username = '';
}
// 登录
const submit = async () => {
  if(active.value === Status.Login) {
    const res = await login(formInfo.username, formInfo.password);
    const { username, token } = res;
    if(!username || !token) return;

    const userStore = useUserStore();
    userStore.setLoginUserInfo(username, '/m.png', token);
    router.go(-1);
    return;
  };

  await register(formInfo.username, formInfo.password, formInfo.userType);
  resetFormInfo();
  active.value = Status.Login;
};

// 微信登录
const wxAuth = async () => {
  const appId = 'wx410dc45d2e80363d';
  const redirectUri = 'http://47.97.34.219:8081/wx-auth';
  const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
  window.location.href = url;
};

// 微信登录
const wxUserLogin = async () => {
  showWxLoginLoading.value = true;
  const openId = localStorage.getItem(LOCAL_STORAGE_KEY_OF_WX_OPENID) || '';
  const res = await wxLogin(openId);
  // 若直接登录失败，则需要唤起微信登录
  if(!res) {
    wxAuth();
    return;
  }

  const { data, token } = res;
  if(!data || !token) return;
  const userStore = useUserStore();
  userStore.setLoginUserInfo(data.nickName, data.avatar, token);
  
  setTimeout(() => {
    showWxLoginLoading.value = false;
    router.go(-1);
  }, 1000)
  return;
};

</script>

<style lang="scss" scoped src="./index.scss"></style>