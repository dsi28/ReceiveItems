const middleware = {},
User = require('../models/user');

middleware.VerifyLoggedUser = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/auth/login');
}

module.exports = middleware;