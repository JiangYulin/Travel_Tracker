/**
 * Created by jiangyulin on 14-5-10.
 */

var config = require("./../db_config.js");

var _Comment = config.mongoose.Schema({
    /*
    reference_id 为评论所属的照片，或者是旅程的id,用户id, 以及评论id
    reference_type : 1-> photo,2->travel,3->photo下的用户对用户的留言, 4->travel下的用户对用户的回复
    nick_name:   为发起这条留言的人的昵称
     */
    "user_id":          config.mongoose.Schema.ObjectId,
    "nick_name":        String,
    "to_user_nick_name":          String,
    "to_user_id":       config.mongoose.Schema.ObjectId,
    "reference_id" :    config.mongoose.Schema.ObjectId,
    "reference_type" :  Number,
    "contents" :        String,
    "date"      :       String,
    "index"     :       Number
})

module.exports= config.mongoose.model('comment', _Comment);
