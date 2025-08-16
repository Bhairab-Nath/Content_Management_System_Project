const { renderRegister, register } = require('../controller/user/userController')

const router = require('express').Router()

router.route('/register').get(renderRegister)
router.route('/register').post(register)




module.exports = router