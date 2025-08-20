const express = require('express')
const {users} = require('./model/index')
const blogRoute = require("./routes/blogRoute")
const userRoute = require('./routes/userRoute')
const cookieParser = require('cookie-parser')

require("dotenv").config()
const app = express()


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