# cookie + localStorage 保存用户信息
1、cookie过期后会跳到登录，没过期前数据可以在localStorage里面存着。
2、刷新浏览器时vuex的数据丢失，重新在localStorage里面拿。
3、cookie默认保存24小时，可以在view/base/Login.vue文件修改。
