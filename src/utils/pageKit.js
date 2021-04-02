// 分页查询工具类, 提供常用方法

import netKit from "@/utils/netKit";

/**
 * 分页查询
 * @param state
 * @param url 请求的 url
 * @param params
 * @param isAppend 是否在已有列表后添加数据
 */
export const fetchPage = (state, url, params = {}, isAppend) => {
  if (state.finished) {
    return;
  }
  state.finished = true;
  state.loading = true;
  state.refreshing = true;
  netKit.post(url, params).then(data => {
    const {records, current, pages} = data;
    // 列表
    if (isAppend) {
      records.forEach(item => {
        state.list.push(item);
      })
    } else {
      state.list = records;
    }
    state.pagination.current = current;
    state.pagination.pages = pages;
    state.checked = [];
  }).finally(() => {
    state.loading = false;
    state.refreshing = false;
    state.finished = state.pagination.current >= state.pagination.pages;
  });
}

export const onSearch = (state, url, params = {}) => {
  fetchPage(state, url, {current: 1, ...params});
}

/**
 * 下一页
 * @param state state
 * @param url
 * @param params 查询参数
 */
export const nextPage = (state, url, params = {}) => {
  fetchPage(state, url, {current: state.pagination.current + 1, ...params}, true);
}


export const onUpdateSearch = (state, url, params) => {
  // 函数防抖
  if (state.updateSearchId) {
    clearTimeout(state.updateSearchId);
  }
  state.updateSearchId = setTimeout(() => {
    onSearch(state, params);
  }, 1000);
}

export const baseState = {
  params: {},
  list: [],
  pagination: {
    current: 0,
    pages: 0,
    size: 10
  },
  refreshing: false,
  loading: false,
  finished: false,
  updateSearchId: 0,
}

export default {fetchPage, onSearch, onUpdateSearch, nextPage, baseState};
