/**
 * Created by jiangyulin on 13-12-26.
 */

console.log("login.js loaded");
$('#submit').click(function(event){
    event.preventDefault();
    var username = $("#username").val();
    if(username) {
        var password = $("#password").val();
        if(password) { //向服务器请求数据
            verifiedPassword(username, password,function(response){ //这个函数是登录成功后执行的
                //do something
                if(response.status == 0) {
                    showMessage({title:"登录成功",msg:"准备跳转",ms:1000});
                    setTimeout(function(){window.location.href = $("#request_url").val();},1000)
                }
                else
                    showMessage({title:"出现错误", msg:response.MSG, ms:1000});
            });
        }
        else { //密码为空
            displayError("password");
        }
    }
    else {  //用户名为空
        displayError("username");
    }

});


function displayError(id,err_message) {
    var ele = $("#"+id);
    if(ele) {
        ele.addClass("error");
    }
    else
        return false;
};

//define a global var for ajax
var xmlhttp;
function verifiedPassword(username,password,callback) {
    if(window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    xmlhttp.onreadystatechange = function() {
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200 ) {
            console.log(xmlhttp.responseText);
            var response = eval("("+xmlhttp.responseText+")");
            callback(response);
        }
        if(xmlhttp.readyState == 4 && xmlhttp.status != 200 ) {
            console.log(xmlhttp.status);
            return false;
        }

    }

    xmlhttp.open("POST", "/login", true);
    console.log(username+" "+ password);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send("username="+username+"&password="+password);
}
//加载按钮中的href链接
btn_href();