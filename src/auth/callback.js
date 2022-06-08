const db = require("../models")


const callback = async (req,res) => {
    const email = req.user.email || req.user._json.email
    const [user,_] = await db.User.findOrCreate(
        {   where:  { email },
            default: {
                fullname: req.user.displayName,
                auth: req.user.provider
            }
        });

    req.session.user = user;
    if(user.role_id == 1)  res.redirect('/admin')
    else res.redirect('/')
    }

module.exports = {
    callback
}