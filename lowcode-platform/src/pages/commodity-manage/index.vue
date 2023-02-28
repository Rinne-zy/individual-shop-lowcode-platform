<template>
  <div class="commodity-manage">
    <div class="commodity-manage-top">
      <!-- 搜索框 -->
      <el-input
        v-model="search"
        placeholder="搜索商品名称"
        class="input-with-select"
      >
        <template #prepend>
          <el-button><i class='iconfont icon-search'/></el-button>
        </template>
      </el-input>
      <!-- 操作按钮 -->
      <div>
        <el-button type="primary" @click=" isVisible = true">新增商品</el-button>
        <el-popconfirm 
            title="确定要删除选中的图片吗？"
            width="300"
            @confirm=""
          >
            <template #reference>
              <el-button type="danger">批量删除</el-button>
            </template>
        </el-popconfirm>
      </div>
    </div>
    <el-table
      ref="table"
      style="width: 100%;"
    >
    <el-table-column type="selection" width="65" />
      <el-table-column prop="name" label="商品名称" width="300" />
      <el-table-column prop="price" label="价格" width="200" />
      <el-table-column prop="sales" label="销量" width="200" />
      <el-table-column prop="stock" label="库存" width="200" />
      <el-table-column prop="status" label="状态" width="200" />
      <el-table-column prop="addTime" label="创建时间" width="200" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button 
            size="small"
            type="primary"
            @click=""
          >
            编辑
          </el-button>
          <el-popconfirm 
            title="确定要删除该商品吗？"
            width="300"
            @confirm=""
          >
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm> 
        </template>
      </el-table-column>
    </el-table>
    <create-commodity-dialog 
      :is-visible="isVisible"
      @cancel=" isVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ElTable, ElTableColumn, ElImage, ElButton, ElPopconfirm, ElInput } from 'element-plus';
import { ref } from 'vue';

import CreateCommodityDialog from 'lowcode-platform/components/create-commodity-dialog/index.vue';

// 搜索关键字
const search = ref('');
const isVisible = ref(false);
</script>

<style lang="scss" scoped src="./index.scss"></style>