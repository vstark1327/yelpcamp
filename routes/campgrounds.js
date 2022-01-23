var express = require("express"),
	router  = express.Router(),
	CampGround = require("../models/campground"),
	middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/",function(req,res){
	CampGround.find({},function(err,allCampgrounds){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/index",{campgrounds: allCampgrounds});
		}
	})

})

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn,function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name:name,image:image,price: price,description:desc,author: author};
	CampGround.create(newCampground,function(err,newlyCreated){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/campgrounds");
		}
	});	
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
})

//SHOW - shows more info about one campground
router.get("/:id",function(req,res){
	CampGround.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/show",{campground: foundCampground});
		}
	})
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	CampGround.findById(req.params.id,function(err,foundCampground){
		res.render("campgrounds/edit",{campground: foundCampground});
	});
});
//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	CampGround.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	CampGround.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;