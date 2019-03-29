const express = require('express'),
router = express.Router({mergeParams: true}),
Task = require('../models/task'),
User = require('../models/user'),
Batch = require('../models/batch'),
Item = require('../models/item'),
Group = require('../models/group');

    //routes for :  '/tasks'

// task show route
router.get('/:id', (req,res)=>{
    Task.findById(req.params.id).populate('createdBy').exec((err,foundTask)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }
        res.render('tasks/show', {task: foundTask});
    })
});

// route for task: As of now only items tasks will have two ids
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
            return res.render('tasks/new', {tempTask:tempTask});
        });
    }else{     
        Batch.findById(req.params.primaryId, (err,foundBatch)=>{
            if(!req.params.secondaryId){
                console.log('BAAAAAAAAAAAAAAAAAAAAAAATCH');
                tempTask.primaryId = foundBatch.id;
                tempTask.name = foundBatch.name;
                return res.render('tasks/new', {tempTask:tempTask});
            }else{
                console.log('ITEMMMMMMMMMMMMMMMMMMMMMMMMMMMM');
                Item.findById(req.params.secondaryId, (err,foundItem)=>{
                    tempTask.primaryId = foundBatch.id;
                    tempTask.secondaryId = foundItem.id;
                    tempTask.name = foundItem.erpId;
                    tempTask.batchName = foundBatch.name;
                    return res.render('tasks/new', {tempTask:tempTask});
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
        req.body.task.title = req.body.name + ': ' + req.body.task.title;
        if(req.params.type == 'item'){
            req.body.task.secondaryId = req.params.secondaryId;
            req.body.task.title = req.body.batchName + '-'+req.body.task.title;
        }
        await User.findById(req.user._id, (err, foundUser)=>{
            req.body.task.createdBy = foundUser;
        })
        await Task.create(req.body.task, (err,createdTask)=>{
            res.redirect('/batches');
        })
    }catch(err){
        console.log(err);
        res.redirect('back');
    }
});


//task edit route
router.get('/:id/edit', (req,res)=>{
    Task.findById(req.params.id)
    .populate('createdBy')
    .exec((err,foundTask)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.render('tasks/edit', {task:foundTask});
        }
    })
});

router.put('/:id', (req,res)=>{
    Task.findByIdAndUpdate(req.params.id, req.body.task, (err,editTask)=>{
        if(err){
            console.log(err);
            res.redirect('back'); 
        }else{
            res.redirect('/tasks/'+editTask._id);
        }
    })
});

router.delete('/:id', (req,res)=>{
    Task.findByIdAndDelete(req.params.id, (err, deletedTask)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            //delete comments
            res.redirect('/admin');
        }
    })
});

module.exports = router;