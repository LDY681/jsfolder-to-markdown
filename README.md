# 使用方法
安装依赖
npm install
运行
node ./docs.js

配置输入输出路径需按照POSIX格式
如果不填，输入路径默认当前目录，输出路径默认./docs

工具库js文件中需要:
```
标题和namespace,标题作为md的标题,namespace作为生成md的文件名
/**
 * 新手引导API
 * @namespace guide
*/
方法注释里记得要加@memberof namespace
/**
* 根据组件位置决定新手引导图片位置
* @param {Array} guides 需要显示的新手引导图片名列表
* @param {Array} options 选项
* @param {String} options.ref ref对象名(ref为空则默认新手引导显示在top: 0)
* @param {String} options.rect 新手指导图片显示在ref对象的哪个布局位置(默认bottom)
* @param {Boolean} options.scroll 是否显示前先滚动到ref位置(默认false)
* @param {Number} options.offset 偏移量(默认0)
* @param {Function} callback 回调函数
* @memberof guide
*/
```
