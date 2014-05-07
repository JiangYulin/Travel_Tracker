/**
 * Created by jiangyulin on 14-5-4.
 */

var file = require('../../model/file.js');
var fs = require("fs");
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
                /*
                存储成功，我们要删除缓存文件
                 */
                fs.unlink(req.files.photo.path, function(err) {
                    if(err) {
                        console.warn('file delete failed');
                    }
                })
                return res.send({
                    'status': '0',
                    'MSG': result.fileId,
                    "photo_id": result.fileId
                });
            }
        })
    });
}

exports.delete = function(req, res) {

    console.log("要删除的图片ID:"+req.params.photoID);
    Item.delete(req.params.photoID, function(err, result) {
       if(err) {
           res.writeHead(400);
           return res.end();
       }
       console.log(result);
       res.writeHead(200);
       return res.end();
    });
}