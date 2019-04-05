const express = require('express'),
router = express.Router({mergeParams:true}),
Group = require('../models/group'),
User = require('../models/user'),
middleware = require('../middleware');

    //routes for: /groups

//new
router.get('/new', middleware.VerifyLoggedUser, middleware.ValidateUserRole,(req,res)=>{
    User.find({}, (err,foundUsers)=>{
        if(err){
            console.log(err);
            req.flash('error', err);
            res.redirect('back');
        }else{
            res.render('groups/new', {userList: foundUsers});
        }
    })
});

//create
router.post('/', middleware.VerifyLoggedUser, middleware.ValidateUserRole, (req,res)=>{
    Group.create({name: req.body.name}, async(err,createdGroup)=>{
        if(err){
            console.log(err);
            req.flash('error', err);
            res.redirect('back');
        }else{
            try{
                for (const uId of req.body.uList) {
                    await User.findById(uId, (err, foundUser)=>{
                        createdGroup.members.push(foundUser);
                    });
                }
                await createdGroup.save();
                req.flash('success', 'Group Created!');
                res.redirect('/batches');
            }catch(err){
                console.log(err);
                req.flash('error', err.message);
                res.redirect('back');
            } 
        }
    });
});

//show
router.get('/:id', middleware.VerifyLoggedUser, middleware.GroupIsReal, (req,res)=>{
    Group.findById(req.params.id)
    .populate('members')
    .exec((err,foundGroup)=>{
        if(err){
            console.log(err);
            req.flash('error', err.message);
            res.redirect('back');
        }else{
            res.render('groups/show', {group: foundGroup});
        }
    });
});

//edit
router.get('/:id/edit', middleware.VerifyLoggedUser, middleware.GroupIsReal, middleware.ValidateUserRole, (req,res)=>{
    Group.findById(req.params.id)
    .populate('members')
    .exec((err,foundGroup)=>{
        if(err){
            console.log(err);
            req.flash('error', err.message);
            res.redirect('back');
        }else{
            User.find({}, (err,userList)=>{
                if(err){
                    console.log(err);
                    req.flash('error', err.message);
                }else{
                    for (const mem of foundGroup.members) {
                        userList = userList.filter((a)=>{
                            if( a.username != mem.username){
                                return a;
                            }  
                        })
                    }
                    res.render('groups/edit', {group: foundGroup, userList:userList});
                }
            });
        }
    });
});

//update
router.put('/:id', middleware.VerifyLoggedUser, middleware.GroupIsReal, middleware.ValidateUserRole, (req,res)=>{
    User.find({_id: {$in: req.body.check}}, (err,groupMembers)=>{
        if(err){
            console.log(err);
            req.flash('error', err.message);
            res.redirect('back');
        }else{
            Group.findById(req.params.id, (err, updatedGroup)=>{
                if(err){
                    console.log(err);
                    req.flash('error', err.message);
                    res.redirect('back');
                }else{
                    updatedGroup.name =  req.body.name;
                    updatedGroup.members = groupMembers;
                    updatedGroup.save();
                    res.redirect('/groups/'+updatedGroup._id);
                }
            })
        }
    })
});

//delete
router.delete('/:id', middleware.VerifyLoggedUser, middleware.GroupIsReal, middleware.ValidateUserRole, (req,res)=>{
    Group.findByIdAndDelete(req.params.id, (err)=>{
        if(err){
            console.log(err);
            req.flash('error', err.message);
            res.redirect('back');
        }else{
            res.redirect('/admin');
        }
    })
});

module.exports = router;