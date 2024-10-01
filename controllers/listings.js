const Listing=require('../models/listing');
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geoCodingClient=mbxGeoCoding({accessToken:mapToken});

module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}
module.exports.newRenderForm=(req,res)=>{
    res.render("listings/newlistings.ejs");
}
module.exports.createNewListings=async (req,res, next)=>{
    let response=await geoCodingClient.forwardGeocode({
        query:req.body.listing.location,
        limit: 1
      })
    .send();
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,'....',filename);
    const listing=new Listing(req.body.listing);
    listing.owner=req.user._id;
    listing.image={url,filename};
    listing.geometry=response.body.features[0].geometry;
    let savedlisting=await listing.save();
    console.log(savedlisting);
    req.flash('success','new listings created successfully');
    res.redirect("/listings");
}
module.exports.showListings=async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{
        path:"author"
    }}).populate('owner');
    if(!listing){
        req.flash('error','listings doesnot exits');
        res.redirect('/listings');
    }
    res.render("listings/show.ejs",{listing});
}
module.exports.editRenderForm=async (req,res)=>{
    let{id}=req.params;
    let listings=await Listing.findById(id);

    let OriginalImageUrl=listings.image.url;
    OriginalImageUrl=OriginalImageUrl.replace('/uploads','/uploads/h_300,w_250');
    res.render('listings/edit.ejs',{listings,OriginalImageUrl});
}
module.exports.updateListings=async(req,res)=>{
    let{id}=req.params;
    console.log(req.file);
    let url=req.file.path;
    let filename=req.file.filename;
    const updatedListing = await Listing.findByIdAndUpdate(id,{ ...req.body.listing , image: { url, filename }},{new:true});
    console.log(updatedListing);
    res.redirect(`/listings/${id}`);
}
module.exports.deleteListings=async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
    
}