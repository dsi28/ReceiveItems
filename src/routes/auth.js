const express = require('express'),
router = express.Router({mergeParams: true}),
User = require('../models/user'),
passport = require('passport');


    //auth routes: '/auth'
//


router.get('/register', (req,res)=>{
    res.render('auth/register');
});
router.post('/register', (req,res)=>{
    let user ={
        username: req.body.username,
        email: req.body.email,
        role: req.body.role
    }
    User.register(new User(user ), 
        req.body.password, 
        (err,newUser)=>{
            if(err){
                console.log(err);
                res.redirect('back');
            }else{
                passport.authenticate('local')(req,res,()=>{
                    res.redirect('/');
                })
            }
        })
});

router.get('/login', (req,res)=>{
    res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
}), (req,res)=>{
});

router.get('/logout', (req,res)=>{
    req.logOut();
    res.redirect('/');
});

//end auth routes


module.exports= router;