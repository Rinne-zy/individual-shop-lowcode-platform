import { showSuccessToast, showFailToast } from 'vant';

import { FETCH_URL_PREFIX, LOCAL_STORAGE_KEY_OF_TOKEN } from 'lowcode-platform-common/common/index';
import type { AddressInfo, UserAddress } from 'lowcode-platform-common/type/address';
import { handleNotLogin } from 'lowcode-platform-h5-renderer/utils/login';

/**
 * 根据商城 id 获取商城 schema
 * @param id 商城 id
 * @returns 
 */
export async function getAddressInfo() {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY_OF_TOKEN) || '';

  const resp = await fetch(`${FETCH_URL_PREFIX}address/get`, {
    headers: {
      Authorization: token,
    }
  });

  if(resp.status !== 200 || !resp.ok) throw new Error('获取地址请求异常');
  const { code, msg, userAddress } = await resp.json();

  
  if(code) {
    handleNotLogin(code);
    showFailToast(msg);
    return;
  }

  return userAddress as UserAddress;
}

/**
 * 添加地址信息
 * @param addressInfo 新增的地址信息 
 * @returns 
 */
export async function addAddressInfo(addressInfo: AddressInfo) {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY_OF_TOKEN) || '';

  const resp = await fetch(`${FETCH_URL_PREFIX}address/add`, {
    method: 'post',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      address: addressInfo,
    })
  });

  if(resp.status !== 200 || !resp.ok) throw new Error('添加地址请求异常');

  const { code, msg } = await resp.json();

  if(code) {
    handleNotLogin(code);
    showFailToast(msg);
    return;
  }

  showSuccessToast(msg);
}

/**
 * 更新地址信息
 * @param id 用户地址记录 id
 * @param addressInfo 地址信息
 * @returns 
 */
export async function updateAddressInfo(id: string, addressInfo: AddressInfo) {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY_OF_TOKEN) || '';

  const resp = await fetch(`${FETCH_URL_PREFIX}address/update`, {
    method: 'post',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      address: addressInfo,
      _id: id,
    })
  });

  if(resp.status !== 200 || !resp.ok) throw new Error('添加地址请求异常');

  const { code, msg } = await resp.json();

  if(code) {
    handleNotLogin(code);
    showFailToast(msg);
    return;
  }

  showSuccessToast(msg);
}

/**
 * 删除地址信息
 * @param id 用户地址记录 id
 * @param addressInfoId 地址信息 id
 */
export async function deleteAddressInfo(id: string, addressInfoId: string) {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY_OF_TOKEN) || '';

  const resp = await fetch(`${FETCH_URL_PREFIX}address/delete`, {
    method: 'post',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      _id: id,
      addressInfoId,
    })
  });

  if(resp.status !== 200 || !resp.ok) throw new Error('删除地址请求异常');
  const { code, msg } = await resp.json();

  if(code) {
    handleNotLogin(code);
    showFailToast(msg);
    return;
  }

  showSuccessToast(msg);
};

/**
 * 修改选中地址信息
 * @param id 用户地址记录 id
 * @param addressInfoId 地址信息 id
 * @returns 
 */
export async function selectAddressInfo(id: string, addressInfoId: string) {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY_OF_TOKEN) || '';

  const resp = await fetch(`${FETCH_URL_PREFIX}address/select`, {
    method: 'post',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      _id: id,
      addressInfoId,
    })
  });

  if(resp.status !== 200 || !resp.ok) throw new Error('修改选中地址请求异常');
  const { code, msg } = await resp.json();
  
  if(code) {
    handleNotLogin(code);
    showFailToast(msg);
    return;
  }

  showSuccessToast(msg);
};

/**
 * 获取当前选中的地址信息
 * @returns 选中的地址信息
 */
export async function getSelectedAddressInfo() {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY_OF_TOKEN) || '';

  const resp = await fetch(`${FETCH_URL_PREFIX}address/getSelectedAddress`, {
    headers: {
      Authorization: token,
    }
  });

  if(resp.status !== 200 || !resp.ok) throw new Error('获取地址请求异常');
  const { code, msg, address } = await resp.json();

  if(code) {
    handleNotLogin(code);
    showFailToast(msg);
    return;
  }

  return address as AddressInfo;
}