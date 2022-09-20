const userModel = require("../models/userModel");
const UserModel = require("../models/userModel");

const validation = require("../validation/validator")
const jwt = require("jsonwebtoken")


//=======================================================///



const registerUser = async function (req, res) {
  try {
    const requestBody = req.body;
    const { title, name, phone, email, password, address } = requestBody;


    if (!validation.isValidRequestBody(requestBody)) {
      return res.status(400).send({status: false,message: "user data is required to create a new user"});
    }
    if (!validation.isValid(title)) {
      return res.status(400).send({status: false,message: `title is required`});
    }
    if(!validation.isValidTitle) return res.status(400).send({status:false , msg :"title only take mrs , mr , miss"}) 

    if (!validation.isValid(name)) {
      return res.status(400).send({status: false, message: `name is required `});
    }

    if (!validation.isValidName(name)) {
      return res.status(400).send({status: false, message: `name is only  take alphabates`});
    }


    if (!validation.isValid(phone)) {
      return res.status(400).send({ status: false, message: "mobile number is required"});
    }

    
    if (!validation.isValidPhone(phone)) {
      return res.status(400).send({status: false,message:" please enter a valid 10 digit mobile number"});
    }

    const isPhoneUnique = await UserModel.findOne({ phone });

    if (isPhoneUnique) {
      return res.status(400).send({status: false, message: `mobile number: ${phone} already exist`, });
    }

    if (!validation.isValid(email)) {
      return res.status(400).send({ status: false, message: "email address is required" });
    }

    if (!validation.isValidEmail(email)) {
      return res.status(400).send({status: false,message: " please enter a valid email address", });
    }

    const isEmailUnique = await UserModel.findOne({ email });

    if (isEmailUnique) {
      return res.status(400).send({ status: false, message: `email: ${email} already exist` });
    }

    if (!validation.isValid(password)) {
      return res.status(400).send({ status: false, message: "password is required" });
    }

    if (!validation.isValidPassword(password)) {
      return res.status(400).send({ status: false, message: "please enter valid password" });
    }

    if (!validation.isValid(address)) {
      return res.status(400).send({ status: false, message: "please enter address" });
    }

    const newUser = await UserModel.create(requestBody);

    res.status(201).send({status: true, message: "new user registered successfully",data: newUser});
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};


const userLogin = async function(req , res){
  try{

  let data = req.body ;

  if (!validation.isValidRequestBody(data)) {
    return res.status(400).send({status: false,message: "please enter login credential (email and password)"});
  }

  const {email , password}=data;
  if (!validation.isValid(email)) return res.status(400).send({ status: false, message: "Please enter the emailId" })
    if (!validation.isValid(password)) return res.status(400).send({ status: false, message: "Please enter the password" })

    if (!validation.isValidEmail(email)) return res.status(400).send({ status: false, message: "Please enter the valid emailId" })
    if (!validation.isValidPassword(password)) return res.status(400).send({ status: false, message: "Please enter the valid password" })

    const loginUser = await userModel.findOne({email , password});
    if (!loginUser) return res.status(404).send({status : false , msg : "email and password not found"});


    const token = await jwt.sign({userID :loginUser._id, group:"group20", iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 20 * 60 * 60},"project3group20");
    res.setHeader("x-api-key", token);
    res.status(200).send({status : true , msg : "user successfully loged in ", data : {token}})
}catch(err){ return res.status(500).send({status : false , msg: err.message})
}
}

module.exports.registerUser = registerUser;
module.exports.userLogin = userLogin;