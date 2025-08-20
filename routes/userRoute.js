const { renderRegister, register, renderLoginForm, loginForm, logoutUser } = require('../controller/user/userController')

const router = require('express').Router()

router.route('/register').get(renderRegister)
router.route('/register').post(register)
router.route('/login').get(renderLoginForm).post(loginForm)
router.route('/logout').get(logoutUser)


module.exports = router