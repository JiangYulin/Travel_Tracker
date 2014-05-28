/**
 * Created by jiangyulin on 14-5-14.
 */

$(".href").click(function(event) {
    event.preventDefault();
    window.location = $(this).attr("href");
})

$(".delete-btn").click(function(event) {
    event.preventDefault();
    $.ajax({
        type: "POST",
        url: "/travel/delete/"+$(this).attr("travel_id"),
        context: $(this).closest(".item"),
        success : function(data) {
            console.log(data);
            $(this).remove();
        }
    });
});