/**
 * Created by jiangyulin on 14-1-7.
 */
    console.log("register.js loaded");
    var submit_button = document.getElementById("register");
    var flag = {    //为了验证表单提交
        "username" : -1,
        "password" : -1,
        "re_password" : -1,
        "email" : -1
    };
    //定义提交后的操作
    submit_button.onclick = function() {
        if(flag.username==0 && flag.email == 0 && flag.password ==0 && flag.re_password == 0)
            register(username.value,password.value,email.value,function(response) {
                console.log(response.status);
                //如果注册成功
                if(response.status == 0) {
                    showMessage({
                        title : "通知",
                        msg   : response.MSG,
                        ms:1000
                    });
                    //跳转等操作






                }
                else {
                    showMessage({title:"错误",msg:response.MSG,ms:1000});
                }
            })
        return false;
    }
    var xmlhttp_register = false;
    function register(username, password, email, callback) {
        xmlhttp_register = new XMLHttpRequest();
        xmlhttp_register.onreadystatechange = function() {
            if(xmlhttp_register.readyState == 4 && xmlhttp_register.status == 200 ) {
                console.log(xmlhttp_register.responseText);
                //解析json要用eval函数，如下用法，否则容出现错误提示;
                var response = eval("(" + xmlhttp_register.responseText + ")");
                callback(response);
            }
            if(xmlhttp_register.readyState == 4 && xmlhttp_register.status != 200 ) {
                console.log(xmlhttp_register.status);
                showMessage({
                    title:"错误",
                    msg  :"前端代码未更新",
                    ms   :1000
                })
                return false;
            }
        }
        xmlhttp_register.open("POST", "/register", true);
        xmlhttp_register.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp_register.send("username="+username+"&password="+md5(password)+"&email="+email);
    }
    //用户名验证，是否唯一
    var username = document.getElementById("username");
    username.onblur  = function() {
        console.log("username onblur run");
        _username = this.value;
        is_name_unique(_username,function(response) {
            //如果用户名唯一，进行的操作
            if(response.status == 0) {
                $("#username").removeClass("error");
                flag.username = 0;
            }
            else if (response.status == -1) {
                $("#username").addClass("error");
                showMessage({title:"用户名", msg:"已存在的用户名", ms:1000});
                flag.username = -1;
            }
        });
    }

//密码校验
    var password = document.getElementById("password");
    console.log("register.js run");
    var re_password = document.getElementById("re-password");
    password.onblur = function() {
            flag.re_password = -1;
            if(this.value.length >= 6) {
                console.log("密码长度符合");
                if(re_password.value.length != 0)   //当重新修改第一行密码时，进行两个密码校验
                    re_password.onblur();
                flag.password = 0;
                $("#password").removeClass("error");
            }
            else {
                $("#password").addClass("error");
                showMessage({title: "错误", msg: "密码最小长度为6", ms: 1000});
                flag.password = -1;
            }
        }
    re_password.onblur = function() {
        if(this.value !== password.value) {
            $("#re-password").addClass("error");
            showMessage({title:"检查", msg:"两次密码输入不符", ms: 1000});
            flag.re_password = -1;
        }
        else {
            $("#re-password").removeClass("error");
            flag.re_password = 0;
        }
    }

//email 校验
    var email = document.getElementById("email");
    email.onblur = function() {
        flag.email = 0;
    }

    var xmlhttp;
    function is_name_unique(username, callback) {
        xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function() {
            if(xmlhttp.readyState == 4 && xmlhttp.status == 200 ) {
                console.log(xmlhttp.responseText);
                //解析json要用eval函数，如下用法，否则容出现错误提示;
                var response = eval("(" + xmlhttp.responseText + ")");
                //alert(response.MSG);
                callback(response);
            }
            if(xmlhttp.readyState == 4 && xmlhttp.status != 200 ) {
                console.log(xmlhttp.status);
                return false;
            }
        }

        xmlhttp.open("POST", "/verify", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("username="+username);
    }