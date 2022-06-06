const userService = require('../user/service');
const bcrypt = require('bcrypt');
const { BCRYPT_SALT_ROUNDS } = require('../constants');
class AuthService{
    loginLocal = async (email, password) =>{
        try {
            const user = await userService.findByEmail(email);
            if(!user) return false;
            if(!bcrypt.compareSync(password, user.password)) return false

           return true 
        } catch (error) {
            return false
        }
    }
    loginWithSocial = async (email, fullname, auth) =>{
        return await userService.findOrCreate({email}, { auth, fullname } )
    }
    register = async (email, password, fullname, phone_number) => {
      try {
          if(await userService.findOne({ email })) return false;
          return await userService.create({
              email,
              password: bcrypt.hashSync(password, BCRYPT_SALT_ROUNDS),
              fullname,
              phone_number,
              auth: "local"
          })
      } catch (error) {
          return false
      }
    }
}
module.exports = new AuthService()