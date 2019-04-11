const express = require('express'),
router = express.Router({mergeParams: true}),
Batch = require('../models/batch'),
Item = require('../models/item'),
multer = require('multer'),
middleware = require('../middleware'),
fs = require('fs');

//multer config: 
//destination is the default saved file location for files
//filename is the default filenaming convnetion. 
const multerStorageConfig = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, 'public/images/');
    },
    filename: (req,file,cb)=>{
        cb(null, Date.now()+'-'+ file.originalname)
    }
});
//create multer object
const upload = multer({storage: multerStorageConfig});

    // routes for :   /batches/:id/items

//new render item/new view
router.get('/new', 
middleware.VerifyLoggedUser,
(req,res)=>{
    Batch.findById(req.params.id, (err,foundBatch)=>{
        if(err){
            console.log(err);
            req.flash('error', err);
            res.redirect('back');
        }
        res.render('items/new', {batch : foundBatch});
    })
});

//show renders items/show view
router.get('/:itemId', 
middleware.VerifyLoggedUser,
middleware.BatchIsReal, 
middleware.ItemIsReal, 
(req,res)=>{
    Item.findById(req.params.itemId, (err,foundItem)=>{
        res.render('items/show', {item: foundItem, batchId: req.params.id});
    })
});

//create creates item and adds it to batch items array
router.post('/',
middleware.VerifyLoggedUser, 
upload.single('image'), 
(req,res)=>{
    if(req.file){
        req.body.item.imageLocation = '\\'+ req.file.path;
        req.body.item.imageDisplay = req.file.path.replace('public', '');
    }
    Item.create(req.body.item, (err, createdItem)=>{
        if(err){
            console.log(err);
            req.flash('err', err.message);
            res.redirect('back');
        }else{
            createdItem.createdBy.id = createdItem.updatedBy.id = req.user;
            createdItem.createdBy.username = createdItem.updatedBy.username = req.user.username;
            createdItem.save();
            Batch.findById(req.params.id, (err,foundBatch)=>{
                if(err){
                    console.log(err);
                    req.flash('err', err.message);
                    res.redirect('back');
                }else{
                    foundBatch.items.push(createdItem);
                    foundBatch.save();
                    req.flash('success', 'Item created!');
                    res.redirect('/batches/'+foundBatch.id);
                }
            })
        }
    })
});

//edit render items/edit view
router.get('/:itemId/edit', 
middleware.VerifyLoggedUser, 
middleware.BatchIsReal, 
middleware.ItemIsReal, 
(req,res)=>{
    Item.findById(req.params.itemId, (err, foundItem)=>{
        Batch.findById(req.params.id, (err,foundBatch)=>{
            res.render('items/edit', {item: foundItem, batch: foundBatch});            
        })
    })
});

//update updates item
router.put('/:itemId', 
middleware.VerifyLoggedUser, 
middleware.BatchIsReal, 
middleware.ItemIsReal, 
upload.single('image'), 
(req,res,next)=>{
    Item.findByIdAndUpdate(req.params.itemId, req.body.item, (err,updatedItem)=>{
        if(err){
            console.log(err);
            req.flash('error', err);
            res.redirect('back');
        }else{
            if(req.file){
                middleware.DeleteImage(req,res,next);
                updatedItem.imageLocation = '\\'+ req.file.path;
                updatedItem.imageDisplay = req.file.path.replace('public', '');
            }
            updatedItem.updatedBy.username = req.user.username;
            updatedItem.updatedBy.id = req.user;
            updatedItem.updatedDate = Date.now();
            updatedItem.save();
            req.flash('success', 'Item has been updated!');
            res.redirect('/batches/'+req.params.id);
        }
    })
});

//delete deletes item
router.delete('/:itemId', 
middleware.VerifyLoggedUser, 
middleware.BatchIsReal, 
middleware.ItemIsReal, 
middleware.DeleteImage, 
(req,res)=>{
    Item.findByIdAndDelete(req.params.itemId, (err,deletedItem)=>{
        req.flash('success', 'Item Deleted!');
        res.redirect('/batches/'+req.params.id);
    })
});

module.exports = router;