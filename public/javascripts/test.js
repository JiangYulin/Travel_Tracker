/**
 * Created by jiangyulin on 13-12-26.
 */

var obj = document.getElementsByClassName('main')[0];
obj.addEventListener('touchmove', function(event) {
    // If there's exactly one finger inside this element
    alert("run here");
    if (event.targetTouches.length == 1) {
        var touch = event.targetTouches[0];
        // Place element where the finger is
        console.log(touch.nageY);
        $("#x").val(touch.pageX + 'px');
        $("#y").val(touch.pageY + 'px');
    }
}, false);