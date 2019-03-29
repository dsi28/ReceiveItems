const express = require('express'),
router = express.Router({mergeParams: true}),
User = require('../models/user'),
middleware = require('../middleware'),
Group = require('../models/group'),
Task = require('../models/task');

    //routes for:  /users
router.get('/:id', middleware.VerifyLoggedUser, (req,res)=>{
    User.findById(req.params.id, (err,foundUser)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            Task.find({createdBy: foundUser}, (err,foundTasks)=>{
                if(err){
                    console.log(err);
                    res.redirect('back');
                }else{
                    res.render('users/show', {user: foundUser, tasks: foundTasks});
                }
            });
        }
    })
});

// edit route
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

//update route
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


router.delete('/:id',(req,res)=>{
    User.findByIdAndDelete(req.params.id, (err,userToDelete)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            Group.findOne({name: userToDelete.role}, (err,foundGroup)=>{
                if(err){
                    console.log(err);
                    res.redirect('back');
                }else{
                    foundGroup.members = foundGroup.members.filter((a)=>{
                        return a != userToDelete.id
                    });
                    foundGroup.save();
                    res.redirect('/admin');
                }
            })
        }
    })
})

module.exports=router;