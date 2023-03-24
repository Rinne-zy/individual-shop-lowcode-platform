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
              <el-button type="primary" @click="isVisible = true"><i class='iconfont icon-home' />创建商场</el-button>
              <el-button type="primary" :disabled="!shopsStore.selectShopId" @click="deploy"><i class='iconfont icon-phone' />一键部署</el-button>
            </template>
            <template v-if="activeMenuItem.value === '/construction'">
              <el-button type="primary" @click="handleClickSave()" :disabled="isSaved"><i class='iconfont icon-save' />保存页面</el-button>
              <el-button type="primary"  @click="handlePreview"><i class='iconfont icon-phone' />实时预览</el-button>   
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
      @confirm="handleSaveConfirm"
    />
  </div>
  <realtime-preview ref="realTimePreviewRef" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElContainer, ElAside, ElHeader, ElMain, ElMenu, ElMenuItem, ElButton } from 'element-plus';

import CreateShopDialog from 'lowcode-platform/components/create-shop-dialog/index.vue';
import RealtimePreview from 'lowcode-platform/components/realtime-preview/index.vue';
import { useMenuStore } from 'lowcode-platform/store/menu-store';
import { useUserStore } from 'lowcode-platform/store/user-store';
import { useRoute, useRouter } from 'vue-router';
import { StatusCode } from 'lowcode-platform/api/type';
import { showSuccessMessage } from 'lowcode-platform/utils/toast';
import { useSchemaStore } from 'lowcode-platform/store/schema-store';
import { createShop, deployShop, ShopInfo, updateShopSchema } from 'lowcode-platform/api/shop';
import { showConfirmDialog } from 'vant';
import { useShopsStore } from 'lowcode-platform/store/shop-store';

// 用户信息 store
const userStore = useUserStore();
// 菜单信息
const menuStore = useMenuStore();
// schema 信息
const schemaStore = useSchemaStore();
// 商城
const shopsStore = useShopsStore();
// 路由
const route = useRoute();
const router = useRouter();

//已激活的菜单项
const activeMenuItemIndex = ref(0);
const menu = computed(() => menuStore.menu);
const activeMenuItem = computed(() => menuStore.menu[activeMenuItemIndex.value]);
const activatedMenu  = computed(() => menuStore.activatedMenu);
const realTimePreviewRef = ref<InstanceType<typeof RealtimePreview>>();
const createShopDialogRef = ref<null | InstanceType<typeof CreateShopDialog> >();
// 对话框是否可见
const isVisible = ref(false);
// 是否已经保存
const isSaved = computed(() => schemaStore.isSavedSchema());
// 是否是新商城
const isNewShop = computed(() => !schemaStore.id);

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

// 需要前往商城页面
let needToGoToShopPage = false;
const goToShopPage = () => {
  needToGoToShopPage = false;
  router.push('/shop');
};

// 点击页面保存按钮
const handleClickSave = () => {
  // 若为新商城
  if(isNewShop.value) {
    showConfirmDialog({
      title: '提示',
      message:'当前编辑信息未绑定商城，是否创建新商城?',
    })
      .then(() => {
        isVisible.value = true;
        needToGoToShopPage = true;
      })
      .catch(() => {});
    
    return;
  }

  // 非新商城直接保存
  updateShopSchema(schemaStore.id, schemaStore.schema).then(({ data }) => {
    if (!data || data.code !== StatusCode.Success) throw new Error(data.msg);
    showSuccessMessage(data.msg);
  });
  schemaStore.isSave = true;
};

// 确认保存
const handleSaveConfirm = async (formData: ShopInfo) => {
  const { data } = await createShop(formData, schemaStore.schema);
  if (!data || data.code !== StatusCode.Success) throw new Error(data.msg);
  showSuccessMessage(data.msg);
  schemaStore.reset();
  isVisible.value = false;
  // 编辑器页面前往商城页面
  if(needToGoToShopPage) {
    goToShopPage();
    return;
  }

  shopsStore.getMyShops();
};

// 发布商城
let isDeploying = false;
const deploy = () => {
  if(isDeploying) return;
  isDeploying = true;

  showConfirmDialog({
      title: '提示',
      message:'是否要部署当前商城',
  })
    .then(async () => {
      const { data } = await deployShop(shopsStore.selectShopId);
      if (!data || data.code !== StatusCode.Success) throw new Error(data.msg);
      showSuccessMessage(data.msg);
      shopsStore.getMyShops();
      isDeploying = false;
    })
    .catch(() => {});
};

// 处理预览
const handlePreview = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  console.log('test');
  console.log(realTimePreviewRef.value);
  realTimePreviewRef.value?.show();
}

</script>

<style scoped src="./index.scss"></style>