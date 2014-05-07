/**
 * Created by jiangyulin on 14-1-24.
 * function：
 * rules   :
 *
 */

var Item = require("../../model/item");
var mongoose = require("./../../db_config").mongoose;

exports.index = function(req, res) {
    /*
    获取已有图片数据
     */
    Item.get({
        'travel_id': mongoose.Types.ObjectId(req.params.travelID)
    },
        function(err, data) {
            if(data) {
                console.log(data);
                res.render("Travel/edit",
                    {
                        'title': '丰富你的旅行日志',
                        'travelID': req.params.travelID,
                        'data':data
                    })
            }
        }
    )

}
