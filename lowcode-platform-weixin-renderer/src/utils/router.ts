const base_url = '/pages/#page#/index'

// 路由配置
const routerConfig = {
  isTabBar: false,
  url: ''
}

/** 返回上一页 */
export function navigateBack() {
  if(!routerConfig.url) return;
  if(routerConfig.isTabBar) {
    uni.switchTab({
      url: base_url.replace('#page#', routerConfig.url)
    });

    return;
  };

  uni.redirectTo({
    url: base_url.replace('#page#', routerConfig.url)
  });
}

/**
 * 设置路由配置
 * @param url 路由地址
 * @param isTabBar 是否为 tabBar 页面
 */
export function setRouterConfig(url: string, isTabBar = false) {
  routerConfig.isTabBar = isTabBar;
  routerConfig.url = url;
}

/** 重置路由配置 */
export function resetRouterConfig() {
  routerConfig.isTabBar = false;
  routerConfig.url = '';
}

/**
 * 关闭当前页面转调至 tabBar 页
 * @param url 
 */
export function switchTab(url: string) {
  uni.switchTab({
    url: base_url.replace('#page#', url)
  });
}

/**
 * 路由转跳，保留当前页面
 * @param url
 */
export function navigateTo(url: string) {
  uni.navigateTo({
    url: base_url.replace('#page#', url)
  })
}