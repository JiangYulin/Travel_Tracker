/**
 * Created by jiangyulin on 14-1-21.
 */
console.log("/travel/create.js loaded");
var flag = {
    "title":-1
}
$("#create_travel").click(function(event){
    event.preventDefault();
    if(flag.title == -1) {
        /*
        显示信息
         */
        showMessage({
            "title":"信息",
            "msg":  "请检查标题",
            "ms":   1000
        })
    }
    else {
        /*
        进行 ajax通讯
         */
        console.log("loadding...");
        var data;
        data = {
            "title":$("#travel-title").val(),
            "describe":$("#travel-describe").val()
        }
        /*
        调用提交函数，
        注意 函数参数格式
         */
        submit(data, function(response){
            /*
            response = {
                "status":0 or -1,
                "MSG":  message
            }
             */
            if(response.status == -1) {
                showMessage({
                    "title":"错误",
                    "msg":  response.MSG,
                    "ms":   1000 //信息显示时间，单位ms
                });
            }
            else {
                /*
                创建成功
                 */
                showMessage({
                    "title":"信息",
                    "msg":  response.MSG,
                    "ms":   1000
                });
                /*
                创建成功后的其他操作
                 */
            }
        })
    }
})

document.getElementById("travel-title").onblur = function() {
    showMessage({"title":"信息","msg":"焦点移除","ms":1000});
    if($("#travel-title").val() == "") {
        $("#travel-title").addClass("error");
        flag.title = -1;
    }
    else {
        $("#travel-title").removeClass("error");
        flag.title = 0;
    }
}

var xmlhttp;
/*
function: submit
参数:     data 表格内的信息。
         信息格式:
         {
            'title':title,
            'describe':describe(optional)
         }
 */
function submit(data, callback) {
    xmlhttp = new XMLHttpRequest();
    var title = data.title;
    var describe = data.describe;

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

    xmlhttp.open("POST", "/travel/create", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("title="+title+"&describe="+describe);
}