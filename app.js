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

// mongodb+srv://ipek:<password>@cluster0.cwnrv.mongodb.net/<dbname>?retryWrites=true&w=majority
// DEPLOY İÇİN YARATTIĞIMIZ CONNECTION as string

mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true, useUnifiedTopology: true});

/*BURASI HEROKU İÇİN key value eklendi
mongoose.connect("mongodb+srv://ipek:ipek1!@cluster0.cwnrv.mongodb.net/yelp_camp_mongolab?retryWrites=true&w=majority", {
	useNewUrlParser: true, 
	useCreateIndex:true, 
	useUnifiedTopology: true
}).then(() => {
	// if successful connection
	console.log("Connected to DB")
}).catch(err => {
	// 1 argümanın varsa paranteze gerek yok arrow functionlarda
	console.log("ERROR", err.message)
});
*/
// terminale : export DATABASEURL=mongodb://localhost/yelp_camp_v6 yaz goorm için database export
// console.log(process.env.DATABASEURL)

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

app.listen(port, function(){
	console.log("Deployed Yelp Camp has started")
})

