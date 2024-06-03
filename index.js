const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const { dbUsername, dbPassword, dbHost, dbName, dbAuthSource } = require("./config/db")
const { decodeToken } = require("./middleware/token")
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3002

mongoose.connect(
    `mongodb://${dbUsername ? `${dbUsername}:${dbPassword}@`: ''}${dbHost}/${dbName}?authSource=${dbAuthSource}`
)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Database Connected'))
app.use(express.urlencoded({ extended: false, limit: '50mb'}));
app.use(express.json());
app.get('/', (req, res) => {
    res.send("<h1>Welcome to simple chat api</h1>")
})
app.use('/api/auth', authRoutes)
app.use(decodeToken());
app.use('/api', userRoutes)

app.listen(PORT, () => console.log(`Server running at port: ${PORT}`))