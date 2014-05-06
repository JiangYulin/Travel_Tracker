/**
 * Created by jiangyulin on 14-1-20.
 */
var TravelModel = require("./../../model/travel");
var User        = require("./../../model/user");
var mongoose = require("./../../db_config").mongoose;
/*
创建旅行路线
 */
exports.new = function(req, res) {
    /*
    get data from form

     */
    res.render("Travel/create",{"title":"Create An New J"});
}
/*
post 请求

 */
exports.new_post = function(req, res) {
    var travel;
    var title = req.body.title;
    var describe = req.body.describe;

    travel = {
        "title":    title,
        "describe": describe
    };
    if(req.session.username !== undefined) {
        console.log("当前登录用户："+req.session.username);
        username = req.session.username;
    }
    else {
        return res.send({
            "status":-1,
            "MSG"   :"用户未登录"
        })
    }
    User.get({"username":username},function(err,doc) {
        if(doc) {
            TravelModel.create({
                "user_id":  doc._id,
                "title":    travel.title,
                "status":   -1,
                "startTime": new Date(),
                "endTime":  "9999-99-99",
                "describe": travel.describe
            },function(err, doc) {
                if(doc) {
                    console.log(doc._id);
                    res.send({
                         "status":0,
                         "MSG":  "success"
                        });
                    }
            });
        }
    });




}

exports.list = function(req, res) {
    //这个函数需要确定用户的身份,需要user_id
    //user_id 在登录函数中创建，详见login
    if(!req.session.user_id) {
        //condition:    当用户没有登录
        return res.send({
            "statu": -1,
            "MSG" : "No User has login"
        })
    }
    console.log(typeof req.session.user_id)
    console.log(mongoose.Types.ObjectId(req.session.user_id))
    TravelModel.find(
        {
            'user_id': mongoose.Types.ObjectId(req.session.user_id)
        },
        function(err, docs) {
        //这里是查询数据库，向前台发送多个查询到的travel，
        //这里需要改进查询结果
        console.log(docs);
        return res.render("Travel/index", {
        "title":"浏览这个世界的旅途",
        "hasActiveTravel":false,
        "data":docs
    })
    })
}