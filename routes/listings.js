const express=require("express");
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync');
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require('../middleware.js');
const listingControllers=require('../controllers/listings.js');
const multer=require('multer');
const {storage}=require('../cloudconfig.js');
const upload=multer({storage});


router.get("/",wrapAsync(listingControllers.index));

router.route('/new')
.get(isLoggedIn,listingControllers.newRenderForm)
.post(isLoggedIn,upload.single('listing[image]'),wrapAsync(listingControllers.createNewListings));
//new listings
//show route
router.route('/:id')
.get(isLoggedIn,isOwner,wrapAsync(listingControllers.showListings))
.put(isLoggedIn,upload.single('listing[image]'),isOwner,wrapAsync(listingControllers.updateListings))
.delete(isLoggedIn,isOwner,wrapAsync(listingControllers.deleteListings));

//edit route
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingControllers.editRenderForm));


module.exports=router;