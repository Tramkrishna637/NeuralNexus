require('dotenv').config();
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require('ejs-mate');
const listingRouters=require('./routes/listings.js');
const reviewRouters=require('./routes/reviews.js');
const userRouters=require('./routes/users.js');
const session=require('express-session');
const MongoStore=require('connect-mongo');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');
const expressError=require('./utils/expressError.js');
const mongoose_url=process.env.MONGOOSE_URL;


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.listen(8080,()=>{
    console.log("server is listening on the port 8080");
});

main().then(()=>{
    console.log("connect to the db");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    try{
        await mongoose.connect(mongoose_url);
    }catch(err){
        console.log('this is an error in database connection',err);
    }
    
}

const store=MongoStore.create({
    mongoUrl:mongoose_url,
    crypto:{
        secret:process.env.SECRETKEY,
    },
    touchAfter:24*3600,

});
store.on("error",()=>{
    console.log("error in mongo database");
})

const sessionOptions={
    store,
    secret:process.env.SECRETKEY,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}

app.use(session(sessionOptions))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currUser=req.user;
    next();
});


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/listings',listingRouters);
app.use('/listings/:id/review',reviewRouters);
app.use('/',userRouters);
app.all("*",(req,res,next)=>{
    next(new expressError(404,"page not Found"));
})
app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err;
    
    res.status(statusCode).render('error.ejs',{err});
});
