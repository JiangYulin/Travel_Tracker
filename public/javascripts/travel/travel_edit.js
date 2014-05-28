/**
 * Created by jiangyulin on 14-5-25.
 */

$("#show_query_location").click(function(event) {
    event.preventDefault();
    $("#select_locations")[0].innerHTML = "";
    $("#background").show();
    $("#query_location_zone").show();
})

//$("#background").show();

$("#sub_location").click(function(event) {
    event.preventDefault();

    var form = $("#query_loca_form")[0];
    var form_data = new FormData(form);

    $.ajax({
        url : "/location/add",
        data: $("#query_loca_form").serialize(),
        type: "POST",
        success: function(data) {
            console.log(data);
        }

    })

})

$("#location_name")[0].oninput = function() {
    /*
     采用input方法，不考虑兼容性
     */
    var value = $(this).val();

    $.ajax({
        url: "/location/query",
        data: {
            "query_string": value
        },

        type:"POST",

        success: function(data) {

            console.log(data);

            $("#results")[0].innerHTML = "";
            $("#add_location_operat").hide();

            if(data != null && data.MSG == "success" && data.data.length != 0) {
                console.log("ok");
                results = data.data;
                var li,
                    span_location_name,
                    span_city_name,
                    span_country;

                for(var i = 0;i<results.length; i++) {
                    li = document.createElement("li");
                    span_location_name = document.createElement("span");
                    span_city_name = document.createElement("span");
                    span_country = document.createElement("span");

                    $(span_location_name).addClass("location_name");
                    $(span_city_name).addClass("city_name");
                    $(span_country).addClass("country_name");

                    $(li).addClass("location_item");
                    $(li).attr("location_id", results[i]._id);
                    /*
                     为li绑定点击事件，点击后会把li添加到下面已选表单中

                     */
                    $(li).click(function(event) {
                        event.preventDefault();
                        add_item_to_selected(this);
                    })

                    li.appendChild(span_location_name);
                    li.appendChild(span_city_name);
                    li.appendChild(span_country);

                    span_location_name.innerHTML = results[i].location_name;

                    $("#results")[0].appendChild(li);
                }
            }

            $("#add_location_operat").show();
        }
    })
};

/*
 当你点击location_item类时，地点元素会被添加到表单中

 li location_id="location_id"
 span
 span
 span

 ele 即为li
 */

function add_item_to_selected(ele) {
    var item = $("#select_locations").find("li[location_id='"+$(ele).attr('location_id')+"']");
    if(item.length == 0) {
        $(ele).hide();
        $("#select_locations")[0].appendChild(ele);
        $(ele).show(200);
        $("#select_complete_btn").show();
    }
    else {
        /*
         对item 进行操作
         */
        console.log("has added");
    }
}

/*
 功能：  动态显示出添加地点的表单
 */
$("#add_location_operat").click(function(event) {
    console.log("show add location form");

    $("#add_location_zone").show();
    $("#query_location_zone").animate({
            "margin-left": "-440px",
            "opacity"    : 0
        },{
            speed:  1000,
            easing: "swing",
            step: function(now, mx) {
                console.log(now);
                if(now < 0) {
                    $("#add_location_zone").css("left",((now/4)+150)+"%");
                }
                else {

                    $("#add_location_zone").css("opacity", 1-now);
                }
            },
            complete: function() {
                $(this).hide();
            }
        }
    );
});

$("#add_loca_form_btn").click(function(event) {
    event.preventDefault();

    var form = new FormData($("#add_loca_form")[0]);

    $.ajax( {
        type: "POST",
        url: "/location/add",
        processData: false,
        contentType: false,
        data: form,
        success: function(data) {
            console.log(data);

            /*
             成功，隐藏表单，并把添加的元素的信息，插入到选中的表格中
             */

            if(data.MSG == "success") {
                $("#query_location_zone").show();
                $("#query_location_zone").animate({
                    "margin-left": "-200px",
                    "opacity": 1
                }, {
                    speed:1000,
                    easing:"swing",
                    step : function(now, fx) {
                        if(now < 0) {
                            $("#add_location_zone").css("left",((now/4)+150)+"%");
                        }
                        else {

                            $("#add_location_zone").css("opacity", 1-now);
                        }
                    },
                    complete : function() {
                        $("#add_location_zone").hide();
                        $("#add_loca_form")[0].reset();
                    }
                })
            }
        }
    })
})

$("#select_complete_btn").click(function(event) {
    /*
     把这个列表中的所有地点id 传送到后台
     地点id 存在于 location_item 类中的 location_id中

     */

    $("#query_location_zone").hide();
    $("#background").hide();
    var container = $("#select_locations");

    var eles = container.find(".location_item");

    var locations = new Array();
    var temp = {};
    for(var i = 0;i<eles.length;i++) {

        temp["location_id"] = $(eles[i]).attr("location_id");
        temp["location_name"] = $(eles[i]).find(".location_name").text();
        temp["city"] = $(eles[i]).find(".city_name").text();

        locations.push(temp);
        temp = {};
    }

    console.log(locations);
    /*
     更新页面数据
     */

    var div_location,
        div_loca_img,
        div_loca_title,
        span_loca_span;
    var location_container = $("._location_container");

    for(var i=0;i< locations.length;i++) {

        if(location_container.find(".location[location_id='"+locations[i].location_id+"']").length > 0)
        {
            continue;
        }
        /*
         建立元素并添加到页面中
         */
        div_location = document.createElement("div");
        div_loca_img = document.createElement("div");
        div_loca_title = document.createElement("div");
        span_loca_span = document.createElement("span");

        $(div_location).addClass("location");
        $(div_loca_img).addClass("loca_img")
        $(div_loca_title).addClass("loca_title");
        $(span_loca_span).addClass("loca_span");

        $(span_loca_span).text(locations[i].location_name);

        $(div_location).attr("location_id", locations[i].location_id);

        $(div_loca_img).attr("data-count",0);
        div_location.appendChild(div_loca_img);
        div_location.appendChild(div_loca_title);

        div_loca_title.appendChild(span_loca_span);

        location_container[0].appendChild(div_location);

    }
    /*
     清空已选择的，防止再次添加的时候，列表有残留
     */

    location_drop_listener();

})


var allimages = document.querySelectorAll("img");

[].forEach.call(allimages, function(img){
    makeUnselectable(img);
});
/*
 令元素无法拖动
 */
function makeUnselectable(target) {

    $(target).addClass( 'unselectable' ) // css 中已经定义好了
    $(target).attr( 'unselectable', 'on' ) //兼容ie9
    $(target).attr( 'draggable', 'false' ) // webkit moz 兼容
    $(target).on( 'dragstart', function() { return false; } );  // firefox 兼容
};

$(".new_photo_container").attr("draggable", true);

var pictures = document.querySelectorAll(".new_photo_container");

[].forEach.call(pictures, function(picture) {
    picture.addEventListener("dragstart", handleDragStart, false);
    picture.addEventListener("dragend", handleDragEnd, false);



})

function handleDragStart(ev) {

    $(this).addClass("ondrag");
    console.log(ev.target.id);
    ev.dataTransfer.setData("id",ev.target.id);
}

function handleDragEnd(ev) {
    $(this).removeClass("ondrag");
    console.log("end run");

}


/*
 为location类添加 drop监听事件
 */
function location_drop_listener() {
    var locations = document.querySelectorAll(".loca_img");
    [].forEach.call(locations, function(location) {
        location.addEventListener('dragover', locationHandleDragOver, false);
        location.addEventListener('drop', locationHandleDrop, false);
    })
}

function locationHandleDragOver(e) {
    e.preventDefault();

}
var depart = {};

function locationHandleDrop(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    var now = $(ev.target).attr("data-count");

    /*
     判断是否已在列表中
     */

    var photo_id = ev.dataTransfer.getData("id")

    if($(ev.target).closest(".location").find("input[value='"+photo_id+"']").length > 0) {
        console.log("获取结果大于0");
        return false;
    }
    now++;
    $(ev.target).attr("data-count",now);
    ev.target.innerText = now;
    /*
     把这个图片的ID添加到这个地点的dom中
     */
    var new_input = document.createElement("input");
    /*
     传递的id为数据库中的photo_id
     */
    new_input.setAttribute("value",(ev.dataTransfer.getData("id")));
    new_input.name = now;
    new_input.setAttribute("hidden","hidden");
    ev.target.parentNode.appendChild(new_input);

    console.log("drop run");
    /*
     在开始拖动时，为被拖动元素增加了 ondrag 类，
     所以我们可以用这个类 来定位
     */

    console.log($(ev.target).closest(".location").find(".loca_span").text());

    $(".ondrag").find(".position")[0].innerHTML = $(ev.target).closest(".location").find(".loca_span").text();
    $(".ondrag").find(".position_container").removeClass("hide");

    /*
     检查location_id 是否存在，
     如果存在： 需要在添加了这个图片的location 中一处这个图片，
     如果不存在： 则只要把target的location_id添加进去即可
     */
    var position = $(".ondrag").find(".position");
    console.log(position.attr("location_id"));
    if(position.attr("location_id") != undefined ) {
        var temp_location = $(".location[location_id='"+position.attr("location_id")+"']");
        var remove_input = temp_location.find("input[value='"+ev.dataTransfer.getData("id")+"']");
        temp_location[0].removeChild(remove_input[0]);
        var data_count = temp_location.find(".loca_img").attr("data-count");
        console.log(data_count);
        data_count -= 1;
        console.log(data_count);
        temp_location.find(".loca_img").attr("data-count", data_count);
        temp_location.find(".loca_img")[0].innerHTML = data_count;
    }
    position.attr("location_id", $(ev.target).closest(".location").attr("location_id"));

    console.log("运行结束");
}
/*
 删除已添加的地点
 */

$(".delete_position").click(function(event) {
    event.preventDefault();
    event.stopPropagation();
    //待操作的元素
    var container = $(this).closest(".position_container");
    var photo_id = container.closest(".new_photo_container").attr("id");//操作的照片的ID
    var pos_ele = container.find(".position");//显示位置的元素
    container.addClass("hide");
    var location_id = pos_ele.attr("location_id");
    var location_ele = $(".location[location_id='"+location_id+"']"); //地点元素

    var input_ele = location_ele.find("input[value='"+photo_id+"']"); //在地点元素中存储的照片id
    location_ele[0].removeChild(input_ele[0]);
    var loca_img = location_ele.find(".loca_img");
    var count = loca_img.attr("data-count");
    count -=1;
    loca_img.attr("data-count",count);
    loca_img[0].innerHTML = count;
    pos_ele.removeAttr("location_id");
    pos_ele[0].innerHTML = "";



})


/*
 地点整理结束后，把数据传送到后台

 */

$("#submit_all").click(function(event) {
    event.preventDefault();
    var locations = $("._location_container").find(".location");
    var data = {};
    for(var i = 0; i< locations.length; i++) {
        var inputs = $(locations[i]).find("input");
        var location_id = $(locations[i]).attr("location_id");
        data[location_id] = new Array();
        console.log(inputs);
        for(var j=0;j<inputs.length;j++) {
            data[location_id].push(inputs[j].value);
        }
    }
    /*
     data数据格式:
     data {
     "location_id": [photo_id,photo_id...]
     }
     */
    console.log(data);

    $.ajax({
            type:"POST",
            url: "/location/match",
            data: {
                "data" : data
            },
            success : function(data) {
                console.log(data);
                if(data.status == 0) {
                    window.location.href = "/travel/show/"+$("#travelID").val();
                }
            }
        }
    )

})

function show_edit_zone(ele) {
    console.log(ele.offsetLeft);
    console.log(ele.offsetTop);
    $("#edit_zone").css('left',ele.offsetLeft+ele.clientWidth+50);
    $("#edit_zone").css('top',ele.offsetTop);
    $("#edit_form")[0].reset();
    $("#edit_zone").show();
    $("#desc").focus();
    /*
     ele.id 同时也就是 photo_id
     */
    $('#edit_form_id').val(ele.id);

}

/*
 功能： 提交修改的文字， submit 提交按钮所关联的函数


 */
$("#submit").click(function(event){
    event.preventDefault();
    $("#edit_zone").hide();
    /*
     取得表单元素内容
     */
    $.ajax({
        cache:      true,
        type:       "POST",
        /*
         edit_form_id 就是photo_id , 同时也是被添加说明的图片的container的id
         */
        url:        '/'+$('#edit_form_id').val()+'/detail',
        data:       $('#edit_form').serialize(),
        async:      false,
        context:    $(document.getElementById($('#edit_form_id').val())),
        success:    function(data){
            /*
             回调函数
             WARRING: IF THERE IS NOT A RESPONSE FROM SERVER,THE CLIENT WILL BE BLOCKED.
             */
            $(this).find('.image_desc')[0].innerHTML = data.describe;

        }
    });

});


/*
 功能:关闭按钮所关联的函数

 */

$("#close").click(function(event){
    event.preventDefault();
    $("#edit_zone").hide();
})

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