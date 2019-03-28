const express = require('express'),
router = express.Router({mergeParams: true}),
User = require('../models/user'),
Group = require('../models/group'),
middleware = require('../middleware');


    //routes for : '/admin' 

router.get('/', middleware.VerifyLoggedUser, middleware.ValidateUserRole, (req,res)=>{
    Group.findOne({name: 'standard'})
    .populate('members')
    .exec((err,foundUserList)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            Group.findOne({name: 'admin'})
            .populate('members')
            .exec((err,foundAdminList)=>{
                if(err){
                    console.log(err);
                    res.redirect('back');
                }else{
                    console.log(foundAdminList);
                    res.render('admin/index', {users: foundUserList.members, admins: foundAdminList.members})
                }
            });
        }
    });
})

module.exports = router;