## info-vue
- info-vue基于vue、element-ui构建开发，实现后台管理前端功能，提供一套更优的前端解决方案
- 前后端分离，通过token进行数据交互，可独立部署
- 主题定制，通过scss变量统一一站式定制
- 动态菜单，通过菜单管理统一管理访问路由
- 发布时，可动态配置CDN静态资源／切换新旧版本

## 说明文档

项目初始化
cnpm i

项目开发启动
cnpm run dev

项目打包
cnpm run build --dev  开发环境.
cnpm run build --qa   测试环境.
cnpm run build --prod 生产环境.


## 更新日志
每个版本的详细更改都记录在[release notes](https://github.com/daxiongYang/renren-fast-vue/releases)中。

## 启动报错解决方案
```bash
  rm -rf node_modules
  cnpm cache verify
  cnpm i
  rm -rf node_modules/_prettier@1.13.0@prettier
  cnpm install --save-dev prettier@1.12.0
```