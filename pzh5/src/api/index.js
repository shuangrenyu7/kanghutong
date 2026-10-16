import request from "../utils/request";

export default {
  login(data) {
    return request.post("https://v3pz.itndedu.com/v3pz/login", data);
  },
  index() {
    return request.get("https://v3pz.itndedu.com/v3pz/Index/index");
  },
  //获取创建订单的页面详情
  getorderdetails() {
    return request.get("https://v3pz.itndedu.com/v3pz/h5/companion");
  },
  //创建订单
  createorder(data) {
    return request.post("https://v3pz.itndedu.com/v3pz/createOrder", data);
  },
  //获取订单列表内容
  getorderlist(params) {
    return request.get("https://v3pz.itndedu.com/v3pz/order/list", { params });
  },
  //获取订单详情
  getorderdetail(params) {
    return request.get("https://v3pz.itndedu.com/v3pz/order/detail", {
      params,
    });
  },
};
