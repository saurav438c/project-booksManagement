const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')
const bookController = require("../controllers/bookController")
const middleware = require("../Middlewares/auth")


///_________________________________________test api_________________________________________
router.get('/test-me',  function(req, res){
    res.send({status:true, message : "test-api working fine"})
})

//_________________________________________User Api's_________________________________________
router.post('/register', UserController.registerUser)// user creation 
router.post('/login', UserController.userLogin)//user login

//_________________________________________Book Api's _________________________________________
router.post("/books",middleware.mid1,  bookController.createBook)









module.exports = router