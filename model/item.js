/**
 * Created by jiangyulin on 14-4-18.
 */

var config = require("./../db_config.js");

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

module.exports = config.mongoose.model('item', Item);
