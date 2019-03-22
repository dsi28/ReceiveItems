const express = require('express'),
router = express.Router({mergeParams: true}),
Batch = require('../models/batch'),
Item = require('../models/item'),
multer = require('multer'),
middleware = require('../middleware');

//multer config
const multerStorageConfig = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, 'public/images/');
    },
    filename: (req,file,cb)=>{
        cb(null, Date.now()+'-'+ file.originalname)
    }
});
const upload = multer({storage: multerStorageConfig});

    // routes for :   /batches/:id/items

router.get('/new', middleware.VerifyLoggedUser,(req,res)=>{
    Batch.findById(req.params.id, (err,foundBatch)=>{
        res.render('items/new', {batch : foundBatch});
    })
});

router.post('/',middleware.VerifyLoggedUser, upload.single('image'), (req,res)=>{
    if(req.file){
        req.body.item.imageLocation = '\\'+ req.file.path;
        req.body.item.imageDisplay = req.file.path.replace('public', '');
    }
    Item.create(req.body.item, (err, createdItem)=>{
        Batch.findById(req.params.id, (err,foundBatch)=>{
            foundBatch.items.push(createdItem);
            foundBatch.save();
            res.redirect('/batches/'+foundBatch.id)
        })
    })
});

router.get('/:itemId/edit', middleware.VerifyLoggedUser, (req,res)=>{
    Item.findById(req.params.itemId, (err, foundItem)=>{
        Batch.findById(req.params.id, (err,foundBatch)=>{
            res.render('items/edit', {item: foundItem, batch: foundBatch});            
        })
    })
});

router.put('/:itemId', middleware.VerifyLoggedUser, (req,res)=>{
    Item.findByIdAndUpdate(req.params.itemId, req.body.item, (err,updatedItem)=>{
        res.redirect('/batches/'+req.params.id);
    })
});

router.delete('/:itemId', middleware.VerifyLoggedUser, (req,res)=>{
    Item.findByIdAndDelete(req.params.itemId, (err,deletedItem)=>{
        res.redirect('/batches/'+req.params.id);
    })
})

module.exports = router;