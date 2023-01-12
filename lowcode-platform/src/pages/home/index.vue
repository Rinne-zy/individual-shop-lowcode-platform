<template>
  <div class="home">
    <el-container>
        <!-- 侧边栏 -->
        <el-aside class="home-aside" width="200px">
          <div class="home-aside-top">顶部</div>
          <el-menu default-active="shop" router>
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
            <template v-if="activeMenuItem.value === 'shop'">
              <el-button type="primary"><i class='iconfont icon-phone' />一键部署</el-button>
            </template>
            <template v-if="activeMenuItem.value === 'construction'">
              <el-button type="primary"><i class='iconfont icon-phone' />实时预览</el-button>
              <el-button type="primary"><i class='iconfont icon-save' />保存页面</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElContainer, ElAside, ElHeader, ElMain, ElMenu, ElMenuItem, ElButton } from 'element-plus';

import { useMenuStore } from 'lowcode-platform/store/menu-store';
import { useUserStore } from 'lowcode-platform/store/user-store';

// 用户信息 store
const userStore = useUserStore();

// 菜单信息
const { menu } = useMenuStore();

//已激活的菜单项
const activeMenuItemIndex = ref(0);
const activeMenuItem = computed(() => menu[activeMenuItemIndex.value]);

</script>

<style scoped src="./index.scss"></style>