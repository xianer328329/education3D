  window.onload = function () {
        setLayout();
      	setToolVisible();
        LoginPlat();
    };

    function LoginPlat() {
        $.ajax({
            type: "get",
            url: "/home/systemInfo",
            success: function (data) {
                if (data.code=="0") {
                    var data=data.unitInfo;
                    var IP=data.videoPlatformIp;//视频服务器Ip地址
                    var port =data.videoPlatformPort;//端口号
                    var UserName = data.videoPlatformName;//视频系统用户名
                    var Password = data.videoPlatformPassword;//视频系统登录密码
                    var v="<?xml version=\"1.0\" encoding=\"utf-8\"?><LoginInfo><LoginType>2</LoginType><IP>" + IP + "</IP><Port>" + port
        			+ "</Port><UserName>" + UserName + "</UserName><Password>" + Password + "</Password></LoginInfo>";
                    var v1 = preview5.LoginPlat(v);
                    if (v1 != 0)
                        console.log("登录失败，请查看日志preview.log");
                }


            },
            error: function () {
            }
        });

    }


   
 
    //设置布局
    function setLayout() {
        preview5.SetLayoutType(1);
    }

    //隐藏工具栏
    function setToolVisible() {
        preview5.SetMainToolBarShow(0);
    }