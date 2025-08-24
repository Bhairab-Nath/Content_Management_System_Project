const { users } = require("../../model")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sendEmail = require("../../services/sendEmail")

exports.renderRegister = (req, res) => {
    const [error] = req.flash('error') 
    res.render("register",{error})
}

exports.register = async (req, res) => {
    // console.log(req.body)
    const { username, email, password } = req.body
    const user = await users.findAll({
        where: {
            email: email
        }
    })

    if (user.length != 0) {
        req.flash('error','Email already Registered! Login')
        res.redirect('/register')
        return
    }

    await users.create({
        username: username,
        email: email,
        password: bcrypt.hashSync(password, 12) //12 is salt
    })

    req.flash('success','Registered Successfully')
    res.redirect('/login')
}

exports.renderLoginForm = (req, res) => {
    const [error] = req.flash('error')
    const [error2] = req.flash('error2')
    const [success] = req.flash('success')
    res.render('login',{error,error2,success})
}

exports.loginForm = async (req, res) => {
    // console.log(req.body)
    const { email, password } = req.body
    if (!email || !password) {
        req.flash('error2','Please fill both email and password!')
        res.redirect('/login')
        return
    }

    const user = await users.findAll({
        where: {
            email: email
        }
    })

    if (user.length === 0) {
        res.send("No user with that email!")
    } else {
        const isMatched = bcrypt.compareSync(password, user[0].password)
        if (isMatched) {
            //generate token
            var token = jwt.sign({ id: user[0].id }, process.env.secretKey, { expiresIn: '1d' })
            res.cookie('token', token)
            res.redirect('/')
        } else {
            req.flash('error', 'Email or Password is invalid')
            res.redirect('/login')
        }
    }


}

exports.logoutUser = (req, res) => {
    res.clearCookie('token')
    res.redirect('/login')

}

exports.forgetPassword = (req, res) => {
    const [error] = req.flash('error')
    res.render('forgetPassword',{error})
}

exports.forgetPasswordHandle = async (req, res) => {
    const { email } = req.body
    if (!email) {
        return res.send("Please provide email!")
    }
    const userData = await users.findAll({
        where: {
            email: email
        }
    })

    if (userData.length == 0) {
        // return res.send("No user with that email")
        req.flash('error', 'No user with that email')
        res.redirect('/forgetPassword')
        return
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    //send email
    const data = {
        email: email,
        subject: "Your Forget Password OTP",
        text: "Your OTP is: " + otp

    }

    await sendEmail(data)
    userData[0].otp = otp
    userData[0].otpGeneratedTime = Date.now()
    await userData[0].save()
    res.redirect('/otpForm?email=' + email)

}

exports.renderOtpForm = (req, res) => {
    const email = req.query.email
    const [error] = req.flash('error')
    const [error2] = req.flash('error2')
    res.render('otpForm', { email: email, error: error, error2: error2 })
}

exports.verifyOtp = async (req, res) => {
    const { otp } = req.body
    const email = req.params.id
    const data = await users.findAll({
        where: {
            otp: otp,
            email: email
        }
    })

    if (data.length == 0) {
    
        req.flash('error','Invalid otp')
        res.redirect('/otpForm?email=' + email)
        return

    }

    const currentTime = Date.now()
    const otpGeneratedTime = data[0].otpGeneratedTime
    if (currentTime - otpGeneratedTime <= 120000) {
        res.redirect(`/resetPassword?email=${email}&otp=${otp}`)
    }
    else {
        
        req.flash('error2','OTP has expired')
        res.redirect('/otpForm?email=' + email)

    }



}

exports.renderResetPassword = (req, res) => {
    const { email, otp } = req.query
    const [error] = req.flash('error')
    if (!email || !otp) {
        return res.send("Please Provide email and otp")
    }
    res.render('resetPassword', { email: email, otp: otp, error: error })
}

exports.handleResetPassword = async (req, res) => {
    const email = req.params.email
    const otp = req.params.otp
    const { newPassword, newPasswordConfirm } = req.body
    if (!email || !otp || !newPassword || !newPasswordConfirm) {
        return res.send("Please provide email, otp, new password, confirm password")
    }
    if (newPassword !== newPasswordConfirm) {
        return res.send("New password and confirm password must be same.")
    }

    const userData = await users.findAll({
        where: {
            email,
            otp
        }
    })

    const currentTime = Date.now()
    const otpGeneratedTime = userData[0].otpGeneratedTime
    if (currentTime - otpGeneratedTime <= 120000) {
        await users.update({
            password: bcrypt.hashSync(newPassword, 8)
        }, {
            where: {
                email: email
            }
        })
        res.redirect('/login')
    }
    else {
        req.flash('error','OTP has expired')
        res.redirect(`/resetPassword?email=${email}&otp=${otp}`)
    }


}