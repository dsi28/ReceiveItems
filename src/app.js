
//require packages/setup
const express = require('express'),
app = express(),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
methodOverride = require('method-override'),
expressSanitizer = require('express-sanitizer');

//require models
const Batch = require('./models/batch'),
Item = require('./models/item');


//app config
mongoose.connect('mongodb://localhost:27017/receive_app', { useNewUrlParser: true });
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));
app.use(methodOverride('_method'));
app.use(expressSanitizer());

app.get('/', (req, res)=>{
    res.redirect('/batches');
});

app.get('/batches', (req, res)=>{
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
app.get('/batches/new', (req, res)=>{
    res.render('batches/new');
});

app.post('/batches', (req,res)=>{
    Batch.create({name: req.body.name}, (err,createdBatch)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.redirect('/batches/'+createdBatch._id);
        }
    });
})

app.get('/batches/:id/edit', (req,res)=>{
    Batch.findById(req.params.id, (err,foundBatch)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.render('batches/edit', {batch: foundBatch});
        }
    })
});

app.put('/batches/:id', (req,res)=>{
    Batch.findByIdAndUpdate(req.params.id, req.body.batch, (err,updatedBatch)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.redirect('/batches/'+updatedBatch.id);
        }
    })
});

app.get('/batches/:id', (req,res)=>{
    Batch.findById(req.params.id, (err,foundBatch)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.render('batches/show', {batch: foundBatch});
        }
    })
});

app.delete('/batches/:id', (req,res)=>{
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
})


app.listen(3000,()=>{console.log('App is alive...')})