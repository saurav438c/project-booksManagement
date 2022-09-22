const bookModel = require("../models/bookModel");
const validation = require("../validation/validator")
const userModel = require("../models/userModel");
const reviewModel = require("../models/reviewModel");
const ObjectId = require("mongoose").Types.ObjectId;



const createBook = async function (req, res) {
    try {
        const data = req.body;
        // ------------------------------Validate Request Body------------------------------
        if (!validation.isValidRequestBody(data)) return res.status(400).send({ status: false, message: "No input by user." });

        // ------------------------------Destructuring request body------------------------------
        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt, isDeleted } = data;

        //------------------------------ Validate title------------------------------
        if (!validation.isValid(title)) return res.status(400).send({ status: false, message: "Book title is required" });
        if (!validation.isValidName(title)) return res.status(400).send({ status: false, message: "title shoud be in alphabates" })

        const uniqueTitle = await bookModel.findOne({ title });
        if (uniqueTitle) return res.status(400).send({ status: false, message: "Title already exists" });

        // ------------------------------Validate excerpt------------------------------
        if (!validation.isValid(excerpt)) return res.status(400).send({ status: false, message: "Book excerpt is required" })

        // ------------------------------Validate userId------------------------------
        if (!validation.isValid(userId)) return res.status(400).send({ status: false, message: "userId is required" });
        if (!ObjectId.isValid(userId)) return res.status(400).send({ status: false, message: "Not a valid user id" });

        const validUser = await userModel.findById(userId);
        if (!validUser) return res.status(404).send({ status: false, message: "UserId doesn't exist" });

        // ------------------------------Validate ISBN------------------------------
        if (!validation.isValid(ISBN)) return res.status(400).send({ status: false, message: "ISBN is required" });
        if (!validation.isValidISBN(ISBN)) return res.status(400).send({ status: false, message: "Not a Valid ISBN. (Only 10 or 13 digit number.)" });

        const uniqueISBN = await bookModel.findOne({ ISBN: ISBN });
        if (uniqueISBN) return res.status(400).send({ status: false, message: "ISBN already exists" });

        //------------------------------Validate category------------------------------
        if (!validation.isValid(category)) return res.status(400).send({ status: false, message: "category is required" });
        if (!validation.isValidName(category)) return res.status(400).send({ status: false, message: "Category is not valid(Should cointain alphabets only)" });

        //------------------------------Validate subcategory------------------------------
        if (!validation.isValid(subcategory)) return res.status(400).send({ status: false, message: "Subcategory is required" });
        if (!validation.isValidName(subcategory)) return res.status(400).send({ status: false, message: "SubCategory is not valid(Should cointain alphabets only)" });

        //------------------------------Validate releasedAt------------------------------
        if (!validation.isValid(releasedAt)) return res.status(400).send({ status: false, message: "Release date is Required" })
        if (!validation.isValidDate(releasedAt)) return res.status(400).send({ status: false, message: "Date should be valid & format will YYYY-MM-DD" })

        // ------------------------------Can't Set deleted true at creation time------------------------------
        if (isDeleted == true) return res.status(400).send({ status: false, message: "You can't add this key at book creation time." })

        const savedBook = await bookModel.create(data);
        return res.status(201).send({ status: true, message: "Book Created Successfully", data: savedBook });


    } catch (err) {
        res.status(500).send({ msg: err.message });
    }
}

//========================================== Get books by query==============================

const getBook = async function (req, res) {
    try {
        const userQuery = req.query;
        //-------------------If any other query present in query param------------------------------
        getFilter = Object.keys(userQuery)
        if (getFilter.length) {
            for (let value of getFilter) {
                if (['category', 'userId', 'subcategory'].indexOf(value) == -1)
                    return res.status(400).send({ status: false, message: `You can't filter Using '${value}' ` })
            }
        }
        //-------------------only get books which are not deleted---------------------------------
        const filterBook = { isDeleted: false };
        const { userId, category, subcategory } = userQuery;

        //---------------------------Validation for user id-------------------------------------------
        if (userId) {
            if (!ObjectId.isValid(userId)) {
                return res.status(400).send({ status: false, message: "Invalid UserId" });
            }
            else {
                const finduserId = await userModel.findById(userId)
                if (!finduserId) return res.status(404).send({ status: false, msg: "user id is not present in  user collection" })
                else {
                    filterBook["userId"] = userId;
                }
            }
        }
        //------------------------------------check validation of category--------------------------------------
        if (validation.isValid(category)) {
            filterBook["category"] = category;
        }
        //------------------------------------check validation of subcategory--------------------------------------
        if (validation.isValid(subcategory)) {
            filterBook["subcategory"] = subcategory;
        }
        //-------------------------- find books and select the keys------------------------------------------
        const findBook = await bookModel.find(filterBook).select({ title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 })

        if (findBook.length == 0) return res.status(404).send({ status: false, message: "Book not found" });

        //------------------------------------Sort Alphabetically by title-----------------------------------
        const sortBook = findBook.sort((a, b) => a.title.localeCompare(b.title)); //using arrow function  and local compare function
        return res.status(200).send({ status: true, message: "Book List", data: sortBook });

    } catch (err) {
        res.status(500).send({ msg: err.message });
    }

}

// ================================================Get books reviews =============================================

const getReviewsBook = async function (req, res) {
    try {
        const bookId = req.params.bookId
        // ------------------------------Book id validation------------------------------
        if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "Not a valid book id" })

        // ------------------------------Find Book ------------------------------  
        const findBook = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({ __v: 0 })
        if (!findBook) return res.status(404).send({ status: false, message: "No books found." })

        // ------------------------------Find Books Reviews------------------------------
        const getReviews = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({ isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 })

        //------------------------------Assigning reviewdata key------------------------------
        let booksWithReview = findBook.toObject()
        booksWithReview['reviewsData'] = getReviews

        res.status(200).send({ status: true, message: "Book List", data: booksWithReview })


    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }

}

const updateBook = async function (req, res) {
    try {

        const bookId = req.params.bookId
        const data = req.body
        
        if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "Invalid bookId" });

        const findBook = await bookModel.findOne({ _id: bookId, isDeleted: false })

        if (!findBook) return res.status(404).send({ status: false, message: "Book not found" });

        const { title, excerpt, ISBN, releasedAt, } = data;

        if (!validation.isValidRequestBody(data)) return res.status(400).send({ status: false, message: "Please enter details to update the book" });
        //...........for title............
        if (title == "") {
            return res.status(400).send({ status: false, message: "title cant empty" })
        }
        else if (title) {
            if (!validation.isValid(title) || !validation.isValidName(title))
                return res.status(400).send({ status: false, message: "title is invalid or only take alphabetes" });

            const uniqueTitle = await bookModel.findOne({ title });
            if (uniqueTitle) return res.status(400).send({ status: false, message: "Title already exists" });

        }
        //...............for ISBN.................
        if (ISBN == "") {
            return res.status(400).send({ status: false, message: "ISBN cant be empty" })
        }
        else if (ISBN) {
            if (!validation.isValid(ISBN) || !validation.isValidISBN(ISBN))
                return res.status(400).send({ status: false, message: "ISBN is invalid or only take 10 or 13 digit numbers" });

            const uniqueISBN = await bookModel.findOne({ ISBN });
            if (uniqueISBN) return res.status(400).send({ status: false, message: "ISBN already exists" });
        }
        //....................excerprt......................

        if (excerpt == "") {
            return res.status(400).send({ status: false, message: "excerpt cant empty" })
        }
        // else if (excerpt) {
        //     if (!validation.isValid(excerpt))
        //         return res.status(400).send({ status: false, message: "excerpt is invalid " });
        // }
        //...................for released at.............
        if (releasedAt == "") {
            return res.status(400).send({ status: false, message: "releasedAt cant empty" })
        }
        else if (releasedAt) {
            if (!validation.isValidDate(releasedAt))
                return res.status(400).send({ status: false, message: "releasedAt is invalid " });
        }
        const updateDetails = await bookModel.findOneAndUpdate({ _id: bookId }, data, { new: true })
        return res.status(200).send({ status: false, message: " book updated successfully ", data: updateDetails });
    }
    catch (err) {

        return res.status(500).send({ status: false, message: err });


    }
}

const deleteBooks = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        if (!ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, message: "Incorrect BookId format" });
        }
        let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) {
            return res.status(404).send({ status: false, message: "book not found" })
        }
       
         const deleteBook = await bookModel.findByIdAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt:new Date() } }, { new: true }) 
            return res.status(200).send({ status: true, message: "Book Successfully deleted",data : deleteBook }) 

    
        }
        

    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.createBook = createBook;
module.exports.getBook = getBook
module.exports.getReviewsBook = getReviewsBook
module.exports.updateBook = updateBook;
module.exports.deleteBooks =deleteBooks