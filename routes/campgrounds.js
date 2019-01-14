var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require( "../middleware");

router.get("/", function(req, res){
    console.log(req.user);
   //Get all campgrounds from DB
   Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
         res.render("campgrounds/index", {campgrounds:allCampgrounds});

       }
   });
});

router.post("/", middleware.isLoggedIn, function(req,res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id:  req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price:price, image:image, description: desc, author:author};
    //Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            req.flash("error", err);
        } else {
            req.flash("success", "You have added a campground.");
            res.redirect("/campgrounds");
        }
    });    
});

router.get("/new", middleware.isLoggedIn, function(req,res){
   res.render("campgrounds/new"); 
});
//SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            req.flash("Something went wrong.");
        } else {
                //find the campgrounds with the provided ID
               res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT - edit the campground page show 
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                console.log(err);
            }else {
                res.render("campgrounds/edit", {campground: foundCampground});
            }
             });
        });

        //not his - return to campgrounds with an error ?

// UPDATE - updates the campground 
router.put("/:id", middleware.checkCampgroundOwnership,  function(req, res){
   //find and update the correct campground
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
            console.log(err);
       } else {
            req.flash("success", "Edit successful.");
            res.redirect("/campgrounds/" + req.params.id);
       }
   });
   //redirect to the show page
});

//DESTROY - remove a campground from db
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            req.flash("error", err);
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground deleted successfully.");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;