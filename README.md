# 图标
https://www.iconfont.cn 找图标

# 研发准备
1. SystemConfig.js中切换研发部署环境的URL
2. 构建命令是 npm run build
3. 启动研发命令是 npm run dev

# 研发须知
1. 所有的新增、修改页面都要标识 nocache，并且隐藏左侧导航
2. 页面结构：一级为导航、二级为为页面，来实现keepalive
3. activated\created\route.params组合使用实现keepalive的页面跳转后刷新
4. 弹窗添加、修改数据后，请手动刷新,不可以用go(0)刷新
5. route必须定义name,组件必须写name，route对应的组件的name必须相同
6. 因为 2 导致的面包屑仅有两级的问题先不考虑