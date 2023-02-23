import { useComponentsMaterialStore } from '../store/material-store';

/** 初始化组件物料 store */
export function initComponentsMaterialStore() {
  const componentsMaterialStore = useComponentsMaterialStore();
  // 初始化物料 store
  componentsMaterialStore.init();
  return componentsMaterialStore;
}