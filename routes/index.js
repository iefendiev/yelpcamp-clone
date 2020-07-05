var express		    = require("express"),
	router  		= express.Router(),
	passport   	    = require("passport"),
	User 			= require("../models/user");

// root route

router.get("/",function(req,res){
	res.render("home")
})


// show register form!

router.get("/register", function(req,res){
	res.render("register");
})

router.post("/register", function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			// err 'i console layınca message attribute unu görebilirsin passporttan gelen
			req.flash("error",err.message)
			console.log(err)
            return res.redirect('/register');
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success","Welcome to YelpCamp " + user.username)
			res.redirect("/campgrounds");
		})
	})
})

// show login form!

router.get("/login", function(req,res){
	res.render("login")
})

//	handling login logic
// login için middle ware function ımız gerekiyordu... 
// app.post("/login", middleware, callback)
// authenticate methodunu passport.use(new LocalStrategy(User.authenticate())); da tanımladık


router.post('/login', passport.authenticate('local', { successRedirect: '/campgrounds',
                                                    failureRedirect: '/login' }), function(req,res){
	
});

// show logout 

router.get("/logout",function(req,res){
	req.logout();
	// lol that easy
	req.flash("success", "Logged you out!")
	res.redirect("/campgrounds")
})




module.exports = router; 
