const { renderHome, renderAddBlog, addBlog, renderRegister, renderSingleBlog, register, deleteBlog, renderUpdateBlog, updateBlog} = require("../controller/blog/blogController")
const { isAuthenticated } = require("../middleware/isAuthenticated.js")
const {storage, multer} =require('../middleware/multerConfig.js')
const catchError = require("../services/catchError.js")
const upload = multer({storage: storage})

const router = require("express").Router()



router.route('/').get(renderHome)
router.route('/addblogs').get(renderAddBlog)
router.route('/addblogs').post(upload.single("image"), isAuthenticated, addBlog)

router.route('/blog/:id').get(renderSingleBlog)
router.route('/delete/:id').get(deleteBlog)
router.route('/update/:id').get(renderUpdateBlog)
router.route('/update/:id').post(catchError(updateBlog))




module.exports = router