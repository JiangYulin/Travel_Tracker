
/*
 * GET home page.
 */

exports.index = function(req, res){
    console.log(req.header('user-agent'));
    res.render('index', { title: 'Travel tracker' });
};
