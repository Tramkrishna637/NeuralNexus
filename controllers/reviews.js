const Listing=require('../models/listing');
const Review=require('../models/review');
module.exports.newReviews=async(req,res,next)=>{
    let listings=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listings.reviews.push(newReview);
    await  newReview.save();
    await listings.save();

    res.redirect(`/listings/${listings._id}`);
}
module.exports.deleteReviews=async(req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}