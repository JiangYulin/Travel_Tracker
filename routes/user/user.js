/**
 * Created by jiangyulin on 14-5-12.
 */


var User_Model = require("./../../model/user.js");
var Item = require("./../../model/item.js");
var file = require("./../../model/file.js");

var mongoose   = require("./../../db_config.js").mongoose;

exports.index = function(req, res) {
    if(req.session.user_id) {
        User_Model.get({
            '_id': req.session.user_id
        },function(err, data) {

            if(err) {
                res.writeHead(500);
                return res.end();
            }
            if(data) {
                /*
                这里会泄漏密码
                 */
                return res.render("User/profile", {
                    'title': "你的信息",
                    "data" : data
                })
            }
    })
    }
    else {
        return res.render(
            "new_login.jade",
            {
                "request_url": req.url
            })
    }
}

exports.get_my_info = function(req, res) {
    /*
    获取当前用户的详细信息

     */


    return res.send(req.body);
}

exports.change_my_info = function(req, res) {
    /*
    获取表单信息，
    修改用户信息。

     */

    if(req.session.user_id) {
        User_Model.get({

            _id: req.session.user_id
        },
            function(err, data) {
                if (err) {
                    return ;
                }
                if (data) {
                    console.log(data);
                    new_data = req.body;
                    if(new_data.email) {
                        data.email = new_data.email;
                    }
                    if(new_data.nick_name) {
                        data.nick_name = new_data.nick_name;
                    }
                    if(new_data.location) {
                        data.location = new_data.location;
                    }
                    data.save();
                    return res.send({
                        "MSG": "success",
                        "status" : 0
                    })
                }
            }
        )
    }
    else {
        return res.send({
            "MSG": "No User Login",
            "status": -2
        })
    }
}

exports.change_img = function(req, res) {

    console.log(req.files);
    file.writeFile(req.files.user_img.path,function(err, result) {
       if(err) {
           return res.send({
               "MSG": "存入图片出现错误",
               "status": -1
           })

       }
       if(result) {
           User_Model.get({
               "_id": req.session.user_id
           },
               function(err, data) {
                   if(err) {
                       return res.send({
                           "status" : -1
                       })
                   }
                   if(data) {
                       data.user_img = result.fileId;
                       data.save();
                       return res.send({
                           "MSG" : "success",
                           "status": 0,
                           "data" : data.user_img
                       })
                   }
               }
           )
       }
    });
}
