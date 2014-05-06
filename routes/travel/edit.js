/**
 * Created by jiangyulin on 14-1-24.
 * function： used for upload your photos,
 *            change your describe,
 *            mark it's status,
 *            etc.
 * rules   :  user mast mark status as "0"(start) to start track,
 *            ...
 *
 */

exports.index = function(req, res) {
    return res.render("Travel/edit",{
        'travelID':req.params.travelID,
        'title': "丰富你的旅行日志"
    })
}
