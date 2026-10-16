import request from '@/utils/request'
//获取验证码
export const getcode = (data) => {
  return request.post('/get/code', data)
}
//注册账号
export const userAuthentication = (data) => {
  return request.post('/user/authentication', data)
}
//登录账号
export const Login = (data) => {
  return request.post('/login', data)
}

//账号管理列表
export const authAdminList = (params) => {
  return request.get('https://v3pz.itndedu.com/v3pz/auth/admin', { params })
}

//获取菜单权限数据
export const meauAdminList = () => {
  return request.get('https://v3pz.itndedu.com/v3pz/user/getmenu')
}

//权限修改
export const usersetmeau = (data) => {
  return request.post('https://v3pz.itndedu.com/v3pz/user/setmenu', data)
}

//获取菜单权限列表
export const getmeauAdminList = (params) => {
  return request.get('https://v3pz.itndedu.com/v3pz/menu/list', { params })
}

//获取账号管理弹窗中的下拉菜单权限
export const getAdminmeauselected = (params) => {
  return request.get('https://v3pz.itndedu.com/v3pz/menu/selectlist', { params })
}

//账号管理用户数据更新
export const userDataUpdate = (data) => {
  return request.post('https://v3pz.itndedu.com/v3pz/update/user', data)
}

//获取用户菜单权限
export const getmUserMeauPermissionData = () => {
  return request.get('https://v3pz.itndedu.com/v3pz/menu/permissions')
}

//获取陪护师头像
export const photoList = () => {
  return request.get('https://v3pz.itndedu.com/v3pz/photo/list')
}

//陪护师创建
export const setcompanion = (data) => {
  return request.post('https://v3pz.itndedu.com/v3pz/companion', data)
}

//获取陪护师列表
export const getcompanionList = (params) => {
  return request.get('https://v3pz.itndedu.com/v3pz/companion/list', { params })
}

//删除陪护师
export const deletecompanionList = (data) => {
  return request.post('https://v3pz.itndedu.com/v3pz/delete/companion', data)
}

//获取订单列表
export const getorderlistdata = (params) => {
  return request.get('https://v3pz.itndedu.com/v3pz/admin/order', { params })
}

//确认服务状态
export const updatastate = (data) => {
  return request.post('https://v3pz.itndedu.com/v3pz/update/order', data)
}

//获取首页报表
export const report = () => {
  return request.get('https://v3pz.itndedu.com/v3pz/report')
}
