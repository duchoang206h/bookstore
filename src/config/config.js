require('dotenv').config();
module.exports = 
{
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DEVELOPMENT,
    "host":  process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT,
<<<<<<< HEAD
=======
    "dialectOptions": {
      ssl: {
        require: true, // This will help you. But you will see nwe error
        rejectUnauthorized: false // This line will fix new error
      }
    }, */
    DB_URL: process.env.DB_DEVELOPMENT_URL || process.env.DATABASE_URL
>>>>>>> dev
  },
  "test": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database":  process.env.DB_TEST,
    "host":  process.env.DB_HOST,
<<<<<<< HEAD
    "dialect":  process.env.DB_DIALECT
=======
    "dialect":  process.env.DB_DIALECT */
    DB_URL: process.env.DB_TEST_URL|| process.env.DATABASE_URL
>>>>>>> dev
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_PRODUCTION,
    "host":  process.env.DB_HOST,
<<<<<<< HEAD
    "dialect":  process.env.DB_DIALECT
=======
    "dialect":  process.env.DB_DIALECT */
    DB_URL: process.env.DB_PRODUCTION_URL|| process.env.DATABASE_URL
>>>>>>> dev
  }
}