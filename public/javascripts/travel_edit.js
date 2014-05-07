/**
 *
 * Created by jiangyulin on 14-5-4.
 */

console.log("travel_edit.js has loaded")

$("#addphoto").change(function(event) {
    event.preventDefault();
    var post_url = $("#travelID").val();
    var data = new FormData(document.forms.namedItem('upload'));
    var req = new XMLHttpRequest();
    req.open("POST", "/"+post_url+"/photo/upload", true);
    req.onreadystatechange = function() {
        if(req.readyState == 4 && req.status == 200) {
            console.log("200");
            console.log(req.responseText);
            var response = eval("("+req.responseText+")");
            var new_item = document.createElement('div');
            new_item.setAttribute('class','new_photo_container');
            console.log(req.responseText['photo_id']);
            new_item.innerHTML = '<img src="/data/'+response.photo_id+'" />';
            document.getElementById('data_container').appendChild(new_item);
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

  function delete_action(travel_id, photo_id){

      var req = new XMLHttpRequest();
      var url = '/'+travel_id+'/'+photo_id+'/delete';
      req.open('POST', url, true);
      req.send();
      req.onreadystatechange = function() {
          if(req.readyState == 4 && req.status == 200) {
              document.getElementById('data_container').removeChild(document.getElementById(photo_id));
          }
      }
    }
