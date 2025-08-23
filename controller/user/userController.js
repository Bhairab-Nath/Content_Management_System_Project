const { users } = require("../../model")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sendEmail = require("../../services/sendEmail")

exports.renderRegister = (req, res) => {
    res.render("register")
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
        return res.send("Email already Registered! Login")
    }

    await users.create({
        username: username,
        email: email,
        password: bcrypt.hashSync(password, 12) //12 is salt
    })
    res.redirect('/login')
}

exports.renderLoginForm = (req, res) => {
    res.render('login')
}

exports.loginForm = async (req, res) => {
    // console.log(req.body)
    const { email, password } = req.body
    if (!email || !password) {
        return res.send("Please fill both email and password!")
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
            res.send("Email or Password is invalid")
        }
    }


}

exports.logoutUser = (req, res) => {
    res.clearCookie('token')
    res.redirect('/login')

}

exports.forgetPassword = (req, res) => {
    res.render('forgetPassword')
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
        return res.send("No user with that email")
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
    await userData[0].save()
    res.redirect('/otpForm?email=' + email)

}

exports.renderOtpForm = (req, res) => {
    const email = req.query.email
    res.render('otpForm', {email : email})
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
        return res.send("Invalid otp")
    }

    res.send("Correct otp")

}