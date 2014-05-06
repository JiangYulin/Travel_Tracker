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
            new_item.setAttribute('class','item');
            console.log(req.responseText['photo_id']);
            new_item.innerHTML = '<img src="/data/'+response.photo_id+'" />';
            document.getElementById('data_container').appendChild(new_item);
        }
    }
    req.send(data)
})

