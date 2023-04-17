<template>
  <view class="wx-auth">
    <view class="avatar-select">
      <text>微信头像：</text>
      <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="chooseAvatar">
        <image v-if="avatar" class="avatar" :src="avatar" />
        <view v-else class="avatar-placeholder"><text>点击获取微信头像</text></view>
      </button>
    </view>
    <view class="nickname">
      <text>微信用户名：</text>
      <input
        id="nickname-input"
        class="nickname-input"
        type="nickname"
        placeholder="请先获取微信昵称"
        v-model="nickName"
        @input="handleInputNickName"
        @blur="handleNickNameChange"
      />
    </view>
    <u-button type="success" text="微信登录" :disabled="canNotLogin" @click="wxLogin" />
    <toast ref="toast"></toast>
  </view>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, ref } from 'vue';

import { wxMiniProgramLogin } from 'lowcode-platform-weixin-renderer/api/user';
import { useUserStore } from 'lowcode-platform-weixin-renderer/store/user';
import { switchTab } from 'lowcode-platform-weixin-renderer/utils/router';
import Toast from 'lowcode-platform-weixin-renderer/components/toast/index.vue';
import { setHandleFailToast } from 'lowcode-platform-weixin-renderer/utils/error';
import { showFailToast } from 'lowcode-platform-weixin-renderer/utils/toast';

// 头像
const avatar = ref('');
// 名称
const nickName = ref('');
// 是否能够登录
const canNotLogin = computed(() => !avatar.value || !nickName.value);
// toast提示
const toast = ref();
// 选择头像
const chooseAvatar = (e: any) => {
  const { avatarUrl } = e.detail;
  avatar.value = avatarUrl;
};
// 组件实例
const instance = getCurrentInstance();
// 处理输入用户名
const handleInputNickName = (event: any) => {
  nickName.value = event.target.value
};
// 处理输入用户名
const handleNickNameChange = (e: any) => {
  uni.createSelectorQuery().in(instance)
    .select("#nickname-input")
    .fields({
        properties: ["value"],
    }, () => {})
    .exec((res) => {
      nickName.value = res?.[0]?.value
    })
};
// 微信登录
const wxLogin = () => {
  uni.login({
    provider: 'weixin',
    success: async (res) => {
      const { code, errMsg } = res;
      if(!code) {
        showFailToast(errMsg);
        throw new Error('微信登录失败')
      }

      setHandleFailToast((msg) => {
        toast.value.show(msg)
      });

      const { token, data } = await wxMiniProgramLogin(code, nickName.value);
      const userStore = useUserStore();

      if(!token || !data) {
        throw new Error('微信登录失败');
      };

      userStore.setLoginUserInfo(data.nickName, data.avatar, token);
      setTimeout(() => {
        switchTab('my-info');
      }, 1000)
    }
  })
};
</script>

<style lang="scss" scoped src="./index.scss"></style>