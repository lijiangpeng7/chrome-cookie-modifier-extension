# chrome-cookie-modifier-extension
## 谷歌浏览器携带cookie
谷歌浏览器中，本地启动的http项目，访问https的接口时，cookie不会携带。本插件可以解决这个问题。

## 解决原理
在cookie发生改变的时候，将secure设置为true, sameSite设置为"no_restriction"