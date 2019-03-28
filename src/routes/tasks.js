const express = require('express'),
router = express.Router({mergeParams: true}),
Task = require('../models/task'),
User = require('../models/user'),
Batch = require('../models/batch'),
Item = require('../models/item'),
Group = require('../models/group');

    //routes for :  '/tasks'

// route for task with two ids: As of now only items tasks will have two ids
router.get('/:type/:primaryId/:secondaryId?/new', (req,res)=>{
    let tempTask = {
        type: req.params.type,
    }
    if(req.params.type == 'user'){
        User.findById(req.params.primaryId, (err, foundUser)=>{
            if(err){
                console.log(err);
                return res.redirect('back');
            }
            console.log('UUUUUUUUUUSER')
            tempTask.primaryId = foundUser.id;
            tempTask.name = foundUser.username;
            return res.render('task/new', {tempTask:tempTask});
        });
    }else{     
        Batch.findById(req.params.primaryId, (err,foundBatch)=>{
            if(!req.params.secondaryId){
                console.log('BAAAAAAAAAAAAAAAAAAAAAAATCH');
                tempTask.primaryId = foundBatch.id;
                tempTask.name = foundBatch.name;
                return res.render('task/new', {tempTask:tempTask});
            }else{
                console.log('ITEMMMMMMMMMMMMMMMMMMMMMMMMMMMM');
                Item.findById(req.params.secondaryId, (err,foundItem)=>{
                    tempTask.primaryId = foundBatch.id;
                    tempTask.secondaryId = foundItem.id;
                    tempTask.name = foundItem.erpId;
                    tempTask.batchName = foundBatch.name;
                    return res.render('task/new', {tempTask:tempTask});
                })
            }
        })
    }
});

//create route 
router.post('/:type/:primaryId/:secondaryId?', async (req,res)=>{
    try{
        await Group.findOne({name: 'admin'}, (err,foundGroup)=>{
            req.body.task.for = foundGroup;
        });
        req.body.task.status = 'open';
        req.body.task.primaryId = req.params.primaryId;
        req.body.task.type = req.params.type;
        if(req.params.type == 'item'){
            req.body.task.secondaryId = req.params.secondaryId;
        }
        await User.findById(req.user._id, (err, foundUser)=>{
            req.body.task.createdBy = foundUser;
        })
        await Task.create(req.body.task, (err,createdTask)=>{
            console.log('///////');
            console.log(createdTask);
            res.redirect('/batches');
        })
    }catch(err){
        console.log(err);
        res.redirect('back');
    }
});

module.exports = router;