const dotenv = require("dotenv")
dotenv.config()

const port = process.env.PORT
const secretKey = process.env.SECRET_KEY
const dbHost = process.env.DB_HOST
const dbName = process.env.DB_NAME
const dbUsername = process.env.DB_USER_NAME
const dbPassword = process.env.DB_PASSWORD
const dbAuthSource = process.env.DB_AUTH_SOURCE

module.exports = {port, secretKey, dbHost, dbName, dbUsername, dbPassword, dbAuthSource}