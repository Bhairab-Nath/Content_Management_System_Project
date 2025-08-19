const jwt = require('jsonwebtoken')
const {promisify} = require('util')
const { users } = require('../model')

exports.isAuthenticated = async (req,res,next)=>{
    const token = req.cookies.token
    // console.log(token)
    if(!token || token === null || token === undefined){
        return res.redirect('/login')
    }

    const verifiedResult = await promisify(jwt.verify)(token,process.env.secretKey)
    // console.log(verifiedResult)
    const user = await users.findByPk(verifiedResult.id)
    if(!user){
        return res.redirect("/login")
    }

    req.userId = verifiedResult.id

    next()

}
