const express = require('express'),
router = express.Router({mergeParams: true}),
Batch = require('../models/batch'),
Item = require('../models/item');


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
router.get('/new', (req, res)=>{
    res.render('batches/new');
});

router.post('/', (req,res)=>{
    Batch.create({name: req.body.name}, (err,createdBatch)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.redirect('/batches/'+createdBatch._id);
        }
    });
})

router.get('/:id/edit', (req,res)=>{
    Batch.findById(req.params.id, (err,foundBatch)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.render('batches/edit', {batch: foundBatch});
        }
    })
});

router.put('/:id', (req,res)=>{
    Batch.findByIdAndUpdate(req.params.id, req.body.batch, (err,updatedBatch)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.redirect('/batches/'+updatedBatch.id);
        }
    })
});

router.get('/:id', (req,res)=>{
    Batch.findById(req.params.id).populate('items').exec((err,foundBatch)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.render('batches/show', {batch: foundBatch});
        }
    })
});

router.delete('/:id', (req,res)=>{
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