1.联系售后修改ms服务器配置文件：
   a.登录局点ms服务器，找到/mnt/syncdata/svconfig/msconf/路径下的 mpsyscfg.ini文件
   b.修改如下两个参数：
     FwdNatAddr=192.169.15.68  填写MS的IP地址，如果有NAT要填写其公网IP
     FwdNatPort=20008  填写 20000 - 30000之间任意数字即可
   c.修改完成后，需重启ms服务器； 重启命令： msserver.sh restart

2. Demo使用
   a.请起动一个localhost来运行Demo，双击Demo.html的运行方式无效；
   b.请参考Demo最下方的script标签，在src属性中引入对应VM版本的imosSdk.min.js文件；
	例如：<script type="text/javascript" src="http://VMIP:7010/static/imosSdk.min.js"></script>
      或可将该文件下载到本地，然后加载（需保证本地文件和服务器上文件版本一致，否则会导致接口调用失败）；
   c.修改imosSdk.init()方法中第4个参数，即imosSdk.html文件的路径（B3339及之后版本可不传该参数）；
      如：第三方开发网页为http://208.208.200.220:100/demo.html，我司服务器为http://207.207.200.210；
      若将imosSdk.html放在 http://208.208.200.220:100/unv/imosSdk.html路径下，则在调用imosSdk.init接口中传入'/unv/imosSdk.html'。
   d.做好前期准备工作后，请先进行登录；如果提示登录超时或者错误，请先检查imosSdk.init()方法中imosSdk.html文件路径是否正确。