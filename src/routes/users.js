const express = require('express'),
router = express.Router({mergeParams: true}),
User = require('../models/user'),
middleware = require('../middleware'),
Group = require('../models/group');

    //routes for:  /users
router.get('/:id', middleware.VerifyLoggedUser, (req,res)=>{
    User.findById(req.params.id, (err,foundUser)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.render('users/show', {user: foundUser});
        }
    })
});

router.get('/:id/edit', middleware.VerifyLoggedUser, (req,res)=>{
    User.findById(req.params.id, (err,foundUser)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.render('users/edit', {user: foundUser});
        }
    })
});

router.put('/:id', middleware.VerifyLoggedUser, (req,res)=>{
    User.findById(req.params.id, (err,foundUser)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else {
            if(foundUser.role != req.body.user.role){
                if(req.user.role == 'admin'){
                    Group.findOne({name: foundUser.role},(err,oldGroup)=>{
                        if(err){
                            console.log(err);
                            res.redirect('back');
                        }else{
                            oldGroup.members = oldGroup.members.filter((a)=>{
                                return a != foundUser.id
                            });
                            oldGroup.save();
                            Group.findOne({name: req.body.user.role}, (err,newGroup)=>{
                                if(err || !newGroup){
                                    console.log(err);
                                    res.redirect('back');
                                }
                                newGroup.members.push(foundUser);
                                newGroup.save();
                            });
                        }
                    })
                }
            }
            User.updateOne(foundUser,req.body.user, (err)=>{
                if(err){
                    console.log(err);
                    res.redirect('back');
                }else{
                    res.redirect('/users/'+req.params.id);
                }
            })
        }
    })
});

module.exports=router;