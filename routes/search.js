var express = require('express');
var router = express.Router();


router.get('/search_page', function (req, res) {
    User.findOne({ unique_id: req.session.userId }, function (err, data) {
        if (!data) {
            Form.find({},function(err,doc){
                return res.render('search_page.ejs', { 'op': 0, form: {}});
            });
            
        } else {
            Form.find({},function(err,doc){
            return res.render('search_page.ejs', { 'op': 1, "name": data.username, "email": data.email,"form": {}});
            });
        }
    });
});


router.post('/search_page', function (req, res) {
    User.findOne({ unique_id: req.session.userId }, function (err, data) {
        if (!data) {
            Form.find({service: req.body.service,city: req.body.city }, function (err, data) {
                return res.render('search_page.ejs',{ 'op': 0,form: data });
            });
            
        } else {
            Form.find({ service: req.body.service, city: req.body.city }, function (err, data) {
                return res.render('search_page.ejs',{ 'op': 1, form: data,"name": data.username, "email": data.email});
            });
        }
    });
});

router.get('/view_details/:object',function(req,res){
    
    User.findOne({ unique_id: req.session.userId }, function (err, data) {
        if (!data) {
            Form.findOne({_id : req.params.object},function(err,doc){
                return res.render('view_details.ejs', { 'op': 0, 'obj': doc});
                
            });
            
        } else {
            Form.findOne({_id : req.params.object},function(err,doc){ 
               return res.render('view_details.ejs', { 'op': 1, "name": data.username, "email": data.email,'obj': doc});
        });
        }
    });
});

module.exports = router;