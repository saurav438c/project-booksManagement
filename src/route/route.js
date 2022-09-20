const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')



router.get('/test-me',  function(req, res){
    res.send({status:true, message : "test-api working fine"})
})



router.post('/register', UserController.registerUser)

router.post('/login', UserController.userLogin)

module.exports = router