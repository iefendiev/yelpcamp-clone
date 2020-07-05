var mongoose = require("mongoose")

var Campground = require("./models/campground")

var Comment = require("./models/comment")

var data = [
	{name : "Campground  #  1",
	image : "https://images.unsplash.com/photo-1476611338391-6f395a0ebc7b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
	 description : "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."
	},
	{name : "Campground  #  2",
	image : "https://images.unsplash.com/photo-1572176280695-fc4a0c245b02?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
	 description : "Sky is blue"
	},
	{name : "Campground  #  3",
	image : "https://images.unsplash.com/photo-1499803270242-467f7311582d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
	 description : "High Altitude"
	}
]

function seedDB(){
	// remove all campgrounds
	Campground.remove({},function(err){
		
		if(err){
			console.log(err)
		} else {
			console.log("Campgrounds are removed")
		
			// add a few campgrounds
			data.forEach(function(seed){
				Campground.create(seed,function(err,campground){
					if(err){
						console.log(err)
					} else {
						console.log("campgrounds are added")
						// add comments
						Comment.create({
							text : "This place is great, but I wish there was internet.",
							author:"Lame person"
						},function(err,comment){
							if(err){
								console.log(err)
							}else{
								
								campground.comments.push(comment);
								campground.save();
								console.log("created a comment")
							}
						})
					}			
				})
			})
			
		}
	
	})
	
}

module.exports = seedDB;

					  