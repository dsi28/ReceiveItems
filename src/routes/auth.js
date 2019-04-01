const express = require('express'),
router = express.Router({mergeParams: true}),
User = require('../models/user'),
passport = require('passport'),
Group = require('../models/group'),
middleware = require('../middleware'),
async = require('async'),
nodemailer = require('nodemailer'),
crypto = require('crypto');


    //auth routes: '/auth'
//


router.get('/register', (req,res)=>{
    res.render('auth/register');
});
router.post('/register', (req,res)=>{
    let user = {
        username: req.body.username,
        email: req.body.email,
        role: req.body.role
    }
    User.register(new User(user), 
        req.body.password, 
        (err,newUser)=>{
            if(err){
                console.log(err);
                res.redirect('back');
            }else{
                Group.findOne({name: newUser.role}, (err,roleGroup)=>{
                    roleGroup.members.push(newUser);
                    roleGroup.save();
                });
                passport.authenticate('local')(req,res,()=>{
                    res.redirect('/');
                });
            }
        })
});

router.get('/login', (req,res)=>{
    res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
}), (req,res)=>{
});

router.get('/logout', (req,res)=>{
    req.logOut();
    res.redirect('/');
});







//// pasword reset 

router.get('/:id/passwordReset', middleware.VerifyLoggedUser, middleware.OwnerOrAdminUser, middleware.UserEmailNotNull, (req,res)=>{
    User.findById(req.params.id, (err,foundUser)=>{
        res.redirect(`/auth/${req.params.id}/reset`)
    });
});

//get password reset
router.get('/:id/reset', 
    middleware.UserNotNull,
    middleware.OwnerOrAdminUser,
	middleware.UserEmailNotNull,
	(req, res)=>{
        User.findById(req.params.id, (err, foundUser)=>{
            let token;
            async.waterfall([
                function(done) {
                    crypto.randomBytes(20, function(err, buf) {
                        token = buf.toString('hex');
                        done(err, token);
                    });
                },
                function(token, done) {
                    if (!foundUser) {
                        //req.flash('error', 'No account with that email address exists.');
                        return res.redirect('/users/'+foundUser._id);
                    }
                    foundUser.resetPasswordToken = token;
                    foundUser.resetPasswordExpires = Date.now() + 1800000; // 30 mins
                    foundUser.save(function(err) {
                    done(err, token, foundUser);
                    });
                },
                function(token, user, done) {
                    let smtpTransport = nodemailer.createTransport({
                    service: 'Gmail', 
                    auth: {
                        user: process.env.PASSWORD_RESET_EMAIL,
                        pass: process.env.PASSWORD_RESET_EMAIL_PASSWORD
                    }
                    });
                    let mailOptions = {
                        to: user.email,
                        from: process.env.PASSWORD_RESET_EMAIL,
                        subject: 'Receiving App Password Reset',
                        text: `Your password has been reset... If you did not reset your password ignore this email and contact your admin\n\n
                        Please click the following link to reset you password: \n
                        http://${req.headers.host}/auth/reset/${token} \n\n`
                    };
                    smtpTransport.sendMail(mailOptions, function(err) {
                        console.log('mail sent');
                        //req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                        done(err, 'done');
                    });
                }
                ], function(err) {
                    console.log(err);
                    res.redirect('/users/'+req.params.id);
            });
            //req.flash('success', 'An email has been sent to your account\'s email address');
            res.redirect('back');
        })
});

//get password reset form with link from email
router.get('/reset/:token', (req, res)=>{
	User.findOne({ 
        resetPasswordToken: req.params.token, 
        resetPasswordExpires: { $gt: Date.now() } 
	}, (err, user)=> {
        if(err || !user){
            //req.flash('error', 'Password reset or token is invalid or expired');
            return res.redirect('back');
        }else{
            res.render('auth/reset', {token: req.params.token});
        }
	})
});


//update passsword
router.post('/reset/:token', (req,res)=>{
	async.waterfall([
        function(done) {
            User.findOne({ resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() } }, 
            (err, user)=> {
                if (err||!user) {
                    //req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('/batches');
                }
                if(req.body.password === req.body.confirm) {
                    user.setPassword(req.body.password, function(err) {
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;
                    user.save(function(err) {
                        req.logIn(user, function(err) {
                            done(err, user);
                        });
                    });
                    })
                } else {
                    //req.flash("error", "Passwords do not match.");
                    return res.redirect('back');
                }
            });
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
                user: process.env.PASSWORD_RESET_EMAIL,
                pass: process.env.PASSWORD_RESET_EMAIL_PASSWORD
            }
            });
            var mailOptions = {
                to: user.email,
                from: process.env.PASSWORD_RESET_EMAIL,
                subject: 'Receiving app password has been changed',
                text: `This is a confirmation email that the password for your account ${user.email} has just been changed.`
                };
            smtpTransport.sendMail(mailOptions, function(err) {
                //req.flash('success', 'Success! Your password has been changed.');
                done(err);
            });
        }
        ], function(err) {
            res.redirect('/batches');
	    });
});


//end auth routes


module.exports= router;