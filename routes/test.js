/**
 * Created by jiangyulin on 13-12-26.
 */
exports.test = function(req,res){
    res.render("404.jade",{"title":"ok"})
};

exports.test_post = function(req, res) {
    var mongoose = require("./../db_config.js");
    var db = mongoose.db.db;
    /*
    mongoose.db 就是 require("mongoose").connection;
     require("mongoose").connection.db;
     */

    var GridStore = mongoose.mongoose.mongo.GridStore;
    console.log(req.files);
    var gs = new GridStore(db, req.files.photo.path, "w");
    /*
    req.files.image.path
    image 为在前端规定的名称
     */
    var filename = req.files.photo.path;
    gs.open(function(err, gs){
        gs.writeFile(filename,function(err, gs){
            console.log("写入数据库");
            if(err) {
                console.log("写入失败:"+err);
                return res.send({
                    "status":-1,
                    "MSG":"写入错误"+err
                });
            }
            else if (gs) {
                gs.close();
            }
            res.send({
                "status":0,
                "MSG":"写入成功"
            })
        });
    });
}