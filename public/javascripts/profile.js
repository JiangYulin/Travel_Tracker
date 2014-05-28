/**
 * Created by jiangyulin on 14-5-13.
 */


    $(".make_edit").click(function(event){
        event.preventDefault();

        var inputs = $(this).closest("form").find("input");
        inputs.removeClass("info_no_edit");
        inputs.removeAttr("readonly");
        $(this).closest("form").find(".hide").show();
        $(this).hide();
    })


$("#save-btn").click(function(event) {
    event.preventDefault();

    var form = $("#change_detail");
    var data = new FormData(form[0]);
    $.ajax({
        type: "POST",
        url: "/user/profile/change",
        context: form,
        processData: false,
        contentType: false,
        data: data,
        success: function(data) {
            console.log(data);
            if(data.MSG == "success") {
                $(this).find("input").addClass("info_no_edit");
                $(this).find(".hide").hide();
            }
        }
    })
});

$("#cancle-btn").click(function(event) {
    event.preventDefault();

    $("#change_detail").find("input").addClass("info_no_edit");
    $("#change_detail").find(".hide").hide();
    $("#change-btn").show()
});

$("#user_img").change(function(event) {
    event.preventDefault();
    console.log("input changed");
    var data = new FormData($("#change_img")[0]);



    $.ajax({
        type : "POST",
        url  : "/user/profile/change_img",
        processData: false,
        contentType: false,
        data : data,
        success: function(data) {
            console.log(data);
            $("#user_pic").attr('src','/data/'+data.data)
        }
    })
})
