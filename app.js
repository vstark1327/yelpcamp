var express    = require ("express"),
	app        = express(),
	bodyParser = require("body-parser"),
	mongoose   = require("mongoose"),
	CampGround = require("./models/campground"),
	Comment    = require("./models/comment"),
	seedDB     = require("./seeds"),
	flash      = require("connect-flash"),
	methodOverride = require("method-override"),
	passport   = require("passport"),
	User       = require("./models/user"),
	localStrategy = require("passport-local");

var commentRoutes    = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes      = require("./routes/index");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.DATABASEURL,{
	useNewUrlParser:true,
	useCreateIndex:true
}).then(() => {
	console.log("Connected to DB!");
}).catch(err => {
	console.log("ERROR: ",err.message);
});

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


//seedDB(); //seed the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "My First Big App!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//passing currentUser to all the pages by default using a middleware
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//Requiring routes
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use(indexRoutes);

//Server starter 
app.listen(process.env.PORT || 3000,process.env.IP,function(){
	console.log("YelpCamp v1 has started!")
})