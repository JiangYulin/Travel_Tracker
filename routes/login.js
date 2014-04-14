/**
 * Created by jiangyulin on 13-12-25.
 */

var User = require('../model/user');

exports.login_form = function(req,res) {
    res.render('login.jade',{title:'Login'})
};

exports.login = function(req,res) {

    var username = req.body.username;
    var password = req.body.password;
    if(req.session.username){
        /*
        如果已经登录
         */
        res.send({
            "status":-1,
            "MSG": "已经有用户登录"
        });
        return ;
    }
    User.get({'username':username,'password':password},function(err,doc){
        if(err){
            console.log("GET DATA ERROR:" + err);
            res.send({
                "status":-1,
                "MSG": err
            })
        }
        if(doc){
            req.session.username = doc.username;
            req.session.user_id  = doc._id;
            console.log("user:"+req.session.username + " has logged in");
            res.send({
                "status":0,
                "MSG": "success"
            });
            //登录验证成功

        }
        else {
            res.send({
                "status":1,
                "MSG":"deny"
            });
        }
    })
};

exports.register_form = function(req, res) {
    res.render('register.jade', {title: 'Register',username: req.session.username});
};

exports.register = function(req, res) {
    if(req.body.username && req.body.password && req.body.email) {
        console.log("all data receive");
        var username = req.body.username;
        var password = req.body.password;
        var email = req.body.email;
        var data = {
            "username":username,
            "password":password,
            "email":    email
        };
        User.insert(data, function(err) {
           if(err) {
               console.log("ERROR:" + err);
               res.send({
                   "status":"-1",
                   "MSG":err
               });
           }
           else {
               console.log("new user register success");
               res.send({
                   "status":"0",
                   "MSG":"success"
               })
           }
        });
    }
}

exports.verify = function(req, res) {
    console.log(req.body.username);
    User.get({"username":req.body.username},function(err, doc){
        if(err) {
            res.send({
                "status":-1,
                "MSG":err
            });
        }
        else if(doc) {
            res.send({
                "status":-1,
                "MSG":"username exist"
            });
        }
        else {
            res.send({
                "status":0,
                "MSG":"success"
            });
        }
    })
};

exports.logout = function(req, res) {
    delete req.session.username;
    res.send({
        "status":"0",
        "MSG":"success"
    })
}