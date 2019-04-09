const express = require('express'),
router = express.Router({mergeParams: true}),
Batch = require('../models/batch'),
Item = require('../models/item'),
middleware = require('../middleware');

    // routes for :   batches/

//renders batches/index view
router.get('/', (req, res)=>{
    Batch.find({}, (err,foundBatches)=>{
        if(err){
            req.flash('error', err);
            res.redirect('back');
        }else{
            res.render('batches/index', {batches: foundBatches});
        }
    })
});

// new render batches/new view
router.get('/new', middleware.VerifyLoggedUser, middleware.ValidateUserRole,(req, res)=>{
    res.render('batches/new');
});

// create creates a batch using input fromnew form
router.post('/', middleware.VerifyLoggedUser, middleware.ValidateUserRole, (req,res)=>{
    Batch.create({name: req.body.name}, (err,createdBatch)=>{
        if(err){
            console.log(err);
            req.flash('error', err);
            res.redirect('back');
        }else{
            createdBatch.createdBy.username = req.user.username;
            createdBatch.createdBy.id = req.user.id;
        createdBatch.save();
            req.flash('success', 'Batch has been created!');
            res.redirect('/batches/'+createdBatch._id);
        }
    });
});

// edit render batches/edit view
router.get('/:id/edit', middleware.BatchIsReal, middleware.VerifyLoggedUser, middleware.ValidateUserRole, middleware.OwnerOrAdminBatch, (req,res)=>{
    Batch.findById(req.params.id, (err,foundBatch)=>{
        if(err){
            console.log(err);
            req.flash('error', err);
            res.redirect('back');
        }else{
            res.render('batches/edit', {batch: foundBatch});
        }
    })
});

//update: updates batch
router.put('/:id', middleware.BatchIsReal, middleware.VerifyLoggedUser, middleware.ValidateUserRole, (req,res)=>{
    Batch.findByIdAndUpdate(req.params.id, req.body.batch, (err,updatedBatch)=>{
        if(err){
            console.log(err);
            req.flash('error', err);
            res.redirect('back');
        }else{
            req.flash('success', 'Updated batch!');
            res.redirect('/batches/'+updatedBatch.id);
        }
    })
});

//show renders batches/show view
router.get('/:id', middleware.BatchIsReal, (req,res)=>{
    Batch.findById(req.params.id).populate('items').exec((err,foundBatch)=>{
        if(err){
            console.log(err);
            req.flash('error', err);
            res.redirect('back');
        }else{
            res.render('batches/show', {batch: foundBatch});
        }
    })
});

//deletes batch
router.delete('/:id',middleware.BatchIsReal, middleware.VerifyLoggedUser, middleware.ValidateUserRole, (req,res)=>{
    Batch.findByIdAndDelete(req.params.id, (err, deleteBatch)=>{
        if(err){
            console.log(err);
            req.flash('error', err);
            res.redirect('back');
        }else{
            Item.deleteMany({_id: {$in: deleteBatch.items}}, (err,deletedItems)=>{
                if(err){
                    console.log(err);
                    req.flash('error', err);
                    res.redirect('back');
                }else{
                    req.flash('success', 'Batch has been deleted...');
                    res.redirect('/batches');
                }
            })
        }
    })
});

module.exports = router;