<template>
  <div class="home">
    <el-container>
        <!-- 侧边栏 -->
        <el-aside class="home-aside" width="200px">
          <div class="home-aside-top">顶部</div>
          <el-menu :default-active="activatedMenu" router>
            <el-menu-item
              v-for="(menuItem, index) in menu" 
              :key="menuItem.value"
              :index="menuItem.value"
              @click="activeMenuItemIndex = index"
            >
              <i class='iconfont' :class="menuItem.icon" />
              <template #title>{{ menuItem.name }}</template>
            </el-menu-item>
          </el-menu>
        </el-aside>
      <el-container>
        <!-- 头部 -->
        <el-header class="home-header">
          <div class="activeMenuInfo">
            <i class='iconfont' :class="activeMenuItem.icon" />
            {{ activeMenuItem.name }}
          </div>
          <div class="home-header-btns">
            <template v-if="activeMenuItem.value === '/shop'">
              <el-button type="primary"><i class='iconfont icon-phone' />一键部署</el-button>
            </template>
            <template v-if="activeMenuItem.value === '/construction'">
              <el-button type="primary" @click="handleClickSave()" :disabled="isSaved"><i class='iconfont icon-save' />保存页面</el-button>
              <el-button type="primary"><i class='iconfont icon-phone' />实时预览</el-button>   
            </template>
          </div>
          <div class="home-header-user-info">
            <img src="/azi.jpg">
            {{ userStore.userName }}
          </div>
        </el-header>
        <!-- 主要内容 -->
        <el-main class="home-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
    <create-shop-dialog
      ref="createShopDialogRef"
      :is-visible="isVisible"
      :is-editing="!isNewShop"
      @cancel="isVisible = false"
      @confirm="(name) => {
        if(isNewShop) {
          handleSaveConfirm(name);
          isVisible = false;
        } else {
          handleUpdateConfirm();
          isVisible = false;
        }
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElContainer, ElAside, ElHeader, ElMain, ElMenu, ElMenuItem, ElButton } from 'element-plus';

import CreateShopDialog from 'lowcode-platform/components/create-shop-dialog/index.vue';
import { useMenuStore } from 'lowcode-platform/store/menu-store';
import { useUserStore } from 'lowcode-platform/store/user-store';
import { useRoute, useRouter } from 'vue-router';
import { saveSchema, updateSchema } from 'lowcode-platform/api/schema';
import { StatusCode } from 'lowcode-platform/api/type';
import { showSuccessMessage } from 'lowcode-platform/utils/toast';
import { useSchemaStore } from 'lowcode-platform/store/schema-store';

// 用户信息 store
const userStore = useUserStore();

// 菜单信息
const menuStore = useMenuStore();
// schema 信息
const schemaStore = useSchemaStore();
// 路由
const route = useRoute();
const router = useRouter();

//已激活的菜单项
const activeMenuItemIndex = ref(0);
const menu = computed(() => menuStore.menu);
const activeMenuItem = computed(() => menuStore.menu[activeMenuItemIndex.value]);
const activatedMenu  = computed(() => menuStore.activatedMenu);

const createShopDialogRef = ref<null | InstanceType<typeof CreateShopDialog> >();
const handleClickSave = (name = schemaStore.name) => {
  isVisible.value = true;
  createShopDialogRef.value?.setShopForm(name);
};

// 对话框是否可见
const isVisible = ref(false);
// 是否已经保存
const isSaved = computed(() => schemaStore.isSavedSchema());
// 是否是新商城
const isNewShop = computed(() => !schemaStore.id && !schemaStore.name);

onMounted(() => {
  // 设置正在激活的路由
  menuStore.changeActiveMenu(route.path);
  activeMenuItemIndex.value = menu.value.findIndex((menuItem) => menuItem.value === route.path);
});

// 处理路由转跳更新控制菜单
router.afterEach(() => {
  const activeIndex = menu.value.findIndex((menuItem) => menuItem.value === route.path);
  if(activeIndex === -1) return;
  menuStore.changeActiveMenu(route.path);
  activeMenuItemIndex.value = activeIndex;
})

/**
 * 处理确认保存回调
 * @param name 
 */
const handleSaveConfirm = async (name: string) => {
  const { data } = await saveSchema(name, schemaStore.schema);
  if (!data || data.code !== StatusCode.Success) throw new Error(data.msg);
  showSuccessMessage(data.msg);
  schemaStore.reset(true);
}

/** 处理更新 */
const handleUpdateConfirm = async () => {
  const { data } = await updateSchema(schemaStore.id, undefined, schemaStore.schema);
  if (!data || data.code !== StatusCode.Success) throw new Error(data.msg);
  showSuccessMessage(data.msg);
  schemaStore.reset(true);
}

</script>

<style scoped src="./index.scss"></style>