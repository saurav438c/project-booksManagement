const UserModel = require("../models/userModel");

//=========================================//

const isValid = function (value) {
  if (typeof value == "undefined" || value == null) return false;
  if (typeof value == "string" && value.trim().length > 0) return true;
};

const isValidRequestBody = function (object) {
  return Object.keys(object).length > 0;
};

const isValidEmail = function (email) {
  const regexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regexForEmail.test(email);
};

const isValidPhone = function (phone) {
  const regexForMobile = /^[6-9]\d{9}$/;
  return regexForMobile.test(phone);
};

//=======================================================///



const registerUser = async function (req, res) {
  try {
    const requestBody = req.body;

    if (!isValidRequestBody(requestBody)) {
      return res
        .status(400)
        .send({
          status: false,
          message: "user data is required to create a new user",
        });
    }

    
    const { title, name, phone, email, password, address } = requestBody;

    if (!isValid(title)) {
      return res
        .status(400)
        .send({
          status: false,
          message: `title is required and should be valid format like: Mr/Mrs/Miss`,
        });
    }

    if (!["Mr", "Mrs", "Miss"].includes(title.trim())) {
      return res
        .status(400)
        .send({
          status: false,
          message: `title must be provided from these values: Mr/Mrs/Miss`,
        });
    }

    if (!isValid(name)) {
      return res
        .status(400)
        .send({
          status: false,
          message: `name is required and should be in valid format like : JOHN`,
        });
    }

    if (!isValid(phone)) {
      return res
        .status(400)
        .send({ status: false, message: "mobile number is required" });
    }

    if (!isValidPhone(phone)) {
      return res
        .status(400)
        .send({
          status: false,
          message:
            " please enter a valid 10 digit mobile number without country code and 0",
        });
    }

    const isPhoneUnique = await UserModel.findOne({ phone });

    if (isPhoneUnique) {
      return res
        .status(400)
        .send({
          status: false,
          message: `mobile number: ${phone} already exist`,
        });
    }

    if (!isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "email address is required" });
    }

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .send({
          status: false,
          message: " please enter a valid email address",
        });
    }

    const isEmailUnique = await UserModel.findOne({ email });

    if (isEmailUnique) {
      return res
        .status(400)
        .send({ status: false, message: `email: ${email} already exist` });
    }

    if (!isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "password is required" });
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/.test(password)) {
      return res
        .status(400)
        .send({
          status: false,
          message:
            "password should be: 8 to 15 characters, at least one letter and one number ",
        });
    }
    const userData = {
      title: title.trim(),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      password: password,
      address : address
    };

    const newUser = await UserModel.create(userData);

    res
      .status(201)
      .send({
        status: true,
        message: "new user registered successfully",
        data: newUser,
      });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};


module.exports.registerUser = registerUser