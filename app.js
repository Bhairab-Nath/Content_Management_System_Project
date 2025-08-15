const express = require('express')
const {users} = require('./model/index')
const blogRoute = require("./routes/blogRoute")


require("dotenv").config()
const app = express()

// const upload = multer({storage: storage})

const port = 3000

app.set("view engine","ejs")
app.use(express.urlencoded({extended: true}))
app.use(express.json())

require('./model/index')

// app.get("/",renderHome)

// app.get("/addblogs",renderAddBlog)

// app.post("/addblogs",upload.single("image"),addBlog)

// app.get("/register",renderRegister)

// app.post("/register",register)

//single blog , Note : sign handles for all after /blog/
// app.get("/blog/:id",renderSingleBlog)

// app.get("/delete/:id",deleteBlog)

// app.get("/update/:id",renderUpdateBlog)

// app.post("/update/:id",updateBlog)


// access to uploads 
app.use(express.static("./uploads/"))
app.use(express.static("./public/styles/")) // External CSS allow

app.use("",blogRoute)

app.listen(port,()=>{
    console.log(`Node.js project has started at port ${port}..`)
})