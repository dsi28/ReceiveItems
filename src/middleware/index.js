const middleware = {},
User = require('../models/user'),
Item = require('../models/item'),
fs = require('fs');

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
}

module.exports = middleware;