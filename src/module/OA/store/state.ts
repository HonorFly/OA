interface StateType {
  count : Number,
  states : String,
  API_HOST : Object,
  
}

// 下面是在state中定义的数据，尽量使用变量声明

let state : StateType = {
  count: 1,
  states: "", //*控制路由返回 turn-on 打开新页面 turn-off 关闭页面
  API_HOST: process.env.API_HOST,
  
};
export default state
