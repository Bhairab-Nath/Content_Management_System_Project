const express = require('express')
const {blogs} = require('./model/index')
const {users} = require('./model/index')
const {storage, multer} =require('./middleware/multerConfig.js')
const app = express()

const upload = multer({storage: storage})

const port = 3000

app.set("view engine","ejs")
app.use(express.urlencoded({extended: true}))
app.use(express.json())

require('./model/index')

app.get("/",async (req,res)=>{
    const blogsData = await blogs.findAll()   //returns  array
    res.render('home',{blogs: blogsData})
})

app.get("/addblogs",(req,res)=>{
    res.render("addBlogs")
})

app.post("/addblogs",upload.single("image"),async(req,res)=>{
    
    console.log(req.file)
    // const title = req.body.title
    // const subTitle = req.body.subTitle
    // const description = req.body.description
    const {title, subTitle, description} = req.body
    // console.log(title,subTitle,description)

    await blogs.create({
        title: title,
        subTitle: subTitle,
        description: description,
        image: "http://localhost:3000/" + req.file.filename
    })
    res.redirect("/")
})

app.get("/register",(req,res)=>{
    res.render("register")
})

app.post("/register",(req,res)=>{
    console.log(req.body)
})

//single blog , Note : sign handles for all after /blog/
app.get("/blog/:id",async (req,res)=>{
    const id = req.params.id
    const foundBlog = await blogs.findByPk(id)  //returns object
    res.render("singleBlog",{blog : foundBlog})

    //Another method
    // const foundBlog = await blogs.findAll({
    //      where : {
    //       id : id
    //     }
    // })  //returns array
    //  res.render("singleBlog",{blog : foundBlog[0]})
})

app.get("/delete/:id",async (req,res)=>{
    const id = parseInt(req.params.id)
    await blogs.destroy({
        where: {
            id : id
        }
    })

    res.redirect("/")
})

app.get("/update/:id",async(req,res)=>{
    const id  = req.params.id
    const findblg = await blogs.findByPk(id)
    res.render("updateBlog",{id : id, blog: findblg})

})

app.post("/update/:id",async(req,res)=>{
    const id = req.params.id
    
    const {title, subTitle, description} = req.body
    
    await blogs.update({
        title: title,
        subTitle: subTitle,
        description: description
        
    },{
        where : {
            id : id
        }
    })
    res.redirect("/blog/" + id)
})


// access to uploads 
app.use(express.static("./uploads/"))

app.listen(port,()=>{
    console.log(`Node.js project has started at port ${port}..`)
})