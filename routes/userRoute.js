const { renderRegister, register, renderLoginForm, loginForm, logoutUser, forgetPassword, forgetPasswordHandle, renderOtpForm, verifyOtp, renderResetPassword, handleResetPassword } = require('../controller/user/userController')

const router = require('express').Router()

router.route('/register').get(renderRegister)
router.route('/register').post(register)
router.route('/login').get(renderLoginForm).post(loginForm)
router.route('/logout').get(logoutUser)
router.route('/forgetPassword').get(forgetPassword).post(forgetPasswordHandle)
router.route('/otpForm').get(renderOtpForm)
router.route('/verifyOtp/:id').post(verifyOtp)
router.route('/resetPassword').get(renderResetPassword)
router.route('/resetPassword/:email/:otp').post(handleResetPassword)

module.exports = router