const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')


///_________________________________________test api_________________________________________
router.get('/test-me',  function(req, res){
    res.send({status:true, message : "test-api working fine"})
})


//_________________________________________User Api's_________________________________________
router.post('/register', UserController.registerUser)// user creation 
router.post('/login', UserController.userLogin)//user login













module.exports = router