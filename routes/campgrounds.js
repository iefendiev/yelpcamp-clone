var express = require("express"),
	router  = express.Router();

var Campground = require("../models/campground"),
	Comment	   = require("../models/comment");


// bir şey demediğimiz zaman otomatik index.js i require ediyor!
// ../middileware/index.js diyebilirdik yani

var middleware = require("../middleware")


// ----INDEX campgrouds show
router.get("/",function(req,res){

	Campground.find({},function(err, allCampgrounds){
		if(err){
			console.log(err)
		}else{
			res.render("campgrounds/index", {campGrounds : allCampgrounds})
			
		}
	})
})

// addind a new campground logic   ----  CREATE
router.post("/",  middleware.isLoggedIn, function(req,res){
	
	var newPost = req.body.FormNameValue
	var newIMG = req.body.FormURLValue
	var newDesc = req.body.FormDescription
	var price = req.body.PriceValue
	var author = {
	id: req.user._id,
	username: req.user.username
}
	var newCampground = {name:newPost , price:price, image:newIMG, description:newDesc, author:author}


	// CREATE AND SAVE TO DB
	Campground.create(newCampground,function(err, newlyCreated){
		if(err){
			console.log(err)
		}else{
			res.redirect("/campgrounds")
		}
	})
	
})

// --NEW--- Showing form to create new campground!
router.get("/new",  middleware.isLoggedIn ,function(req,res){
	res.render("campgrounds/new")
})

// ---SHOW---
router.get("/:id",function(req,res){
	//thats the show page route
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err)
		}else{
			res.render("campgrounds/show", {campground: foundCampground})
		}
	})
})

// ---EDIT---
router.get("/:id/edit",  middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// ---UPDATE---
router.put("/:id/", middleware.checkCampgroundOwnership, function(req,res){
	// find and update the correct campgrounds
	// redirect somewhere: show page
	
	/*    ÖNEMLİ... BUNU YAPMAMAK İÇİN NAME = "NAME" YERİNDE NAME="CAMPGROUND[NAME]" YAPIYORUZ FORMDA
	var data={
		name:req.body.formNameValue,
		image:req.body.formUrlValue,
		description:req.body.formDescription
	}
	*/
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			console.log(err)
		} else {
			// veya res.redirect("/campgrounds/"+updatedCampground._id)
			res.redirect("/campgrounds/"+req.params.id)
		}
	})
})

// ---DESTROY---
// hatırlatma: method override put ve destroy methodları için kullanılıyor...
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
	// mongoose un sağladığı methodlar... find by id and remove vs.
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	})
})



/*
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login")
}
 */

	
module.exports = router;

