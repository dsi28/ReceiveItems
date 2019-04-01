const express = require('express'),
router = express.Router({mergeParams: true}),
Task = require('../models/task'),
Comment = require('../models/comment'),
User = require('../models/user'),
middleware = require('../middleware');

    //routes for : /tasks/:id/comments

router.get('/new', middleware.VerifyLoggedUser, (req,res)=>{
    Task.findById(req.params.id, (err,foundTask)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.render('comment/new', {task: foundTask});
        }
    })
});

router.post('/', middleware.VerifyLoggedUser, (req,res)=>{
    Task.findById(req.params.id, (err,foundTask)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            Comment.create(req.body.comment, (err, createdComment)=>{
                if(err){
                    console.log(err);
                    res.redirect('back');
                }else{
                    createdComment.createdBy = req.body.createdBy;
                    createdComment.save();
                    foundTask.comments.push(createdComment);
                    foundTask.save();
                    res.redirect('/tasks/'+req.params.id);
                }
            })
        }
    })
});

router.get('/:commentId/edit', middleware.VerifyLoggedUser, middleware.OwnerOrAdminComment, (req,res)=>{
    Task.findById(req.params.id, (err,foundTask)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            Comment.findById(req.params.commentId, (err,foundComment)=>{
                if(err){
                    console.log(err);
                    res.redirect('back');
                }else{
                    res.render('comment/edit', {task: foundTask, comment: foundComment});
                }
            })
        }
    })
});

router.put('/:commentId', middleware.VerifyLoggedUser, middleware.OwnerOrAdminComment,(req,res)=>{
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, (err,UpdatedComment)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.redirect('/tasks/'+req.params.id);
        }
    })
});

router.delete('/:commentId', middleware.VerifyLoggedUser, middleware.OwnerOrAdminComment, (req,res)=>{
    Comment.findByIdAndDelete(req.params.commentId, (err)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.redirect('/tasks/'+ req.params.id);
        }
    })
});

module.exports = router;