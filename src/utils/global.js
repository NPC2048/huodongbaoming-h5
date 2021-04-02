export const DEFAULT_MENU_LIST = [{
  name: '活动',
  icon: 'friends-o',
  path: '/activityList'
}, {
  name: '发布',
  icon: 'plus',
  path: '/publish'
}, {
  name: '我的',
  icon: 'home-o',
  path: '/userinfo'
}];

// 活动状态 tab 页数据
export const ACTIVITY_STATUS_TABS = [{
  title: '全部',
  name: 'all',
  status: '',
}, {
  title: '通过',
  name: 'pass',
  status: '1'
}, {
  title: '未过审',
  name: 'refuse',
  status: '2',
}, {
  title: '已过期',
  name: 'beOverdue',
  status: '3'
}, {
  title: '已完成',
  name: 'finish',
  status: '4',
}, {
  title: '进行中',
  name: 'haveInHand',
  status: '5'
}];
