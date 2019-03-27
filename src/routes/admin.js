const express = require('express'),
router = express.Router({mergeParams: true}),
User = require('../models/user'),
Group = require('../models/group'),
middleware = require('../middleware');


    //routes for : '/admin' 
    // middleware.VerifyLoggedUser, middleware.ValidateUserRole,
router.get('/', (req,res)=>{
    Group.findOne({name: 'standard'})
    .populate('members')
    .exec((err,foundUserList)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            console.log(foundUserList.members);
            res.render('admin/index', {users: foundUserList.members})
        }
    });
})

module.exports = router;