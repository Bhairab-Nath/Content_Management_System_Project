const { renderRegister, register, renderLoginForm, loginForm, logoutUser, forgetPassword, forgetPasswordHandle, renderOtpForm, verifyOtp, renderResetPassword, handleResetPassword } = require('../controller/user/userController')
const catchError = require('../services/catchError')

const router = require('express').Router()

router.route('/register').get(renderRegister)
router.route('/register').post(catchError(register))
router.route('/login').get(renderLoginForm).post(catchError(loginForm))
router.route('/logout').get(logoutUser)
router.route('/forgetPassword').get(forgetPassword).post(catchError(forgetPasswordHandle))
router.route('/otpForm').get(renderOtpForm)
router.route('/verifyOtp/:id').post(catchError(verifyOtp))
router.route('/resetPassword').get(renderResetPassword)
router.route('/resetPassword/:email/:otp').post(catchError(handleResetPassword))

module.exports = router