/**
 *
 * Created by jiangyulin on 14-5-10.
 */

window.onload = function() {
    window.onscroll = function() {
        if(window.pageYOffset > 98 ) {
            $("#travel_info").addClass("travel_info_fixed");
            $(".personal_operate").addClass("travel_info_fixed");
        }
        else if (window.pageYOffset <98) {
            $("#travel_info").removeClass("travel_info_fixed");
            $(".personal_operate").removeClass("travel_info_fixed");

        }
    }
}

/*
    评论功能函数
    class : btn-commit
    操作模块类 ： travel-img-comments-container

*/

$(".btn-commit").click(function(event) {
    event.preventDefault();
    var ele = $(this).closest(".travel-img-container").find(".travel-img-comments-container");
    if(ele.is(":visible")) {
        ele.hide();
        return ;
    };

    ele.show();

    /*
    取得评论内容，填充到元素内。
     */
    console.log(ele.closest(".travel-img-container")[0].id);

    $.ajax({
        type: "POST",
        url:"/"+ele.closest(".travel-img-container")[0].id+"/comments",
        context: ele.find(".travel-img-comments"),
        success: function(data) {
            console.log(data);
            var li_ele,
                span_ele,
                a_ele,
                p_ele;
            /*
            清除回复框中，已显示的所有内容，
            然后重新刷新
             */
            $(this)[0].innerHTML = "";
            for(var i= 0; i < data.length; i++) {
                console.log(data[i].contents);
                li_ele = document.createElement("li");
                span_ele = document.createElement("span");

                a_ele = document.createElement("a");
                p_ele    = document.createElement("p");

                $(li_ele).addClass("travel-img-comment");
                $(li_ele).attr("user_id",data[i].user_id);
                $(li_ele).attr("nick_name", data[i].nick_name);
                $(span_ele).addClass("username");
                $(p_ele).addClass("content");
                $(a_ele).addClass("btn-commit");
                $(a_ele).addClass("float-right");
                $(a_ele).addClass("reply-to-user");

                li_ele.appendChild(span_ele);
                if(data[i].to_user_id) {
                    /*
                    如果存在，那么就是对用户的回复
                     */
                    var to_user_span = document.createElement("span");
                    to_user_span.innerHTML = data[i].to_user_nick_name;
                    $(to_user_span).addClass('username')
                    li_ele.appendChild(to_user_span);
                }

                span_ele.innerHTML = data[i].nick_name;


                p_ele.innerHTML = data[i].contents;
                a_ele.innerHTML = '回复';

                li_ele.appendChild(a_ele);
                li_ele.appendChild(p_ele);

                $(this)[0].appendChild(li_ele);
                /*
                li.travel-img-comment
                    span.username 小莫
                    p.content 你喜欢谈及他啊原来
                 */

            }
            /*
            绑定 这里面新添加的回复事件
             */
            reply_to_user();
        }
    })


    /*
    评论具体功能的实现，由另一个函数描述
     */
});

$(".btn-like").click(function(event) {
    if($(this).hasClass("btn-liked")) {
        $(this).removeClass("btn-liked");
    }
    else {
        $(this).addClass("btn-liked");
    }
})

$(".form-submit").click(function(event) {
    event.preventDefault();

    var form = $(this).closest(".travel-img-comment-form");
    var comment = form.find(".form-contents").val();
    /*
    判断输入为有效数据
     */
    if (comment.replace(/^\s+/,'').replace(/\s+$/,'') == "") {
        return false;
    }
    var data = new FormData(form[0]);
    $.ajax({
        type    : "POST",
        url     : "/"+form.closest('.travel-img-container')[0].id+"/reply",
        data    : data,
        context : form.closest(".travel-img-comments-container"),
        contentType: false,
        processData: false,
        success : function(data) {
            console.log(data);
            $(this).find(".travel-img-comment-form")[0].reset();
            var li = document.createElement("li");
            li_ele = document.createElement("li");
            span_ele = document.createElement("span");

            a_ele = document.createElement("a");
            p_ele    = document.createElement("p");

            $(li_ele).addClass("travel-img-comment");
            $(li_ele).attr("user_id",data.data.user_id);
            $(li_ele).attr("nick_name", data.data.nick_name);
            $(span_ele).addClass("username");
            $(p_ele).addClass("content");
            $(a_ele).addClass("btn-commit");
            $(a_ele).addClass("float-right");
            $(a_ele).addClass("reply-to-user");

            li_ele.appendChild(span_ele);
            if(data.data.to_user_id) {
                /*
                 如果存在，那么就是对用户的回复
                 */
                var to_user_span = document.createElement("span");
                to_user_span.innerHTML = data.data.to_user_nick_name;
                $(to_user_span).addClass('username')
                li_ele.appendChild(to_user_span);
            }

            span_ele.innerHTML = data.data.nick_name;


            p_ele.innerHTML = data.data.contents;
            a_ele.innerHTML = '回复';

            li_ele.appendChild(a_ele);
            li_ele.appendChild(p_ele);
            $(this).find(".travel-img-comments")[0].appendChild(li_ele);
            /*
            这里重新绑定了一次函数，有点多余。
             */
            reply_to_user();

        }
    })

})

function reply_to_user() {
$(".reply-to-user").click(function(event){
    console.log("ok");
    event.preventDefault();
    console.log($(this).closest('.travel-img-comment').attr('user_id'));
    var user_id = $(this).closest('.travel-img-comment').attr('user_id');
    var nick_name = $(this).closest('.travel-img-comment').attr('nick_name');
    var form = $(this).closest(".travel-img-comments-container").find(".travel-img-comment-form");
    form.find(".form-contents").attr('placeholder', '@'+nick_name);
    form.find(".form-contents").focus();
    form.find("input[name='to_user_id']").val(user_id);
    form.find("input[name='to_user_nick_name']").val(nick_name);

    var reply_user_item = form.find(".reply_name_item");
    reply_user_item.find("span")[0].innerHTML = nick_name;
    reply_user_item.show(200);

})
}

/*
删除已选择要回复的用户，

to do： 清除表单中的 user_id和nick_name项。


 */

$(".delete_user").click(function(event) {
    var form = $(this).closest(".travel-img-comment-form");
    form[0].reset();
    $(this).closest(".reply_name_item").hide(200);
    $(this).closest(".travel-img-comment-form").find("textarea").attr("placeholder","");
    $(this).closest(".travel-img-comment-form").find("input[name='to_user_id']").attr("value", "");
    $(this).closest(".travel-img-comment-form").find("input[name='to_user_nick_name']").attr("value", "");
})


/*
加载position 的地点名称

 */

function getPositonName() {
    var positions = $(".position");
    for(var i=0;i<positions.length;i++) {
        var loca_id = positions[i].getAttribute("location_id");
        $.ajax({
            type:"POST",
            url: "/location/name/"+loca_id,
            context: positions[i],
            success: function(data) {
                this.innerHTML = data.name;
            }
        })
    }
}

getPositonName();