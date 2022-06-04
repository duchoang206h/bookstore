const db = require("../models")


const callback = async (req,res) => {
    const [user,_] = await db.User.findOrCreate(
        {   where:  { email: req.user.email},
            default: {
                fullname: req.user.displayName,
                auth: req.user.provider
            }
        });
    console.log(user)
    req.session.user = user;
    if(user.role_id == 1)  res.redirect('/admin')
    else res.redirect('/')
    }

module.exports = {
    callback
}