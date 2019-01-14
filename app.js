var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    seedDB          = require("./seeds"),
    User            = require("./models/user"),
    flash           = require("connect-flash");
    
var commentRoutes   = require("./routes/comments"),
    campgroundRoutes= require("./routes/campgrounds"),
    indexRoutes     = require("./routes/index");


    
// seedDB();

//CONNECTS A DATABASE OR CREATES IT IF IT DOES NOT EXIST
mongoose.connect("mongodb://localhost/yelp_camp_12");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "this is a ze secret",
    resave: false,
    saveUninitialized: false    
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//locals
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
    
app.listen(process.env.PORT, process.env.IP, function()
{
    console.log("server started");
})