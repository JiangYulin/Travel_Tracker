/**
 * Created by jiangyulin on 14-1-20.
 */
var TravelModel = require("./../../model/travel");
var User        = require("./../../model/user");
var mongoose = require("./../../db_config").mongoose;
var _Comment = require("./../../model/comment")

var Item = require("./../../model/item");
/*
创建旅行路线
 */
exports.new = function(req, res) {
    /*
    get data from form

     */
    if(!req.session.user_id){
        return res.render(
            "new_login.jade",
            {
                "request_url": req.url
            })
    }
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
    if(req.session.username) {
        console.log("当前登录用户："+req.session.username);
        username = req.session.username;
    }
    else {
        return res.render(
            "new_login.jade",
            {
                "request_url": req.url
            })
    }
    User.get({"username":username},function(err,doc) {
        if(doc) {
            TravelModel.create({
                "user_id":  doc._id,
                "title":    travel.title,
                "status":   -1,
                "startTime": new Date(),
                "view": 0,
                "endTime":  "9999-99-99",
                "describe": travel.describe
            },function(err, doc) {
                if(doc) {
                    console.log(doc._id);
                    res.redirect("/travel/list");
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
        /*
        重定向到登录界面
         */
        return res.render(
        "new_login.jade",
        {
            "request_url": req.url
        })
    }
    TravelModel.find(
        {
            'user_id': mongoose.Types.ObjectId(req.session.user_id)
        },
        function(err, docs) {
        //这里是查询数据库，向前台发送多个查询到的travel，
        //这里需要改进查询结果
        return res.render("Travel/index", {
        "title":"浏览这个世界的旅途",
        "hasActiveTravel":false,
        "data":docs
    })
    })
}

exports.show = function(req, res) {
    /*
        展示一个旅程的张片
        向客户端返回照片
     */
    console.log("travelID :" + req.params.travelID);
    Item.find({
        'travel_id': req.params.travelID
    }, function(err, data) {
        if(data) {
            TravelModel.findOne(
                {
                    '_id':req.params.travelID
                },
                function(err, travel_data) {
                    if(travel_data) {
                        travel_data.view +=1;
                        travel_data.save();
                    res.render("Travel/show", {
                        "title":"这是个旅程",
                        "data": data,
                        "travel": travel_data
                    });}
                })
        }
    })
}

exports.cover = function(req, res) {
    /*
    为旅程返回一张随机cover
     */

    Item.findOne( {
        "travel_id": req.params.travelID
    }, function(err, data) {
        try
        {
            if(data.photo_id) {

                return res.redirect("/data/"+String(data.photo_id))
            }
            else {
                res.writeHead(404);
                return res.end();
            }
        }
        catch(err) {
            res.writeHead(404);
            return res.end();
        }
    })

}

exports.delete = function(req, res) {
    /*
    删除旅程
     */

    TravelModel.remove({
        "_id": req.params.travelID,
        "user_id": req.session.user_id
    },
        function(err, result) {
            if(err) {
                res.writeHead(404);
                return res.end();
            }
            if(result) {
                res.writeHead(200);
                return res.end()
            }
        }
    );
}
/*
        随便逛逛条目
 */
exports.explore = function(req, res) {
    var condition =
    TravelModel.find({},null,
        {
            sort: {"view":1},
            skip: 0,
            limit: 5
        },function(err, docs) {
            if(err) {
                console.log("Error: "+err.message);
                return render("500.jade");
            }
            if(docs) {
                console.log(docs);
                return res.render("Travel/explore.jade",
                    {
                        "title":"随便看看",
                        "data":docs
                    })
            }
        })
}

exports.reply = function(req, res) {
    console.log(req.body);
    console.log(req.body.contents)
    var contents = req.body.contents;
    var type = 2,
        reference_id = req.params.travelID,
        to_user_id,
        to_user_nick_name;
    if(req.session.user_id == null) {
        return res.send({
            "MSG": "No User Login",
            "status": -2
        })
    }

    if(req.body.to_user_id) {
        to_user_id = req.body.to_user_id;
    }
    if(req.body.to_user_nick_name) {
        to_user_nick_name = req.body.to_user_nick_name;
    }
    var comment = {
        'user_id' : req.session.user_id,
        'nick_name': req.session.nick_name,
        'reference_id' :reference_id,
        'reference_type': type,
        'contents' : contents,
        'date': new Date()
    };
    if(to_user_id) {
        comment['to_user_id'] = to_user_id;
    }
    if(to_user_nick_name) {
        comment['to_user_nick_name'] = to_user_nick_name;
    }
    console.log(comment);
    _Comment.create(comment,
        function(err, result) {
            if(err) {
                return res.send({
                    'MSG' : err,
                    'status' :-1
                });
            }
            else {
                return res.send({
                    'MSG' : "success",
                    'status' : 0,
                    'data': result
                })
            }
        }
    )
}

exports.get_comments = function(req, res) {

    /*
     req.params.travelID
     type 1 is mean photo's comments
     这个函数没有接受任何信息
     */

    var type = 2;
    var travel_id = req.params.travelID;
    console.log("请求评论内容的信息为:"+travel_id);
    _Comment.find({
            'reference_type': type,
            'reference_id' : mongoose.Types.ObjectId(travel_id)
        },null,
    {
        limit: 10,
        sort: {date: -1}
    },
        function(err, data) {
            return res.send(data);
        }
    );
}