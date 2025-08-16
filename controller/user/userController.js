const { users } = require("../../model")
const bcrypt = require('bcryptjs')

exports.renderRegister = (req,res)=>{
    res.render("register")
}

exports.register = async(req,res)=>{
    console.log(req.body)
    const {username, email, password } = req.body
    await users.create({
        username : username,
        email: email,
        password: bcrypt.hashSync(password,12) //12 is salt
    })
    res.send("Registered Successfully!")
}
