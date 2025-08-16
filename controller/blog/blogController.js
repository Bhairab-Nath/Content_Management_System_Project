const { blogs } = require("../../model")

exports.renderHome = async (req,res)=>{
    const blogsData = await blogs.findAll()   //returns  array
    res.render('home',{blogs: blogsData})
    
}

exports.renderAddBlog = (req,res)=>{
    res.render("addBlogs")
}

exports.addBlog = async(req,res)=>{
    
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
        image: process.env.backendUrl + req.file.filename
    })
    res.redirect("/")
}



exports.renderSingleBlog = async (req,res)=>{
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
}

exports.deleteBlog = async (req,res)=>{
    const id = parseInt(req.params.id)
    await blogs.destroy({
        where: {
            id : id
        }
    })

    res.redirect("/")
}

exports.renderUpdateBlog = async(req,res)=>{
    const id  = req.params.id
    const findblg = await blogs.findByPk(id)
    res.render("updateBlog",{id : id, blog: findblg})

}


exports.updateBlog = async(req,res)=>{
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
}