const express = require('express'),
router = express.Router({mergeParams:true}),
Group = require('../models/group'),
User = require('../models/user');

    //routes for: /groups

//new
router.get('/new', (req,res)=>{
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
router.post('/', (req,res)=>{
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
router.get('/:id', (req,res)=>{
    Group.findById(req.params.id).populate('members').exec((err,foundGroup)=>{
        if(err){
            console.log(err);
            req.flash('error', err.message);
            res.redirect('back');
        }else{
            res.render('groups/show', {group: foundGroup});
        }
    });
});

module.exports = router;