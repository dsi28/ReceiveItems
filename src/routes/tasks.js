const express = require('express'),
router = express.Router({mergeParams: true}),
Task = require('../models/task'),
User = require('../models/user'),
Batch = require('../models/batch'),
Item = require('../models/item');

    //routes for :  '/tasks'

// route for task with two ids: As of now only items tasks will have two ids
router.get('/:type/:primaryId/:secondaryId?/new', (req,res)=>{
    let tempTask = {
        type: req.params.type
    }
    if(req.params.type == 'user'){
        User.findById(req.params.primaryId, (err, foundUser)=>{
            if(err){
                console.log(err);
                res.redirect('back');
            }else{
                tempTask.primaryId = foundUser.id;
                tempTask.name = foundUser.username;
            }
        })
    }else{
        Batch.findById(req.params.primaryId, (err,foundBatch)=>{
            if(err){
                console.log(err);
                res.redirect('back');
            }else{
                if(!req.params.secondaryId){
                    tempTask.primaryId = foundBatch.id;
                    tempTask.name = foundBatch.name;
                }else{
                    console.log('ITEMMMMMMMMMMMMMMMMMMMMMMMMMMMM');
                    Item.findById(req.params.secondaryId, (err,foundItem)=>{
                        if(err){
                            console.log(err);
                            res.redirect('back');
                        }else{
                            tempTask.primaryId = foundBatch.id;
                            tempTask.secondaryId = foundItem.id;
                            tempTask.name = foundItem.erpId;
                            tempTask.batchName = foundBatch.name;
                        }
                    })
                }
            }
        })
    }
    res.render('task/new', {tempTask: tempTask} );
});

// // route for task with one id: As of now Batch and user tasks
// router.get('/:type/:primaryId/new', (req,res)=>{
//     let tempTask = {
//         type: req.params.type,
//         primaryId: req.params.primaryId,
//         secondaryId: req.params.secondaryId
//     }
//     res.render('task/new', {task: tempTask} );
// });

router.post()