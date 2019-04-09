//require statements
const middleware = {},
User = require('../models/user'),
Item = require('../models/item'),
fs = require('fs'),
Task = require('../models/task'),
Batch = require('../models/batch'),
Comment = require('../models/comment'),
Group = require('../models/group');

//verfies that the user is logged in.
//if not redirects user to login page
middleware.VerifyLoggedUser = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'Please log in first...');
    res.redirect('/auth/login');
};

//check to see if there is an file(image) already associated with a given item and deletes it
//this requires the use of the fs package
//using the imgPath stat will determine wether the file exsists.
//if stat has an err.code == 'ENOENT' the file does not exsist and the app's flow will proceed with next()
//if stat finds the file using the unlink method the file will be deleted and the app's flow will proceed with next()
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

//verifies that the user is an admin or the creator/onwer of a given task
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

//verifies that the user is an admin or is the given user
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

//verifies that the user is an admin or the creator/onwer of a given comment
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

//verifies that the user is an admin or the creator/onwer of a given batch
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

//Check to see if the user has an email address. this gets called before password resets.
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

//verifies that the batch._id being used to make a request is a valid batch.
middleware.BatchIsReal = (req,res,next)=>{
    Batch.findById(req.params.id, (err, foundBatch)=>{
        if(err || !foundBatch){
            console.log(err);
            console.log('batch could not be found');
            req.flash('error', 'batch could not be found...');
            res.redirect('back');
        }else{
            next();
        }
    })
};

//verifies that the item._id being used to make a request is a valid item.
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
// //verifies that the user._id being used to make a request is a valid user.
// middleware.UserNotNull = (req,res,next)=>{
//     User.findById(req.params.id, (err,foundUser)=>{
//         if(err || !foundUser){
//             console.log(err);
//             console.log('User not found');
//             req.flash('error', 'User not found ' );
//             res.redirect('back');
//         }else{
//             next();
//         }
//     })
// };
//verifies that the user._id being used to make a request is a valid user.
middleware.UserIsReal = (req,res,next)=>{
    User.findById(req.params.id, (err,foundUser)=>{
        if(err || !foundUser){
            console.log(err);
            console.log('User not found');
            req.flash('error', 'User could not be found' );
            res.redirect('back');
        }
        else{
            next();
        }
    })
};

//verifies that the task._id being used to make a request is a valid task.
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

//verifies that the group._id being used to make a request is a valid group.
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

//Since there are three possible urls to make a task user,batch,and item this method verifies that the ._ids being used are valid
//standar url: tasks/:type/:primaryId/:secondaryId?/new
//task = user: /user/:primaryId/new
    //validates the user._id (primaryId)
//task = item: /item/:primaryId/:secondaryId/new
    //validates the batch._id (primaryId) and the item._id (secondaryId)
//task = batch: /item/:primaryId/:secondaryId/new
    //validates the batch._id (primaryId)
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