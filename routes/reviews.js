const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync');
const expressError=require('../utils/expressError');
const Review=require('../models/review.js');
const Listing=require("../models/listing");
const {validateReview,isReviewAuthor}=require('../middleware.js');
const reviewControllers=require('../controllers/reviews.js');


router.post('/',validateReview,wrapAsync(reviewControllers.newReviews));
router.delete('/:reviewId',isReviewAuthor,wrapAsync(reviewControllers.deleteReviews));
module.exports=router;