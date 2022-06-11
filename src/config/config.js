require('dotenv').config();
module.exports = 
{
  "development": {
    DB_URL: process.env.DB_DEVELOPMENT_URL|| process.env.DATABASE_URL
  },
  "test": {
    DB_URL: process.env.DB_PRODUCTION_URL|| process.env.DATABASE_URL
  },
  "production": {
    DB_URL: process.env.DB_PRODUCTION_URL|| process.env.DATABASE_URL
  }
}