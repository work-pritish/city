var express = require('express');
var router = express.Router();


//route for first page
router.get('/',function(req, res, next){
	console.log("GET => front page");
	return res.render('index.ejs');
})


module.exports = router;