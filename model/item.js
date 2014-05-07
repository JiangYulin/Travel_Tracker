/**
 * Created by jiangyulin on 14-4-18.
 */

var config = require("./../db_config.js");
var file   = require("./file");

var Item = config.mongoose.Schema({
    /*
     title:      路线标题
     status;     是否结束 -1:未开始,0:正在进行,1:已经结束
     startTime:  开始时间（自动生成）
     endTime:    结束时间
     describe:   描述
     */
    "user_id": config.mongoose.Schema.ObjectId,
    "travel_id": config.mongoose.Schema.ObjectId,
    "photo_id": config.mongoose.Schema.ObjectId,
    "title":    String,
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
   Item_Model.remove({'photo_id':photo_id}, function(err, data) {
       if(err) {
           callback(err);
       }
       else {
           file.deleteFile(photo_id, function(err, result) {
               if(err) {
                   callback(err);
               }
               else {
                   callback(null, result);
               }
           });
       }
   });
}