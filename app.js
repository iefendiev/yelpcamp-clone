var express     	= require("express"),
    app         	= express(),
    bodyParser 	    = require("body-parser"),
    mongoose   	    = require("mongoose"),
	flash			= require("connect-flash"),
	passport   	    = require("passport"),
	LocalStrategy   = require("passport-local"),
	methodOverride  = require("method-override"),
    Campground  	= require("./models/campground"),
	Comment     	= require("./models/comment"),
	User 			= require("./models/user"),
    seedDB      	= require("./seeds");
    
var commentRoutes 	  = require("./routes/comments"),
	campgroundRoutes  = require("./routes/campgrounds"),
	authRoutes		  = require("./routes/index");


mongoose.connect("mongodb://localhost/yelp_camp_v6", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB();


// PASSPORT CONFIGURATION

app.use(require("express-session")({
	secret:"Gece is my love.",
	resave: false,
	saveUninitialized:false
}))

app.use(passport.initialize());
app.use(passport.session());

// passport-local-mongoose dan geliyor authenticate methodu.
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// currentUser ı her route'da tanımlamak için kolay yolu.
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	// next kısmı önemli çünkü her route'dan sonraki functionlara devam edilmesi gerekiyor.
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})

// _________________________________________________________________________
// -------------------------------------------------------------------------


app.use("/", authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

/*
app.listen("3000", function(){
	console.log("YelpCamp has started")
})
*/

var port = process.env.PORT || 3000;

app.lister(port, function(){
	console.log("Deployed Yelp Camp has started")
})

