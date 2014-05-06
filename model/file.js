/**
 * Created by jiangyulin on 14-1-18.
 */
var config = require("./../db_config");
    GridStore = config.mongoose.mongo.GridStore;

var db = config.db.db;
var path = require('path');

exports.writeFile = function (filepath, options, fn) {
    if (typeof options == 'function') {
        fn = options;
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
            return fn(err);
        }

        gs.writeFile(filepath, function (err, result) {
            gs.close();
            if (err) {
                return fn(err);
            }
            /*输出插入的识别id

             */
            console.log("插入文件id编号："+result.fileId);
            fn(null, result);
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
exports.readFile = function(id, fn) {
    var ObjID = config.mongoose.Types.ObjectId(id);
    GridStore.read(db,  ObjID, function(err, fileData) {
        if(err) {
            fn(err)
        }
        else {
            fn(null, fileData);
            /*
            fileData 为buffer 数据，
            需要特定的处理方法
             */
        }
        //db.close();
})
}
