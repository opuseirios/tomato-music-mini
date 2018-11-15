# tomato-music

**建议直接扫码体验！**


![图片预览](https://github.com/opuseirios/tomato-music-mini/blob/master/Screenshots/code.png)

👉 项目演示地址:  http://47.99.46.179
(PC端请在浏览器的移动模式下查看)

### 实现的功能
1.音乐播放、暂停、上一曲、下一曲
2.切换播放模式，顺序播放、单曲循环、随机播放
3.热门歌单、歌手列表、排行榜
4.歌词显示
5.热门搜索、搜索歌手、歌曲
6.记录搜索历史，播放历史
7.收藏歌曲

## 截图


### 推荐
![推荐](https://github.com/opuseirios/tomato-music-mini/blob/master/Screenshots/recommend.png)
![推荐榜单](https://github.com/opuseirios/tomato-music-mini/blob/master/Screenshots/disc.png)

### 歌手
![歌手](https://github.com/opuseirios/tomato-music-mini/blob/master/Screenshots/singer.png)
![歌手详情页](https://github.com/opuseirios/tomato-music-mini/blob/master/Screenshots/singerDetail.png)

### 排行榜
![排行](https://github.com/opuseirios/tomato-music-mini/blob/master/Screenshots/rank.png)

### 搜索
![搜索1](https://github.com/opuseirios/tomato-music-mini/blob/master/Screenshots/search1.png)
![搜索2](https://github.com/opuseirios/tomato-music-mini/blob/master/Screenshots/search2.png)

### 播放器
![播放器](https://github.com/opuseirios/tomato-music-mini/blob/master/Screenshots/player.png)
![歌词](https://github.com/opuseirios/tomato-music-mini/blob/master/Screenshots/lyric.png)

### 播放列表
![播放列表](https://github.com/opuseirios/tomato-music-mini/blob/master/Screenshots/playlist.png)



## 技术栈


【前端】

- `Vue`：用于构建用户界面的 MVVM 框架。它的核心是**响应的数据绑定**和**组系统件**
- `vue-router`：为单页面应用提供的路由系统，项目上线前使用了 `Lazy Loading Routes` 技术来实现异步加载优化性能
- `vuex`：Vue 集中状态管理，在多个组件共享某些状态时非常便捷
- `vue-lazyload`：第三方图片懒加载库，优化页面加载速度
- `vux`：基于 WeUI 和 Vue.js 的 移动端 UI 组件库,提供丰富的组件满足移动端(微信)页面常用业务需求
- `better-scroll`：iscroll 的优化版，使移动端滑动体验更加流畅
- `stylus and less`：css 预编译处理器
- `ES6`：ECMAScript 新一代语法，模块化、解构赋值、Promise、Class 等方法非常好用

【后端】

- `Node.js`：利用 Express代理后端请求，抓取 QQ音乐数据
- `jsonp`：服务端通讯。抓取 QQ音乐数据
- `axios`：服务端通讯。
- `nginx`：搭建服务器，利用反向代理，将请求发送到Express上

【其他】

此应用的全部数据来自 QQ音乐

全局通用的应用级状态使用 `vuex` 集中管理

全局引入 `fastclick` 库，消除 click 移动浏览器300ms延迟

页面是响应式的，适配常见的移动端屏幕，采用 `flex` 布局


## 收获

1.总结了一套 Vue 通用组件，可以在其它项目中复用的 15+ 个基础组件、25+ 个业务组件
2.总结了一套常用的`JS`工具函数库，以及`sass mixin`库
3.体会到组件化、模块化开发带俩的便捷
4.熟悉了vuex，vue-router在复杂的页面中的使用


## Build Setup

``` bash
# 下载或克隆下来，然后安装依赖
npm install

# 开发预览
npm run dev

# 打包发布，生成的文件在dist文件夹中
npm run build
```
