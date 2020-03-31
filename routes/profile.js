var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Form = require('../models/form');


//for image uploading

//for user (Profile) page
router.get('/profile', function (req, res, next) {
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			return res.render('user.ejs', {"name":data.username,"email":data.email});
		}
	});
});
router.get('/dashboard',function(req, res, next){
	User.findOne({unique_id:req.session.userId},function(err,data){
		if(!data){
			res.redirect('/');
		}else{
			Form.find({form_no:data.unique_id},function(err,doc){
				return res.render('dashboard.ejs',{"name":data.username,"email":data.email,"form":doc,});
			});
			
		}
	});
});
router.get('/help',function(req, res, next){
	User.findOne({unique_id:req.session.userId},function(err,data){
		if(!data){
			res.redirect('/');
		}else{
        	return res.render('help.ejs',{"name":data.username,"email":data.email});
		}
	});
});
router.get('/settings',function(req, res, next){
	User.findOne({unique_id:req.session.userId},function(err,data){
		if(!data){
			res.redirect('/');
		}else{
        	return res.render('settings.ejs',{"name":data.username,"email":data.email,"id":data.id});
		}
	});
});

//account remove
let remove = (req, res) => {
	let id = req.params.UserId;
	Form.remove({form_no:req.session.userId},function(){});
	User.remove({ _id: id }).then( () => {
	  console.log('Removed');
	}, err => console.log('Error on removing the user'));
	res.send('success');
  };
  router.delete('/delete/:UserId', remove);

//account updation

router.post('/update', function (req, res, next) {
			// res.send({"Success":"Success!"});
			User.findOne({unique_id:req.session.userId},function(err,data){
			if (req.body.password==req.body.passwordConf) {
			data.username=req.body.username;
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;
			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					res.send({"Success":"UPDATED!"});
			});
		}else{
			res.send({"Success":"Password does not matched! Both Password should be same."});
		}
});
});

  
//for logout and redirecting to login
router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/search_page');
    	}
    });
}
});



  router.post('/profile',function(req,res){		 
	var form = new Form({
		        form_no:req.session.userId,
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				service: req.body.service,
				phone: req.body.phone,
				address: req.body.address,
				city: req.body.city,
			});
			
			  form.save(function(err,form){
				  if(err)
				  console.log("error");
			  }); 
	  res.redirect("/profile");
  });
  

//handling remove post request from dashboard
router.delete('/rmpost/:Postid',function(req,res){
	console.log(req.params.Postid);
	Form.deleteOne({_id:req.params.Postid},function(err,data){
		 res.send("success");
	});
});

//handling dash edit here
router.get('/dash_edit/:Postid',function(req,res){
	var post_id=req.params.Postid;
	console.log(post_id);
			Form.findOne({_id : post_id},function(err,doc){
				res.send("success");
				//return res.send('dash_edit.ejs', {"first_name":doc.first_name, "last_name":doc.last_name, "phone":doc.phone, "address":doc.address, "city":doc.city, });			
			});
				
		});

router.get('/dash_change/:pid',function(req,res){
	User.findOne({unique_id:req.session.userId},function(err,data){
	Form.findOne({_id:req.params.pid},function(err,doc){
		return res.render('dash_edit.ejs', {"linker": req.params.pid , "name":data.username,"email":data.email,"first_name":doc.first_name, "last_name":doc.last_name, "phone":doc.phone, "address":doc.address, "city":doc.city, });
	   //res.render('dash_edit.ejs',{"name":data.username,"email":data.email,});
	});
});
});

router.post('/dash_change/:Postid',function(req,res){
	Form.findOne({_id:req.params.Postid},function(err,doc){
			doc.first_name=req.body.first_name;
			doc.last_name=req.body.last_name;
			doc.phone=req.body.phone;
			doc.address=req.body.address;
			doc.city=req.body.city;
			doc.save(function(err,obj){
				if(err){
					res.send(err)
				}
            res.redirect("/dashboard");
			});
		
		});
	});


module.exports = router;