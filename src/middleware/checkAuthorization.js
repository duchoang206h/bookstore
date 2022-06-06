const { ROLE_AMIN } = require('../constants')
module.exports =  async function(req, res, next){
    if(req.isAuthenticated()){
         if(req.session.user.role_id == ROLE_AMIN){
             next();
         }else{
              res.redirect('/');
         }
    }else{
        res.redirect('/auth/login');
    }
};