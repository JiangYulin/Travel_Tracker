/**
 * Created by jiangyulin on 14-5-4.
 */

var file = require('../../model/file.js');
var fs = require("fs");
var Item = require('../../model/item.js');
var _Comment = require('../../model/comment');
var mongoose = require('../../db_config.js').mongoose;
var ImageExif = require('node-exif').ExifImage;
/*
  images  提供图片缩放功能
 */
var Image = require('images');

exports.upload = function(req, res) {
    var upload_photo = req.files.photo.path;
    file.writeFile(upload_photo,function(err, result){

        if(err) {
            console.log("Error1 :" + err.message);
        }
        if(result) {
            var result_id = result.fileId;

            try {
                new ImageExif({image : upload_photo}, function(err, exifData) {
                    if(err) {
                        console.log('Error2: '+err.message);
                    }
                    else {
                        /*
                         把图片的exif信息存储起来
                         */
                        /*
                            判断exif中的创建时间以及gps是否存在，存在的话就改写定义的参数

                         */
                        console.log(exifData);
                        var createDate = "0000:00:00 00:00:00",
                            gps = {};
                        if(exifData.exif.CreateDate) {
                            createDate = exifData.exif.CreateDate;
                        }
                        if(exifData.gps) {
                            gps = exifData.gps;
                        }

                        /*
                        对图片进行缩放
                         */
                        var thumbnail = Image(upload_photo);
                        thumbnail.size(200);
                        var thum_filepath = upload_photo.replace("/uploads/","/uploads/thum_");//新定义一个路径，用来存储缩小后的图片
                        /*
                        注意：：：


                        如果第二次writefile 同一个路径，那么将会出现错误。


                         */
                        thumbnail.save(thum_filepath);
                        file.writeFile(thum_filepath, function(err, thum_data) {
                            var thumbnail_fileId = null;
                            if(err) {
                               thumbnail_fileId = null;
                            }
                            if(thum_data) {
                                thumbnail_fileId = thum_data.fileId;
                            }
                            Item.create({
                            "user_id":req.session.user_id,
                            "travel_id": req.params.travelID,
                            "photo_id": result_id,
                            "thumbnail_id": thumbnail_fileId,
                            "describe" : "",
                            "location_id": null,
                            "uploadDate": new Date(),
                            "createDate" : new Date(createDate.replace(":","-").replace(":","-")),
                            "gps": gps
                        },

                            function(err, data) {
                                fs.unlink(upload_photo, function(err) {
                                        if(err) {
                                            console.warn('file delete failed');
                                        }
                                })
                                fs.unlink(thum_filepath);
                                if(data) {
                                    /*
                                    存储成功，我们要删除缓存文件
                                     */

                                    return res.send({
                                        'status': '0',
                                        'MSG': result.fileId,
                                        "thum_id": data.thumbnail_id,
                                        "photo_id": data.photo_id
                                    });
                                }
                        });
                        }
                    )
                    }
                })
            }
            catch (err) {
                console.log('Error3: ' + err.message);

                            return res.send({
                            'status': '-1',
                            'MSG': 'Error' + err.message
                });
            }
            finally {
                /*
                 这里就不try了
                 */
            }
    }});
}

exports.delete = function(req, res) {

    console.log("要删除的图片ID:"+req.params.photoID);
    Item.delete(req.params.photoID, function(err, result) {
       if(err) {
           res.writeHead(400);
           return res.end();
       }
       console.log(result);
       res.writeHead(200);
       return res.end();
    });
}

exports.set_detail = function(req, res) {
    console.log(req.body);
    Item.findOne({'photo_id':req.params.photoID}, function(err, data) {
        if(err) {
            return res.send("failed");
        }
        if(data) {
            console.log("" +
                "查找到匹配的图片数据：")
            console.log(data);
            /*
            填充数据
             */
            data.describe = req.body.desc;
            data.save(function(err, result) {
                if(err) {
                    return res.send("failed");
                }
                if(result) {
                    console.log(result);
                    res.send(result);
                }
            })
        }
    })
}

exports.get_comments = function(req, res) {

    /*
    req.params.photoID
    type 1 is mean photo's comments
    这个函数没有接受任何信息
     */

    var type = 1;
    var photo_id = req.params.photoID;
    console.log("请求评论内容的信息为:"+photo_id);
    _Comment.find({
        'reference_type': type,
        'reference_id' : mongoose.Types.ObjectId(photo_id)
    },
        function(err, data) {
            return res.send(data);
        }
    );
}

exports.reply = function(req, res) {
    console.log(req.body);
    console.log(req.body.contents)
    var contents = req.body.contents;
    var type = 1,
        reference_id = req.params.photoID,
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
        'reference_id' :req.params.photoID,
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