const { renderRegister, register, renderLoginForm, loginForm } = require('../controller/user/userController')

const router = require('express').Router()

router.route('/register').get(renderRegister)
router.route('/register').post(register)
router.route('/login').get(renderLoginForm).post(loginForm)



module.exports = router