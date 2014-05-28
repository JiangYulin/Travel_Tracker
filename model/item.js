/**
 * Created by jiangyulin on 14-4-18.
 */

var config = require("./../db_config.js");
var file   = require("./file");

var Item = config.mongoose.Schema({
    /*
     photo_id: photo_id为文件存储在gridfs中的fileId
     describe:   图片描述
     */
    "user_id": config.mongoose.Schema.ObjectId,
    "travel_id": config.mongoose.Schema.ObjectId,
    "photo_id": config.mongoose.Schema.ObjectId,
    "thumbnail_id": config.mongoose.Schema.ObjectId,
    "location_id": config.mongoose.Schema.ObjectId,
    "gps" : Object,
    "createDate" : Date,
    "uploadDate": Date,
    "describe": String
});

var Item_Model = config.mongoose.model('item', Item);

module.exports = Item_Model;

Item_Model.get = function(con, callback) {
    Item_Model.find(
        con,
        function(err, data) {
            callback(err, data);
        }
    )
}

Item_Model.delete = function(photo_id, callback) {
   Item_Model.findOne({'photo_id':photo_id}, function(err, data) {
       console.log(data);
       if(err) {
           callback(err);
       }
       if(data) {
           /*
           删除大图片
            */
           file.deleteFile(photo_id, function(err, result) {
               if(err) {
                   callback(err);
               }
               else {
                   /*
                   删除小图片
                    */
                   file.deleteFile(String(data.thumbnail_id), function(err, result) {
                       if(err) {
                           callback(err);
                       }
                       else {
                           data.remove();
                           callback(null, result);
                       }
                   })
               }
           });
       }
   });
}