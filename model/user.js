/**
 * Created by JiangYulin on 13-12-25.
 */

var config = require('./../db_config.js');

//现在只需要用户名和密码来完成登录

var User =config.mongoose.Schema({
    'username':String,
    'password':String,
    'email':String,
    'nick_name': String,
    'user_img' :config.mongoose.Schema.ObjectId,
    'introduce': String,
    'location' : String,
    'user_photo':config.mongoose.Schema.ObjectId
        /*










        加入图像存储功能
         */
}
);

var User_Model = config.mongoose.model('user',User);

exports.get = function(con,callback){
    User_Model.findOne(con,function(err,doc){
            callback(err,doc)
    });
};

exports.insert = function(data,callback) {
    console.log("insert method");
    console.log(data);
    if(data){
        console.log('ok');
        var new_user = new User_Model(data);
        User_Model.findOne({'username':data.username},function(err,doc){
            if(err) {
                console.log("get data ERROR:" + err);
            }
            else if(doc)
                err = "username in use";
            else
                new_user.save()
            callback(err)
        })
    }
}