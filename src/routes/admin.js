const express = require('express'),
router = express.Router({mergeParams: true}),
User = require('../models/user'),
Group = require('../models/group'),
middleware = require('../middleware'),
Task = require('../models/task');


    //routes for : '/admin' 

router.get('/', middleware.VerifyLoggedUser, middleware.ValidateUserRole, (req,res)=>{
    Group.findOne({name: 'standard'})
    .populate('members')
    .exec((err,foundUserList)=>{
        if(err){
            console.log(err);
            req.flash('error', err);
            res.redirect('back');
        }else{
            Group.findOne({name: 'admin'})
            .populate('members')
            .exec((err,foundAdminList)=>{
                if(err){
                    console.log(err);
                    req.flash('error', err);
                    res.redirect('back');
                }else{
                    Task.find({}, (err,foundTasks)=>{
                        if(err){
                            console.log(err);
                            req.flash('error', err);
                            res.redirect('back');
                        }else{
                            //console.log(foundAdminList);
                            res.render('admin/index', 
                            {users: foundUserList.members, 
                            admins: foundAdminList.members,
                            tasks: foundTasks});
                        }
                    })
                }
            });
        }
    });
});

module.exports = router;