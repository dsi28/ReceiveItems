const express = require('express'),
router = express.Router({mergeParams: true}),
Task = require('../models/task'),
User = require('../models/user'),
Batch = require('../models/batch'),
Item = require('../models/item'),
Group = require('../models/group'),
middleware =  require('../middleware'),
Comment = require('../models/comment');

    //routes for :  '/tasks'

// task show route
router.get('/:id', middleware.TaskIsReal, (req,res)=>{
    Task.findById(req.params.id)
    .populate('createdBy')
    .populate('comments')
    .exec((err,foundTask)=>{
        if(err){
            console.log(err);
            req.flash('error', err);
            res.redirect('back');
        }
        res.render('tasks/show', {task: foundTask});
    })
});

// new: As of now only items tasks will have two ids
router.get('/:type/:primaryId/:secondaryId?/new', 
middleware.VerifyLoggedUser, 
middleware.VerifyNewAndCreateTask, 
async(req,res)=>{
    let tempTask = {
        type: req.params.type,
    }
    try{
        await Group.find({}, (err,foundGroups)=>{
            tempTask.groupLists=foundGroups;
        });
        if(req.params.type == 'user'){
            await User.findById(req.params.primaryId, (err, foundUser)=>{
                console.log('UUUUUUUUUUSER')
                tempTask.primaryId = foundUser.id;
                tempTask.name = foundUser.username;
                return res.render('tasks/new', {tempTask:tempTask});
            });
        }else{     
            await Batch.findById(req.params.primaryId, (err,foundBatch)=>{
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
    }catch(err){
        console.log(err);
        req.flash('error', err);
        return res.redirect('back');
    }
});

//create route 
router.post('/:type/:primaryId/:secondaryId?', 
middleware.VerifyLoggedUser, 
middleware.VerifyNewAndCreateTask, 
async (req,res)=>{
    try{
        if(req.user.role == 'user'){
            await Group.findOne({name: 'admin'}, (err,foundGroup)=>{
                req.body.task.for = foundGroup;
            });
        }else if(req.user.role == 'admin'){
            await Group.findById(req.body.group, (err,foundGroup)=>{
                req.body.task.for = foundGroup;
            });
        }
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
        req.flash('error', err.message);
        res.redirect('back');
    }
});


//task edit route
router.get('/:id/edit', middleware.VerifyLoggedUser, middleware.TaskIsReal, middleware.OwnerOrAdminTask, (req,res)=>{
    Task.findById(req.params.id)
    .populate('createdBy')
    .exec((err,foundTask)=>{
        if(err){
            console.log(err);
            req.flash('error', err);
            res.redirect('back');
        }else{
            res.render('tasks/edit', {task:foundTask});
        }
    })
});

router.put('/:id', middleware.VerifyLoggedUser, middleware.TaskIsReal, middleware.OwnerOrAdminTask, (req,res)=>{
    Task.findByIdAndUpdate(req.params.id, req.body.task, (err,editTask)=>{
        if(err){
            console.log(err);
            req.flash('error', err);
            res.redirect('back'); 
        }else{
            req.flash('success', 'Task has been updated!');
            res.redirect('/tasks/'+editTask._id);
        }
    })
});

router.delete('/:id', middleware.VerifyLoggedUser, middleware.TaskIsReal, middleware.ValidateUserRole, (req,res)=>{
    Task.findByIdAndDelete(req.params.id, (err, deletedTask)=>{
        if(err){
            console.log(err);
            req.flash('error', err);
            res.redirect('back');
        }else{
            Comment.deleteMany({_id: {$in: deletedTask.comments}}, (err,deletedItems)=>{
                if(err){
                    console.log(err);
                    req.flash('error', err);
                    res.redirect('back');
                }else{
                    req.flash('success', 'Task deleted!');
                    res.redirect('/admin');
                }
            })
        }
    })
});

module.exports = router;