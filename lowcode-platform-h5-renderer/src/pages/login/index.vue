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
</template>

<script setup lang="ts">
import { Button as VanButton, Form as VanForm, Field as VanField, CellGroup as VanCellGroup, Tab as VanTab, Tabs as VanTabs } from 'vant';
import type { FormInstance } from 'vant';
import { reactive, ref } from 'vue';
import { login, register } from 'lowcode-platform-h5-renderer/api/user';
import { useUserStore } from 'lowcode-platform-h5-renderer/store/user';
import { useRouter } from 'vue-router';

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
    // TODO: 此处头像暂时使用静态头像
    userStore.setLoginUserInfo(username, '/m.png', token);
    router.go(-1);
    return;
  };

  await register(formInfo.username, formInfo.password, formInfo.userType);
  resetFormInfo();
  active.value = Status.Login;
}
</script>

<style lang="scss" scoped src="./index.scss"></style>