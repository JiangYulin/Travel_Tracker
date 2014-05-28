/**
 *
 * Created by jiangyulin on 14-5-4.
 */

console.log("travel_upload.js has loaded")

$("#addphoto").change(function(event) {
    event.preventDefault();
    var travel_id = $("#travelID").val();
    var data = new FormData(document.forms.namedItem('upload'));
    var req = new XMLHttpRequest();
    req.open("POST", "/"+travel_id+"/photo/upload", true);
    req.onreadystatechange = function() {
        if(req.readyState == 4 && req.status == 200) {
            console.log("200");
            console.log(req.responseText);
            var response = eval("("+req.responseText+")");
            var new_item = document.createElement('div');
            new_item.setAttribute('class','new_photo_container');
            new_item.setAttribute('id', response.photo_id);
            new_item.setAttribute('onclick', 'show_edit_zone(this)')
            new_item.innerHTML = '<div class="delete_action" travel_id="'+travel_id+'" photo_id= "'+response.photo_id+'">X</div><img src="/data/'+response.thum_id+'" /><div class="describe_p"><p class="image_desc"></p></div>';
            document.getElementById('div_new_image').appendChild(new_item);
            /*
            为新添加的照片元素，绑定删除操作。
             */
            $(new_item).find('.delete_action').click(function(event) {
                event.stopPropagation();
                delete_action($(this).attr("travel_id"), $(this).attr("photo_id"));
            })
        }
    }
    req.send(data)
})

/*
页面 ： edit.jade
功能 ： 图片左上角，删除图标的实现函数。

主要应用ajax，

delete_action(photo_id)

photo_id为图片在数据库中的id，要向后台传递此参数。
 */
$(".delete_action").click(function(event) {
    event.stopPropagation();
    delete_action($(this).attr("travel_id"), $(this).attr("photo_id"));
})
  function delete_action(travel_id, photo_id){

      var req = new XMLHttpRequest();
      var url = '/'+travel_id+'/'+photo_id+'/delete';
      req.open('POST', url, true);
      req.send();
      req.onreadystatechange = function() {
          if(req.readyState == 4 && req.status == 200) {
              document.getElementById('div_new_image').removeChild(document.getElementById(photo_id));
          }
      }
    }

/*
页面： edit.jade
功能: 为图片添加描述

简介： 页面中已经写了一个组件，这个函数只要呼出那个div就可以。
        要判断鼠标点击的图片位置，方便确定div需要出现的位置。

主要应用：

示例：


 */




/*
图片简介 hover 显示效果
 */

function init_describe(){
    //先初始化，隐藏所有的简介
    var eles = $('.describe_p');
    for(var i= 0; i<eles.length; i++){
        $(eles[i]).css('margin-bottom',"-"+eles[i].clientHeight+"px");
        $(eles[i]).parent().mouseout(function(event) {
            var ele = $(this.getElementsByClassName('describe_p')[0]);
            console.log(ele[0].clientHeight);
            ele.css(
                {
                    'margin-bottom':"-"+ele[0].clientHeight+"px"
                }
            );
        })

        $(eles[i]).parent().mouseover(function(event) {
            var ele = $(this.getElementsByClassName('describe_p')[0]);
            console.log(ele[0].clientHeight);
            ele.css(
                {
                    'margin-bottom':0
                }
            );
        })
    }
}



$("#upload_next").click(function(event) {
    event.preventDefault();
    var new_images = $(".new_photo_container");
    var data = new Array();
    for(var i = 0;i<new_images.length;i++) {
        data.push(new_images[i].id);
    }
    if(data.length > 0) {
        StandardPost($(this).attr("href"), {"data":data})
    }
    else {
        alert("没有图片");
    }

})

function StandardPost (url,args)
{
    var form = $("<form method='post'></form>");
    form.attr({"action":url});
    for (arg in args)
    {
        var input = $("<input type='hidden'>");
        input.attr({"name":arg});
        input.val(args[arg]);
        form.append(input);
    }
    form.submit();
}