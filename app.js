
    /**
     * Module dependencies.
     */

    var express = require('express');

    /*
    路由部分需要使用外部变量
     */
    var routes = require('./routes');
    //var MongoStore = require('connect-mongo')(express); //session support
    var user = require('./routes/user');
    var login = require('./routes/login');
    var test = require('./routes/test');
    var travel = require('./routes/travel/travel');
    var edit    = require('./routes/travel/edit');
    var photo = require('./routes/travel/photo')

    /*
    自定义的外部变量
     */
    var file = require('./model/file');


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
                port: 3355
            })
        }
    ));*/
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
    app.get('/login', login.login_form);
    app.post('/login', login.login);
    app.post('/verify', login.verify);
    app.get('/register', login.register_form);
    app.post('/register', login.register);
    app.get('/test', test.test);
    app.post('/test', test.test_post);
    app.get('/users', user.list);
    app.get('/travel/new', travel.new);
    app.post('/travel/new', travel.new_post);
    app.get('/travel/list', travel.list);
    app.get('/travel/edit/:travelID', edit.index);
    app.post('/:travelID/photo/upload', photo.upload);
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






    /*
    创建服务
     */
    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });
