const express = require('express'),
router = express.Router({mergeParams: true}),
User = require('../models/user'),
Group = require('../models/group'),
middleware = require('../middleware');


    //routes for : '/admin' 
router.get('/', middleware.VerifyLoggedUser, middleware.ValidateUserRole, (req,res)=>{
    Group.find({name: 'standard'}, (err,foundUserList)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            Group.find({name: 'admin'}, (err, foundAdminList)=>{
                if(err){
                    console.log(err);
                    res.redirect('back');
                }else{
                    console.log('users: ');
                    console.log(foundUserList.members);
                    console.log('admins: ');
                    console.log(foundAdminList.members);
                    res.render('admin/index', {users: foundUserList, admins: foundAdminList});
                }
            });
        }
    });

})

module.exports = router;