const express = require('express'),
router = express.Router({mergeParams: true}),
User = require('../models/user'),
Group = require('../models/group'),
middleware = require('../middleware'),
Task = require('../models/task');


    //routes for : '/admin' 
//show
router.get('/', middleware.VerifyLoggedUser, middleware.ValidateUserRole, (req,res)=>{
    Group.findOne({name: 'standard'})
    .populate('members')
    .exec(async (err,foundUserList)=>{
        try{
            await Group.findOne({name: 'admin'})
            .populate('members')
            .exec((err,foundAdminList)=>{
                Task.find({}, (err,foundTasks)=>{
                    Group.find({role: false}, (err,groupList)=>{
                        res.render('admin/index', 
                        {users: foundUserList.members, 
                        admins: foundAdminList.members,
                        tasks: foundTasks,
                        groups: groupList});
                    });
                });
            });
        }catch(err){
            console.log(err);
            req.flash('error', err.message);
            res.redirect('back');
        }
    });
});
module.exports = router;