<template>
  <div>
    <van-overlay :show="showWxLoginLoading">
      <div class="loading-wrapper">
        <van-loading size="24px" vertical>登录中，请稍后...</van-loading>
      </div>  
    </van-overlay>
  </div>
</template>

<script setup lang="ts">
import { 
  Overlay as VanOverlay,
  Loading as VanLoading,
} from 'vant';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { wxAuth } from 'lowcode-platform-h5-renderer/api/user';
import { useUserStore } from 'lowcode-platform-h5-renderer/store/user';
import { LOCAL_STORAGE_KEY_OF_WX_OPENID } from 'lowcode-platform-common/common';

const router = useRouter();
// 微信登录 Loading
const showWxLoginLoading = ref(false);

const authAndLogin = async () => {
  const param = new URLSearchParams(location.search);
  const code  = param.get('code') || '';
  showWxLoginLoading.value = true;
  const res = await wxAuth(code);

  const { data, token } = res;
  if(!data || !token) return;

  const userStore = useUserStore();
  userStore.setLoginUserInfo(data.nickName, data.avatar, token);
  localStorage.setItem(LOCAL_STORAGE_KEY_OF_WX_OPENID, data.username);
  setTimeout(() => {
    showWxLoginLoading.value = false;
    router.replace('/info');
  }, 1000)
};

authAndLogin();
</script>

<style lang="scss" scoped src="./index.scss"></style>