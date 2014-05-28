/**
 * Created by jiangyulin on 14-1-24.
 * function：
 * rules   :
 *
 */

var Item = require("../../model/item");
var TravelModel = require("../../model/travel");
var mongoose = require("./../../db_config").mongoose;

exports.index = function(req, res) {
    /*
    获取已有图片数据
     */

    TravelModel.findOne({
        '_id': mongoose.Types.ObjectId(req.params.travelID),
        'user_id': req.session.user_id
    },
        function(err, data) {
            if(err) {
                res.writeHead(500);
                    return res.end();
            }
            if(data == []) {
                   console.log("数据为空");
                   res.writeHead(404);
                    return res.end();
            }
            else {
                res.render("Travel/edit",
                    {
                        'title': '丰富你的旅行日志',
                        'travelID': req.params.travelID,
                    })
            }
        }
    )

}

exports.add_location = function(req, res) {
    var data = new Array();
    var con;
    if(req.body.data) {
        var origin_data = req.body.data;
        origin_data = origin_data.split(",");
        console.log("请求编辑的图片id: "+req.body.data);
        for(var i = 0;i<origin_data.length;i++) {
            console.log(origin_data[i]);
            console.log(typeof origin_data[i]);
            data.push(mongoose.Types.ObjectId(origin_data[i]));
        }

        con = {
            'travel_id': mongoose.Types.ObjectId(req.params.travelID),
            'photo_id': {"$in":data}
        };

    }
    else {
        console.log("没有data");
        con = {
            'travel_id': mongoose.Types.ObjectId(req.params.travelID),
        }
    }

    Item.get(con,
        function(err, data) {
            if(err) {
                console.log("Error:"+err.message);
                res.writeHead(500);
                return res.end();
            }
            console.log(data);
            if(data) {
                res.render("Travel/add_location",
                    {
                        'title': '为你的照片添加信息',
                        'travelID': req.params.travelID,
                        'data':data
                    })
            }
        }
    )
}

