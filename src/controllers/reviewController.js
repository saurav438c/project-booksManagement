const bookModel = require("../models/bookModel");
const validation = require("../validation/validator")
const reviewModel = require("../models/reviewModel");
const ObjectId = require("mongoose").Types.ObjectId;

//----------------------------------------Create Review-----------------------------------------------------

const createReview = async function (req, res) {
    try {
        const reviewData = req.body;
        const bookId = req.params.bookId

        // Validation of Req Body
        if (!validation.isValidRequestBody(reviewData)) return res.status(400).send({ status: false, messege: "Please enter review data" })

        // Validation of book id 

        if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, messege: "Not a valid Book id in url" });

        //find book
        const findBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!findBook) return res.status(404).send({ status: false, message: "No book found" })

        let { reviewedBy, rating, review, isDeleted } = reviewData

        // Validation of reviewby
        if (reviewedBy) {
            if (!validation.isValid(reviewedBy)) return res.status(400).send({ status: false, message: "Please Enter reviwedBy name" });
            if (!validation.isValidName(reviewedBy)) return res.status(400).send({ status: false, message: "Reviewer's Name should contain alphabets only." });
        }
        //Rating Validation
        if (!validation.isValid(rating)) return res.status(400).send({ status: false, messege: "Rating is required" })
        if (((rating < 1) || (rating > 5)) || (!validation.isValidRating(rating)))
            return res.status(400).send({ status: false, message: "Rating must be  1 to 5 numeriacl value" });

        // If review is present
        if (review) {
            if (!validation.isValid(review)) return res.status(400).send({ status: false, message: "Please Enter any review" });
        }

        if (isDeleted == true) return res.status(400).send({ status: false, message: "You can't add this key at review creation time." })

        reviewData['bookId'] = bookId
        reviewData['reviewedAt'] = new Date()


        //Creating Review data
        const createReview = await reviewModel.create(reviewData)

        // Getting new Review data
        const reviewList = await reviewModel.findOne({ _id: createReview._id }).select({ isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 })

        // Updating the review count
        const updatingReviewCount = await bookModel.findOneAndUpdate({ _id: bookIdParams }, { $inc: { reviews: +1 } }, { new: true }).select({ __v: 0 })

        // reviews list
        const bookWithReview = updatingReviewCount.toObject()
        bookWithReview['reviewsData'] = reviewList

        res.status(201).send({ status: true, messege: "Review Successful", data: bookWithReview })


    } catch (err) {
        return res.status(500).send({ status: false, messege: err.message })
    }
}




module.exports.createReview = createReview