const { renderHome, renderAddBlog, addBlog, renderRegister, renderSingleBlog, register, deleteBlog, renderUpdateBlog, updateBlog } = require("../controller/blog/blogController")
const {storage, multer} =require('../middleware/multerConfig.js')
const upload = multer({storage: storage})

const router = require("express").Router()



router.route('/').get(renderHome)
router.route('/addblogs').get(renderAddBlog)
router.route('/addblogs').post(upload.single("image"),addBlog)

router.route('/blog/:id').get(renderSingleBlog)
router.route('/delete/:id').get(deleteBlog)
router.route('/update/:id').get(renderUpdateBlog)
router.route('/update/:id').post(updateBlog)




module.exports = router