const { ROLE_ADMIN } = require('../constants')
module.exports =  async (req, res, next) => {
    if(req.session.user){
         if(req.session.user.role_id == ROLE_ADMIN){
             next();
         }else{
              res.redirect('/');
         }
    }else{
        res.redirect('/auth/login');
    }
};