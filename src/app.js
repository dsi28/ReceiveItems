
//require packages/setup
const express = require('express'),
app = express(),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
methodOverride = require('method-override'),
expressSanitizer = require('express-sanitizer');

//route files
const batchRoutes = require('./routes/batch'),
itemRoutes = require('./routes/item');


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

app.use('/batches', batchRoutes);
app.use('/batches/:id/items', itemRoutes);


app.listen(3000,()=>{console.log('App is alive...')})