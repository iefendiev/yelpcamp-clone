// all the middlewares goes here

var middlewareObj = {};

var Campground = require("../models/campground"),
	Comment	   = require("../models/comment");

middlewareObj.checkCampgroundOwnership = function (req , res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err,foundCampground){
			if(err){
				req.flash("error", "Campground not found...")
				res.redirect("back");
			} else {
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error","You don't have permission to that.")
					res.redirect("back")
				}
			}
		})
	} else {
		req.flash("error", "You need to be logged in!")
		res.redirect("back")
	}
	
}

middlewareObj.checkCommentOwnership = function (req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err,foundComment){
			if(err){
				res.redirect("back");
			} else {
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					res.redirect("back")
				}
			}
		})
	} else {
		res.redirect("back")
	}
	
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	// burda "error","Please Login First" yapmak yerine her yerde yapmalıyız. app.js in içinde res.locals
	req.flash("error","You need to be logged in!")
	res.redirect("/login")
}




module.exports = middlewareObj;


// veya!!!
/*
var middlewareObj{
	checkCampgroundOwnership : function(){
	
	},
	checkCommentOwnership: function(){
	
	}
	
}
*/