var express = require("express"),
    Campground = require("../models/campground"),
    router  = express.Router(),
    middleware = require("../middleware");
    
router.get("/",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
        }
    });
});

router.post("/",middleware.isloggedIn,function(req,res){
    var sname  = req.body.sname;
    var img    = req.body.img;
    var price  = req.body.price;
    var desc   = req.body.desc;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name:sname,price:price,image:img,description:desc,author:author};
    Campground.create(newCampground,function(err,newAdded){
        if(err){ 
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new",middleware.isloggedIn,function(req,res){
    res.render("campgrounds/new"); 
});

router.get("/:id",function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
        if(err || !foundCamp){
            req.flash("error","Campground not found");
            res.redirect("/back");
        } else {
            res.render("campgrounds/show",{campground:foundCamp}); 
        }
    });
});

router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            req.flash("error","campground not found");
        }
        res.render("campgrounds/edit",{campground: foundCampground});
    });
});

router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
    }); 
});

router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;