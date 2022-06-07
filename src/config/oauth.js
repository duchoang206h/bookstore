require('dotenv').config()

module.exports = {
    github:{
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_SECRET
    },
    google:{
        client_id:process.env.GOOGLE_CLIENT_ID,
        client_secret:process.env.GOOGLE_SECRET
    }
}