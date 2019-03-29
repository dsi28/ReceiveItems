const middleware = {},
User = require('../models/user'),
Item = require('../models/item'),
fs = require('fs'),
Task = require('../models/task'),
Batch = require('../models/batch'),
Comment = require('../models/comment');

middleware.VerifyLoggedUser = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/auth/login');
};

middleware.DeleteImage = (req,res,next)=>{
    Item.findById(req.params.itemId, (err,foundItem)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else if(foundItem.imageLocation){
            const imgPath = __dirname + '/../'+ foundItem.imageLocation;
            fs.stat(imgPath, (err) => {
                if (err) {
                    if(err.code === 'ENOENT') return next();
                    console.log(err);
                    res.redirect('back');
                }else{
                    fs.unlink(imgPath, (err)=>{
                        if(err){
                            console.log(err);
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
            res.redirect('back');
        }else{
            if(foundUser.role == 'admin'){
                next();
            }else{
                console.log('This user does not have permission')
                res.redirect('back');
            }
        }
    })
};

middleware.OwnerOrAdminTask = (req,res,next)=>{
    Task.findById(req.params.id, (err,foundTask)=>{
        if(err || (req.user.role != 'admin' && req.user.id != foundTask.createdBy)){
            console.log(err);
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
            return res.redirect('back');
        } else{
            next();    
        }
    })
};

middleware.OwnerOrAdminComment = (req,res,next)=>{
    Comment.findById(req.params.commentId, (err,foundComment)=>{
        if(err || (req.user.role != 'admin' && req.user.username != foundComment.createdBy.username)){
            console.log(err);
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
            return res.redirect('back');
        } else{
            next();    
        }
    })
};

module.exports = middleware;