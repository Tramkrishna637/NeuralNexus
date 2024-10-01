const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync');
const passport=require('passport');
const {savedRedirectUrl}=require('../middleware');
const usersControllers=require('../controllers/users');

router.get('/signup',usersControllers.signupRenderForm);
router.post('/signup',wrapAsync(usersControllers.signup));
router.get('/login',usersControllers.loginRenderForm);
router.post('/login',savedRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
    }),
    usersControllers.login
)
router.get('/logout',usersControllers.logout);
module.exports=router;