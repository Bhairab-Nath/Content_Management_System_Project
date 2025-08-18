const { users } = require("../../model")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.renderRegister = (req,res)=>{
    res.render("register")
}

exports.register = async(req,res)=>{
    // console.log(req.body)
    const {username, email, password } = req.body
    const user = users.findAll({
        where: {
            email:email
        }
    })

    if(user.length != 0){
        return res.send("Email already Registered! Login")
    }

    await users.create({
        username : username,
        email: email,
        password: bcrypt.hashSync(password,12) //12 is salt
    })
    res.redirect('/login')
}

exports.renderLoginForm =  (req,res)=>{
    res.render('login')
}

exports.loginForm = async (req,res)=>{
    // console.log(req.body)
    const {email, password} = req.body
    if(!email || !password){
       return res.send("Please fill both email and password!")
    }

   const user = await users.findAll({
        where: {
            email: email
        }
    })

    if(user.length === 0){
        res.send("No user with that email!")
    }else{
        const isMatched = bcrypt.compareSync(password, user[0].password)
        if(isMatched){
            //generate token
            var token = jwt.sign({id: user[0].id}, "thisissecretkeynottoshare", {expiresIn: '1d'})
            res.cookie('token', token)
            res.send("Login Successfully")
        }else{
            res.send("Email or Password is invalid")
        }
    }


}