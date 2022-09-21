const bookModel = require("../models/bookModel");
const validation = require("../validation/validator")
const userModel = require("../models/userModel");
const ObjectId = require("mongoose").Types.ObjectId;



const createBook = async function (req, res) {
    try {
        const data = req.body; 
    // Validate Request Body
        if (!validation.isValidRequestBody(data)) return res.status(400).send({ status: false, message: "No input by user." });

        // Destructuring request body
        const { title, excerpt, userId, ISBN, category,subcategory, releasedAt, isDeleted } = data;

         // Validate title
    if (!validation.isValid(title)) return res.status(400).send({ status: false, message: "Book title is required" });
    if(!validation.isValidName(title))return res.status(400).send({status : false , message : "title shoud be in alphabates"})

    const uniqueTitle = await bookModel.findOne({ title });
    if (uniqueTitle) return res.status(400).send({ status: false, message: "Title already exists" });

    // Validate excerpt
    if (!validation.isValid(excerpt)) return res.status(400).send({ status: false, message: "Book excerpt is required" })

    // Validate userId
    if (!validation.isValid(userId)) return res.status(400).send({ status: false, message: "userId is required" });
    if (!ObjectId.isValid(userId)) return res.status(400).send({ status: false, message: "Not a valid user id" });

        const validUser = await userModel.findById(userId);
        if (!validUser) return res.status(404).send({ status: false, message: "UserId doesn't exist" });

        // Validate ISBN
        if (!validation.isValid(ISBN)) return res.status(400).send({ status: false, message: "ISBN is required" });
        if (!validation.isValidISBN(ISBN)) return res.status(400).send({ status: false, message: "Not a Valid ISBN. (Only 10 or 13 digit number.)" });

        const uniqueISBN = await bookModel.findOne({ ISBN: ISBN });
        if (uniqueISBN) return res.status(400).send({ status: false, message: "ISBN already exists" });

        //Validate category
        if (!validation.isValid(category)) return res.status(400).send({ status: false, message: "category is required" });
        if (!validation.isValidName(category)) return res.status(400).send({ status: false, message: "Category is not valid(Should cointain alphabets only)" });
         //Validate subcategory
         if (!validation.isValid(subcategory)) return res.status(400).send({ status: false, message: "Subcategory is required" });
         if (!validation.isValidName(subcategory)) return res.status(400).send({ status: false, message: "SubCategory is not valid(Should cointain alphabets only)" });
         //Validate releasedAt
        if (!validation.isValid(releasedAt)) return res.status(400).send({ status: false, message: "Release date is Required" })
        if (!validation.isValidDate(releasedAt)) return res.status(400).send({ status: false, message: "Date should be valid & format will YYYY-MM-DD" })

          // Can't Set deleted true at creation time
          if (isDeleted == true) return res.status(400).send({ status: false, message: "You can't add this key at book creation time." })

          const savedBook = await bookModel.create(data);
          return res.status(201).send({ status: true, message: "Book Created Successfully", data: savedBook });


    } catch (err) {
         res.status(500).send({ msg: err.message });
    }
}

module.exports.createBook =createBook;