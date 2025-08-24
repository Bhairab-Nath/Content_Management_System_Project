const express = require('express')
const {users} = require('./model/index')
const blogRoute = require("./routes/blogRoute")
const userRoute = require('./routes/userRoute')
const cookieParser = require('cookie-parser')
const session = require("express-session")
const flash = require("connect-flash")


require("dotenv").config()
const app = express()

app.use(session({
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: false
}))

app.use(flash())

const port = 3000

app.set("view engine","ejs")
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())
require('./model/index')

// access to uploads 
app.use(express.static("./uploads/"))
app.use(express.static("./public/styles/")) // External CSS allow

app.use((req,res,next)=>{
    res.locals.currentUser = req.cookies.token
    next()
})

app.use("",blogRoute)
app.use("",userRoute)


app.listen(port,()=>{
    console.log(`Node.js project has started at port ${port}..`)
})