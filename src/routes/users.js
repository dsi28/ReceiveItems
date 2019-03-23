const express = require('express'),
router = express.Router({mergeParams: true}),
User = require('../models/user');

    //routes for:  /users
router.get('/:id', (req,res)=>{
    User.findById(req.params.id, (err,foundUser)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.render('users/show', {user: foundUser});
        }
    })
});

router.get('/:id/edit', (req,res)=>{
    User.findById(req.params.id, (err,foundUser)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.render('users/edit', {user: foundUser});
        }
    })
});

module.exports=router;