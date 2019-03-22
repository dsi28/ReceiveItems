
//require packages/setup
const express = require('express'),
app = express(),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
methodOverride = require('method-override'),
expressSanitizer = require('express-sanitizer');

//auth require
const passport = require('passport'),
LocalStrategy = require('passport-local'),
User = require('./models/user');

//auth config
    //express-session config
app.use(require('express-session')({
    secret: 'secret code 123#@!',
    resave: false,
    saveUninitialized: false
}));
    //passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//route files
const batchRouter = require('./routes/batch'),
itemRouter = require('./routes/item'),
authRouter = require('./routes/auth');

//app config
mongoose.connect('mongodb://localhost:27017/receive_app', { useNewUrlParser: true });
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));
app.use(methodOverride('_method'));
app.use(expressSanitizer());

//pass logged in user to all views

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    next();
})

app.get('/', (req, res)=>{
    res.redirect('/batches');
});


app.use('/auth', authRouter);
app.use('/batches', batchRouter);
app.use('/batches/:id/items', itemRouter);

app.listen(3000,()=>{console.log('App is alive...')})