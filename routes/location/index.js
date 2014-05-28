/**
 * Created by jiangyulin on 14-5-21.
 */

var LocationModel = require("./../../model/location");
var ItemModel = require("./../../model/item");

exports.add = function(req, res) {

    if(req.session.user_id == undefined) {
        return res.send({
            "MSG": "No User Login",
            "status": -2
        })
    }
    else {

        console.log(req.body);
        LocationModel.create({

            'user_id': req.session.user_id,
            'location_name': req.body.location_name,
            'country': req.body.country_name,
            'city'  : req.body.city_name
        },
            function(err, result) {
                return res.send({
                    "MSG": "success",
                    "status": 0,
                    "data": result
            })
            }
        )
    }


}

exports.query = function(req, res) {
    console.log(req.body);
    var query = {};
    if(req.body.query_string != "") {
        query['location_name'] = new RegExp(req.body.query_string);
    }
    else {
        return res.send({
            "MSG": "success",
            "status": 0,
            "data": null
        })
    }
    LocationModel.find(
        query,
        function(err, result) {
            console.log(result);
            return res.send({
                "MSG" :"success",
                "status" : 0,
                /*
                result为数组元素
                 */
                "data" : result
            })
        }
    )

}

exports.match = function(req, res) {
    /*
    前台传来的数据:
    {
     "location_id": [photo_id,photo_id....],
     "location_id": [photo_id,photo_id....],
     "location_id": [photo_id,photo_id....],
     "location_id": [photo_id,photo_id....],
     "location_id": [photo_id,photo_id....],
     ....
    }
     */

    console.log(req.body.data);
    /*if(!req.session.user_id) {
        return res.send({
            "MSG": "No User Login",
            "status": -2
        });
    }*/

    var data = req.body.data;

    for(var key in data) {
        //key is location_id
        //data[key][0,1,2...] is photo id

        for(var i = 0;i< data[key].length;i++)
        {
            console.log(data[key]);
            ItemModel.findOne({
                "photo_id": data[key][i],
                //"user_id": req.session.user_id
            }, function(err, data) {
                if(err) {
                    console.log("ERROR: "+err.message);
                }

                if(data) {
                    console.log("location_id is " + key);
                    data.location_id = key;
                    data.save(function(err, result) {
                        if(err) {
                            console.log("ERROR:" + err.message);
                        }
                    });
                }
            });

        }
    }

    return res.send({
        "MSG": "",
        "status": 0
    });
}

exports.getName = function(req, res) {
    console.log(req.params.locationID);
    LocationModel.findOne({
        "_id": req.params.locationID
    }, function(err, result) {
        if(err) {
            return res.send({
                "name": ""
            })
        }
        if(result) {
            return res.send({
                "name": result.location_name
            })
        }
    })
}