const jwt=require("jsonwebtoken")
const mongoose=require("mongoose")


//Authentication

const mid1 = async function (req, res, next){
    try {
        let token = req.headers["x-api-key"] || req.headers["X-API-KEY"];
        if (!token) return res.status(401).send({ status: false, msg: "JWT Token must be present" });

        let decodedToken=await jwt.verify(token, "project3group20")
        if(!decodedToken) return res.status(401).send({status:false, message:"Invalid token."})

        req.userId=decodedToken.userId

        next();

    } catch (err) {
        return res.status(500).send({ msg: "Error", error: err.message })
    }
}
//Authorization

const mid2 = async function (req, res, next) {
    try {
        let token = req.headers['x-api-key']
        if (!token) return res.status(403).send({ status: false, msg: "token must be present in header" })

        let ObjectID = mongoose.Types.ObjectId
        let decodedToken = jwt.verify(token, "project3group20")
        if (req.body.userId) {
            let userId = req.body.userId
            if (!ObjectID.isValid(userId)) { return res.status(400).send({ status: false, message: "Not a valid userId" }) }
            if (userId != decodedToken.userId) {
              
                return res.status(403).send({ status: false, message: "You are not a authorized user" })
                
            }
            return next()  
        }
        if (req.params.bookId) {
            let bookId = req.params.bookId
            if (!ObjectID.isValid(bookId)) { return res.status(400).send({ status: false, message: "Not a valid bookId" }) }
            let check = await bookModel.findById(bookId)
            if (!check) { return res.status(404).send({ status: false, message: "No such book exists" }) }
            if (check.userId != decodedToken.userId) {
                return res.status(403).send({ status: false, message: "You are not a authorized user" })
            }
            return next()
        }
        else {
            return res.status(403).send({ status: false, message: "userId is mandatory" })
        }
       
    }catch(err){
        res.status(500).send({ status: false, message: err.message })
    }
}
module.exports= {mid1,mid2}