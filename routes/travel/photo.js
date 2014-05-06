/**
 * Created by jiangyulin on 14-5-4.
 */

var file = require('../../model/file.js');
var Item = require('../../model/item.js');

exports.upload = function(req, res) {
    console.log(req.files.photo.path);
    file.writeFile(req.files.photo.path,function(err, result){
        console.log("存入图片ID:"+result.fileId+" "+typeof (result.fileId));
        console.log("旅程ID"+req.params.travelID+" "+typeof(req.params.travelID));
        console.log("用户ID"+req.session.user_id+" "+typeof(req.session.user_id));
        Item.create({
            "user_id":req.session.user_id,
            "travel_id": req.params.travelID,
            "photo_id": result.fileId,
            "title": "",
            "describe" : ""
        }, function(err, data) {
            if(data) {
                console.log(data);
                return res.send({
                    'status': '0',
                    'MSG': result.fileId,
                    "photo_id": result.fileId
                });
            }
        })
    });
}