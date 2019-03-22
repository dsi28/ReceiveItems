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
    console.log('immage del mid')
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
            })
        }else{
            next();
        }
    })
};

module.exports = middleware;