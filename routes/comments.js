
var express = require("express"),
	router  = express.Router({mergeParams: true}),
	Comment	   = require("../models/comment"),
    Campground = require("../models/campground");
var middleware = require("../middleware")


//comments new
router.get("/new", middleware.isLoggedIn, function(req,res){
	// find campground by id
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err)
		} else {
			res.render("comments/new", {campground:campground});

		}
	})
})
//comments create
router.post("/",  middleware.isLoggedIn, function(req,res){
	// lookup campground using id
	// create a new comments
	// connect new comment to campground
	// redirect to campground show page
	
	Campground.findById(req.params.id, function(err,campground){
		if(err){
			console.log(err)
			res.redirect("/campgrounds")
		} else {
			Comment.create(req.body.comment, function(err,comment){
				if(err){
					console.log(err)

				} else {
					//console.log(req.user)
						
					// add username and id to the comment
					comment.author.id       = req.user._id
					comment.author.username = req.user.username
					// save comment
					comment.save();
					
					campground.comments.push(comment);
					campground.save();
					
					req.flash("succes","Successfully added comment.")
					
					res.redirect("/campgrounds/"+ campground._id);
				}
			})
		}
	})
})
// update form here 

router.get("/:comment_id/edit",  middleware.checkCommentOwnership, function(req, res){
	// params.  id burda :comment_,id olarak tanımladık zaten.
	Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back")
			} else {
				// route'un başı app de tanımlandığı gibi :id oluyor campgrounds için.
				res.render("comments/edit", {campground_id : req.params.id, comment:foundComment})
			}
	})
})
// UPDATE

router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
	// find by id and update takes 3 params, id to find it, data to replace it, function
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back")
		} else {
			res.redirect("/campgrounds/"+req.params.id)
		}
	})
})

// DESTROY

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("/back");
		} else {
			req.flash("success","Comment deleted")
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})
/*

//middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login")
}

function checkCommentOwnership(req,res,next){
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
	
	*/
 

module.exports = router;
