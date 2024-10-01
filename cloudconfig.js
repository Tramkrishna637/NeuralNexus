const cloudinary=require('cloudinary').v2;
const {CloudinaryStorage}=require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUDS_NAME,
    api_key:process.env.CLOUDS_APIKEY,
    api_secret:process.env.CLOUDS_SECRETKEY
});
const storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'wanderlust_dEV',
        allowedFormats:'jpg',
    }
})

module.exports={
    cloudinary,
    storage
}