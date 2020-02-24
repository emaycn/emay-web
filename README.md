# 项目说明
emay-web 是以 [vue-element-admin](http://172.16.11.138/component/open/vue-element-admin) 为基础搭建的基础web项目框架；
需要配合 [emay-service](http://172.16.11.138/component/future/emay-service) 一起启动；

# 研发准备
1. 项目初始化命令： npm install
2. 项目启动命令： npm run dev
3. 项目打包命令： npm build
4. .env.development 中配置开发环境变量
5. .env.production 中配置线上环境变量
6. 基础API地址 开发环境是 http://127.0.0.1:8081/api/ 线上环境是 /api/

# 开发须知
1. 页面结构：一级为导航、二级为为页面
2. activated\created\route.params组合使用实现keepalive的页面跳转后刷新
3. 弹窗添加、修改数据后，请手动刷新,不可以用go(0)刷新
4. route必须定义name,组件必须写name，route对应的组件的name必须相同
5. TODO 面包屑非多级暂时不用考虑

# 其他
1. 可以在 https://www.iconfont.cn 找图标
2. 打包后是纯静态文件，推荐试用nginx部署，可参照 nginx/nginx.conf 

# 进入系统
1. 管理端地址  http://127.0.0.1:8080
2. 客户端地址  http://127.0.0.1:8070
3. 管理段账号密码 admin/待定