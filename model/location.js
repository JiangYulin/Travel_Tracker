/**
 * Created by jiangyulin on 14-5-21.
 */

var config = require("./../db_config.js");

var Location = config.mongoose.Schema({
    /*

     */

    "user_id": config.mongoose.Schema.ObjectId,
    "location_name":   String,
    "country": String,
    "province": String,
    "city":     String,
    "viewer"  : Number
});

module.exports = config.mongoose.model('location', Location);