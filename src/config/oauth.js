require('dotenv').config()

module.exports = {
    github:{
        client_id:"",
        client_secret:""
    },
    google:{
        client_id:process.env.GOOGLE_CLIENT_ID,
        client_secret:process.env.GOOGLE_SECRET
    }
}