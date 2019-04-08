const middleware = {},
User = require('../models/user'),
Item = require('../models/item'),
fs = require('fs'),
Task = require('../models/task'),
Batch = require('../models/batch'),
Comment = require('../models/comment'),
Group = require('../models/group');

middleware.VerifyLoggedUser = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'Please log in first...');
    res.redirect('/auth/login');
};

middleware.DeleteImage = (req,res,next)=>{
    Item.findById(req.params.itemId, (err,foundItem)=>{
        if(err){
            console.log(err);
            req.flash('error', err);
            res.redirect('back');
        }else if(foundItem.imageLocation){
            const imgPath = __dirname + '/../'+ foundItem.imageLocation;
            fs.stat(imgPath, (err) => {
                if (err) {
                    if(err.code === 'ENOENT') return next();
                    console.log(err);
                    req.flash('error', err);
                    res.redirect('back');
                }else{
                    fs.unlink(imgPath, (err)=>{
                        if(err){
                            console.log(err);
                            req.flash('error', err);
                            res.redirect('back');
                        }else{
                            return next();
                        }
                    });
                }
            });
        }else{
            next();
        }
    })
};

//verifies that that the user is an admin
middleware.ValidateUserRole = (req,res,next)=>{
    User.findById(req.user._id, (err,foundUser)=>{
        if(err ){
            console.log(err);
            req.flash('error', err.message);
            res.redirect('back');
        }else{
            if(foundUser.role == 'admin'){
                next();
            }else{
                console.log('This user does not have permission');
                req.flash('error', foundUser.username +' does not have the necessary permissions');
                res.redirect('back');
            }
        }
    })
};

middleware.OwnerOrAdminTask = (req,res,next)=>{
    Task.findById(req.params.id, (err,foundTask)=>{
        if(err || (req.user.role != 'admin' && req.user.id != foundTask.createdBy)){
            console.log(err);
            req.flash('error', err);
            return res.redirect('back');
        } else{
            next();    
        }
    })
};

middleware.OwnerOrAdminUser = (req,res,next)=>{
    User.findById(req.params.id, (err,foundUser)=>{
        if(err || (req.user.role != 'admin' && req.user.username != foundUser.username)){
            console.log(err);
            req.flash('error', err);
            return res.redirect('back');
        } else{
            next();    
        }
    })
};

middleware.OwnerOrAdminComment = (req,res,next)=>{
    Comment.findById(req.params.commentId, (err,foundComment)=>{
        if(err || !foundComment|| (req.user.role != 'admin' && req.user.username != foundComment.createdBy.username)){
            console.log(err);
            req.flash('error', err);
            return res.redirect('back');
        } else{
            next();    
        }
    })
};

middleware.OwnerOrAdminBatch = (req,res,next)=>{
    Batch.findById(req.params.commentId, (err,foundBatch)=>{
        if(err || (req.user.role != 'admin' && req.user.username != foundBatch.createdBy.username)){
            console.log(err);
            req.flash('error', err);
            return res.redirect('back');
        } else{
            next();    
        }
    })
};


middleware.UserNotNull = (req,res,next)=>{
    User.findById(req.params.id, (err,foundUser)=>{
        if(err || !foundUser){
            console.log(err);
            console.log('User not found');
            req.flash('error', 'User not found ' );
            res.redirect('back');
        }else{
            next();
        }
    })
};

middleware.UserEmailNotNull = (req,res,next)=>{
    User.findById(req.params.id, (err,foundUser)=>{
        if(!foundUser.email){
            console.log('add email to user then try again');
            req.flash('error', 'add email to user then try again: ');
            res.redirect('/users/'+req.params.id+'/edit');
        }else{
            next();
        }
    })
};

middleware.BatchIsReal = (req,res,next)=>{
    Batch.findById(req.params.id, (err, foundBatch)=>{
        if(err || !foundBatch){
            console.log(err);
            console.log('batch could not be found');
            req.flash('error', 'batch could not be found: ');
            res.redirect('back');
        }else{
            next();
        }
    })
};

middleware.ItemIsReal = (req,res,next)=>{
    Item.findById(req.params.itemId, (err, foundItem)=>{
        if(err || !foundItem){
            console.log(err);
            console.log('item could not be found');
            req.flash('error', 'Item could not be found ' );
            res.redirect('back');
        }else{
            next();
        }
    })
};

middleware.UserIsReal = (req,res,next)=>{
    User.findById(req.params.id, (err,foundUser)=>{
        if(err || !foundUser){
            console.log(err);
            console.log('User not found');
            req.flash('error', 'User could not be found ' );
            res.redirect('back');
        }
        else{
            next();
        }
    })
};

middleware.TaskIsReal = (req,res,next)=>{
    Task.findById(req.params.id, (err,foundTask)=>{
        if(err || !foundTask){
            console.log(err);
            console.log('task not found');
            req.flash('error', 'Task could not be found ' );
            res.redirect('back');
        }else{ 
            next();
        }
    })
};

middleware.GroupIsReal = (req,res,next)=>{
    Group.findById(req.params.id, (err,foundGroup)=>{
        if(err || !foundGroup){
            console.log(err);
            console.log('task not found');
            req.flash('error', 'Task could not be found ' );
            res.redirect('back');
        }else{ 
            next();
        }
    })
};

middleware.VerifyNewAndCreateTask = (req,res,next)=>{
    switch (req.params.type) {
        case 'user':
            User.findById(req.params.primaryId, (err,foundUser)=>{
                if(err || !foundUser){
                    console.log(err);
                    console.log('user not found');
                    req.flash('error', 'User could not be found ' );
                    res.redirect('back')
                }else{
                    next();
                }
            });
            break;
        case 'item':
        Item.findById(req.params.secondaryId, (err,foundItem)=>{
            if(err || !foundItem){
                console.log(err);
                console.log('item not found');
                req.flash('error', 'Item could not be found ' );
                res.redirect('back')
            }else{
                Batch.findById(req.params.primaryId, (err,foundBatch)=>{
                    if(err || !foundBatch){
                        console.log(err);
                        console.log('batch not found');
                        req.flash('error', 'Batch could not be found ' );
                        res.redirect('back')
                    }else{
                        next();
                    }
                });
            }
        });
        break;
        case 'batch':
        Batch.findById(req.params.primaryId, (err,foundBatch)=>{
            if(err || !foundBatch){
                console.log(err);
                console.log('batch not found');
                req.flash('error', 'Batch could not be found ');
                res.redirect('back')
            }else{
                next();
            }
        });
            break;
        default:
            return res.redirect('back');
            break;
    }
};

module.exports = middleware;