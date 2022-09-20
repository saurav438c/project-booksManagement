
//=================validation========================//

const isValid = function (value) {
    if (typeof value == "undefined" || value == null) return false;
    if (typeof value == "string" && value.trim().length==0) return false;

    return true
  };
  
  const isValidRequestBody = function (object) {
    return Object.keys(object).length > 0;
  };
  
  const isValidEmail = function (email) {
    const regexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regexForEmail.test(email);
  };
  
  const isValidPhone = function (phone) {
    const regexForMobile =/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;
    return regexForMobile.test(phone);
  };
  
  const isValidName = function (name) {
    const regexForName = /^[A-Za-z ]+$/
   return regexForName.test(name);
  };
  
  //title validation
const isValidTitle = function (title) {
    return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1
};


//password validation
const isValidPassword = function (password) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/

    return passwordRegex.test(password)
}

module.exports = {isValid,isValidRequestBody, isValidEmail, isValidPhone, isValidName ,isValidTitle,isValidPassword }





