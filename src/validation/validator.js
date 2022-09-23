
//=================validation========================//

//_________________________________________value validation_________________________________________
const isValid = function (value) {
  if (typeof value == "undefined" || value == null) return false;
  if (typeof value == "string" && value.trim().length == 0) return false;
  return true
};
//_________________________________________request body validation_________________________________________
const isValidRequestBody = function (object) {
  return Object.keys(object).length > 0;
};
//_________________________________________email validation_________________________________________
const isValidEmail = function (email) {
  const regexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regexForEmail.test(email);
};

//_________________________________________mobile number validation_________________________________________
const isValidPhone = function (phone) {
  const regexForMobile = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;
  return regexForMobile.test(phone);
};

//_________________________________________name  validation_________________________________________
const isValidName = function (name) {
  const regexForName = /^[A-Za-z ]+$/
  return regexForName.test(name);
};

//_________________________________________title validation_________________________________________
const isValidTitle = function (title) {
  return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1
};

//_________________________________________password validation_________________________________________
const isValidPassword = function (password) {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
  return passwordRegex.test(password)
}
//_________________________________________ISBN Validation_________________________________________
const isValidISBN = function (ISBN) {
  const ISBNRegex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
  return ISBNRegex.test(ISBN)
}
//_________________________________________Date Validation_________________________________________
const isValidDate = function (date) {
  const dateRegex = /^\d{4}-(02-(0[1-9]|[12][0-9])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))$/
  return dateRegex.test(date)
}

//_________________________________________Rating validation_________________________________________
const isValidRating = function (rating) {
  const ratingRegex = /^[\1-5]*$/
  return ratingRegex.test(rating)
}


//_________________________________________exporting part_________________________________________
module.exports = { isValid, isValidRequestBody, isValidEmail, isValidPhone, isValidName, isValidTitle, isValidPassword, isValidISBN, isValidDate,isValidRating }





