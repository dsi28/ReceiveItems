const express = require('express'),
router = express.Router({mergeParams: true}),
Batch = require('../models/batch'),
Item = require('../models/item'),
middleware = require('../middleware');


    // routes for :   batches/


router.get('/', (req, res)=>{
    Batch.find({}, (err,foundBatches)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.render('batches/index', {batches: foundBatches});
        }
    })
});

// new
router.get('/new', middleware.VerifyLoggedUser, middleware.ValidateUserRole,(req, res)=>{
    res.render('batches/new');
});

router.post('/', middleware.VerifyLoggedUser, middleware.ValidateUserRole, (req,res)=>{
    Batch.create({name: req.body.name}, (err,createdBatch)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.redirect('/batches/'+createdBatch._id);
        }
    });
})

router.get('/:id/edit', middleware.BatchIsReal, middleware.VerifyLoggedUser, middleware.ValidateUserRole, middleware.OwnerOrAdminBatch, (req,res)=>{
    Batch.findById(req.params.id, (err,foundBatch)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.render('batches/edit', {batch: foundBatch});
        }
    })
});

router.put('/:id', middleware.BatchIsReal, middleware.VerifyLoggedUser, middleware.ValidateUserRole, (req,res)=>{
    Batch.findByIdAndUpdate(req.params.id, req.body.batch, (err,updatedBatch)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.redirect('/batches/'+updatedBatch.id);
        }
    })
});

router.get('/:id', middleware.BatchIsReal, (req,res)=>{
    Batch.findById(req.params.id).populate('items').exec((err,foundBatch)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.render('batches/show', {batch: foundBatch});
        }
    })
});

router.delete('/:id',middleware.BatchIsReal, middleware.VerifyLoggedUser, middleware.ValidateUserRole, (req,res)=>{
    Batch.findByIdAndDelete(req.params.id, (err, deleteBatch)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            Item.deleteMany({_id: {$in: deleteBatch.items}}, (err,deletedItems)=>{
                if(err){
                    console.log(err);
                    res.redirect('back');
                }else{
                    res.redirect('/batches');
                }
            })
        }
    })
});

module.exports = router;