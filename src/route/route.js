const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')
const bookController = require("../controllers/bookController")
const { mid1, mid2 } = require("../Middlewares/auth")
const reviewController = require("../controllers/reviewController")


///_________________________________________test api_________________________________________
router.get('/test-me', function (req, res) {
    res.send({ status: true, message: "test-api working fine" })
})

//_________________________________________User Api's_________________________________________
router.post('/register', UserController.registerUser)// user creation 
router.post('/login', UserController.userLogin)//user login

//_________________________________________Book Api's _________________________________________
router.post("/books", mid1, bookController.createBook)
router.get("/books", mid1, bookController.getBook)
router.get("/books/:bookId", mid1, bookController.getReviewsBook)

router.put("/books/:bookId",mid1,mid2,bookController.updateBook)
router.delete("/books/:bookId",mid1,mid2,bookController.deleteBooks)

//_________________________________________Review API_________________________________________

router.post("/books/:bookId/review", reviewController.createReview)
router.put("/books/:bookId/review/:reviewId",reviewController.updateReview)
router.delete("/books/:bookId/review/:reviewId",reviewController.deleteReview)







router.all("/*/", async function (req, res){

    res.status(404).send({status:false, msg: "Wrong url"})
})






module.exports = router