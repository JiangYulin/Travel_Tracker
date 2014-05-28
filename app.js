
    /**
     * Module dependencies.
     */

    var express = require('express');

    /*
    路由部分需要使用外部变量
     */
    var routes = require('./routes');
    //var MongoStore = require('connect-mongo')(express); //session support
    var login = require('./routes/login');
    var test = require('./routes/test');
    var travel = require('./routes/travel/travel');
    var edit    = require('./routes/travel/edit');
    var photo = require('./routes/travel/photo');
    var user = require('./routes/user/user');
    var location = require('./routes/location/index');



    /*
    自定义的外部变量
     */
    var file = require('./model/file');
    var User_Model  = require('./model/user');


    var http = require('http');
    var path = require('path');
    var app = express();



    // all environments
    app.set('port', process.env.PORT || 8080);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    /*
    提供文件上传解析支持
     */
    app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + '/uploads' }));
    app.use(express.cookieParser('KldKE8')); //提供session支持
    app.use(express.session(    //提供session支持
        {
            "secret":"KldKE8"
        }
    ));
    /*app.use(express.session(
        {
            store: new MongoStore({
                db: 'session',
                host: '127.0.0.1',
            })
        }
    ));
    */
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

    // development only
    if ('development' == app.get('env')) {
      app.use(express.errorHandler());
    }



    /*
    路由部分
     */
    app.get('/', routes.index);
    //app.get('/login', login.login_form);
    app.get('/login', login.new_login);
    app.post('/login', login.login);
    app.post('/verify', login.verify);
    //app.get('/register', login.register_form);
    app.post('/register', login.register);
    app.get('/test', test.test);
    app.post('/test', test.test_post);
    app.get('/travel/new', travel.new);
    app.post('/travel/new', travel.new_post);
    app.get('/travel/list', travel.list);
    app.get('/travel/upload/:travelID', edit.index);
    app.get('/travel/show/:travelID', travel.show);
    app.get('/travel/edit/:travelID', edit.add_location);
    app.post('/travel/edit/:travelID', edit.add_location);
    app.post("/travel/delete/:travelID", travel.delete);
    app.post('/:travelID/photo/upload', photo.upload);
    app.post('/:travelID/:photoID/delete', photo.delete);
    /*
        photoID/detail 用于edit页面的修改描述的功能
        comment 用于 show 界面的 获取回复功能
     */
    app.post('/:photoID/detail', photo.set_detail);
    app.post('/:photoID/comments', photo.get_comments);
    app.post('/:photoID/reply', photo.reply);

    /*
    用户信息方面
     */

    app.get('/user/profile', user.index);
    app.post('/user/profile/change', user.change_my_info);
    app.post('/user/profile/change_img', user.change_img)


    /*
    地点的录入，以及搜索地点时的匹配功能
     */
    app.post('/location/add', location.add);
    app.post('/location/query', location.query);
    app.post('/location/match', location.match);
    app.post('/location/name/:locationID', location.getName);

    app.get('/logout', login.logout);







    /*
    获取数据库中的图片
     */
    app.get('/data/:imgID', function(req, res) {
        file.readFile(req.params.imgID,function(err, filedata) {
            if(err) {
                console.log(err);
                res.writeHead('404');
                return res.end();
            }
            else if(filedata) {
                res.writeHead('200', {'Content-Type':'image/jpeg'});
                res.end(filedata, 'binary');
            }
        })
    })
    app.get('/user/:userID', function(req, res) {
        User_Model.get({
            '_id': req.params.userID
        },
            function(err, doc) {
               if(err) {
                   res.writeHead(404);
                   return res.end();
               }
               if(doc) {
                   file.readFile(String(doc.user_img),function(err, data) {
                       if(err) {
                           res.writeHead(404);
                           return res.end();
                       }
                       if(data) {
                           res.writeHead(200);
                           return res.end(data, 'binary');
                       }
                   })
               }
               else {
                   res.writeHead(404);
                   return res.end();
               }
            }
        )
    })

    app.get('/travel/cover/:travelID', travel.cover);






    /*
    创建服务
     */
    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });
