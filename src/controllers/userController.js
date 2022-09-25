const userModel = require("../models/userModel");
const validation = require("../validation/validator")
const jwt = require("jsonwebtoken")


//=======================================================///


//___________________________________CREATE USER___________________________________
const registerUser = async function (req, res) {
  try {
    const requestBody = req.body;
    const { title, name, phone, email, password, address } = requestBody;

    //===================================== if Empty Body ========================================
    if (!validation.isValidRequestBody(requestBody)) {
      return res.status(400).send({ status: false, message: "Invalid request params please provide some data" });
    }
    //========================================== if Title missing & not Valid============================
    if (!validation.isValid(title)) {
      return res.status(400).send({ status: false, message: `title is required` });
    }
    if (!validation.isValidTitle(title)) return res.status(400).send({ status: false, msg: "title only take mrs , mr , miss" })
    //================================================= If Name Missing and Not Valid =========================
    if (!validation.isValid(name)) {
      return res.status(400).send({ status: false, message: `name is required ` });
    }
    if (!validation.isValidName(name)) {
      return res.status(400).send({ status: false, message: `name is only  take alphabates` });
    }


    //=============================If PhONE Missing and Not Valid and ALready Exists ==========================
    if (!validation.isValid(phone)) {
      return res.status(400).send({ status: false, message: "mobile number is required" });
    }
    if (!validation.isValidPhone(phone)) {
      return res.status(400).send({ status: false, message: " please enter a valid 10 digit mobile number" });
    }
    const isPhoneUnique = await userModel.findOne({ phone });
    if (isPhoneUnique) {
      return res.status(400).send({ status: false, message: `mobile number: ${phone} already exist`, });
    }
    //========================= If Email Missing and Not Valid and ALready exists ====================
    if (!validation.isValid(email)) {
      return res.status(400).send({ status: false, message: "email address is required" });
    }
    if (!validation.isValidEmail(email)) {
      return res.status(400).send({ status: false, message: " please enter a valid email address", });
    }
    const isEmailUnique = await userModel.findOne({ email });
    if (isEmailUnique) {
      return res.status(400).send({ status: false, message: `email: ${email} already exist` });
    }
    //=============================== IF Password Missing and Not Valid  ==========================
    if (!validation.isValid(password)) {
      return res.status(400).send({ status: false, message: "password is required" });
    }
    if (!validation.isValidPassword(password)) {
      return res.status(400).send({ status: false, message: "please enter valid password" });
    }
    // ================================== Address Validation ===============================
    if (!validation.isValid(address)) {
      return res.status(400).send({ status: false, message: "please enter address" });
    }
    //============================================User creation ==================================
    const newUser = await userModel.create(requestBody);
    res.status(201).send({ status: true, message: "new user registered successfully", data: newUser });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

//___________________________________ USER LOGIN___________________________________
const userLogin = async function (req, res) {
  try {

    let data = req.body;
    // -------------------------------------Validation of input------------------------------------
    if (!validation.isValidRequestBody(data)) {
      return res.status(400).send({ status: false, message: "please enter login credential (email and password)" });
    }

    const { email, password } = data;

    // -------------------------------------Input Value Validation-------------------------------------
    if (!validation.isValid(email)) return res.status(400).send({ status: false, message: "Please enter the emailId" })
    if (!validation.isValid(password)) return res.status(400).send({ status: false, message: "Please enter the password" })
    // -----------------------------------Validation email & password ----------------------------------------
    if (!validation.isValidEmail(email)) return res.status(400).send({ status: false, message: "Please enter the valid emailId" })
    if (!validation.isValidPassword(password)) return res.status(400).send({ status: false, message: "Please enter the valid password" })
    // --------------------------------------Finding the Email and Password------------------------------
    const loginUser = await userModel.findOne({ email, password });
    if (!loginUser) return res.status(404).send({ status: false, msg: "email and password not found" });

    //-----------------------------------token creation part here:-------------------------------------------
    const token = await jwt.sign({
      userId: loginUser._id, group: "group20", iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 20 * 60 * 60
      
    }, "project3group20");
    // -------------------------Set header------------------------
    res.setHeader("x-api-key", token);
    //------------------------------ Successful Token generated ----------------------------------------
    res.status(200).send({ status: true, msg: "user successfully loged in ", data: { token } })

  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}

module.exports.registerUser = registerUser;
module.exports.userLogin = userLogin;