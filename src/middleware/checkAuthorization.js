const { ROLE_AMIN } = require('../constants')
module.exports =  async (req, res, next) => {
    if(req.isAuthenticated()){
        console.log("AUthen")
         if(req.session.user.role_id == ROLE_AMIN){
             next();
         }else{
              res.redirect('/');
         }
    }else{
        console.log("CLGGGDDSGDS")
        res.redirect('/auth/login');
    }
};