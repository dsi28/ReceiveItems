const express = require('express'),
router = express.Router({mergeParams: true}),
Batch = require('../models/batch'),
Item = require('../models/item');

    // routes for :   /batches/:id/items

router.get('/new', (req,res)=>{
    Batch.findById(req.params.id, (err,foundBatch)=>{
        res.render('items/new', {batch : foundBatch});
    })
});

router.post('/', (req,res)=>{
    Item.create(req.body.item, (err, createdItem)=>{
        Batch.findById(req.params.id, (err,foundBatch)=>{
            foundBatch.items.push(createdItem);
            foundBatch.save();
            res.redirect('/batches/'+foundBatch.id)
        })
    })

});

router.get('/:itemId/edit', (req,res)=>{
    Item.findById(req.params.itemId, (err, foundItem)=>{
        Batch.findById(req.params.id, (err,foundBatch)=>{
            res.render('items/edit', {item: foundItem, batch: foundBatch});            
        })
    })
});

router.put('/:itemId', (req,res)=>{
    Item.findByIdAndUpdate(req.params.itemId, req.body.item, (err,updatedItem)=>{
        res.redirect('/batches/'+req.params.id);
    })
})

module.exports = router;