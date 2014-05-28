/**
 * Created by jiangyulin on 14-1-18.
 */
var config = require("./../db_config");
    GridStore = config.mongoose.mongo.GridStore;

var db = config.db.db;
var path = require('path');

exports.writeFile = function (filepath, options, callback) {
    if (typeof options == 'function') {
        callback = options;
        options = {};
    }

    var filename = path.basename(filepath);

    if (options.filename) {
        filename = options.filename;
        delete options.filename;
    }

    var gs = new GridStore(db, filename, 'w', options);
    gs.open(function (err, gs) {
        if (err) {
            return callback(err);
        }

        gs.writeFile(filepath, function (err, result) {
            gs.close();
            if (err) {
                return callback(err);
            }
            /*输出插入的识别id

             */
            console.log("插入文件id编号："+result.fileId);
            callback(null, result);
            /*
            result 的数据格式
            readFile 函数需要使用result.fileId 参数
             */
        });
    });
};

        /*
        ObjID为String类型,需要认为转换.
         */
exports.readFile = function(id, callback) {
    try
    {
        var ObjID = config.mongoose.Types.ObjectId(id);
    }
    catch (err)
    {
        return callback(err);
    }
    GridStore.read(db,  ObjID, function(err, fileData) {
        if(err) {
            return callback(err)
        }
        else {
            return callback(null, fileData);
            /*
            fileData 为buffer 数据，
            需要特定的处理方法
             */
        }
        //db.close();
})
}
exports.deleteFile = function(id, callback){
    console.log('Deleting GridFile '+id);
    var id = new config.mongoose.mongo.BSONPure.ObjectID(id),
        store = new GridStore(db, id, 'r', {root: 'fs'});

    store.unlink(function(err, result){
        if (err)
            return callback(err);

        return callback(null, result);
    });
}