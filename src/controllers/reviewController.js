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

        // if reviewBy is present
        if (reviewedBy=="") {
            return res.status(400).send({ status: false, message: "reviewedBy cant empty" })
            
         } else if(reviewedBy) {
            
            if (!validation.isValidName(reviewedBy)) return res.status(400).send({ status: false, message: "Reviewer's Name should contain alphabets only." });
        }
        //Rating Validation
        if (!validation.isValid(rating)) return res.status(400).send({ status: false, messege: "Rating is required" })
        if (((rating < 1) || (rating > 5)) || (!validation.isValidRating(rating)))
            return res.status(400).send({ status: false, message: "Rating must be  1 to 5 numerical value" });

        // If review is not present
        if (!review) {
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
        const updatingReviewCount = await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: +1 } }, { new: true }).select({ __v: 0 })

        // reviews list
        const bookWithReview = updatingReviewCount.toObject()
        bookWithReview['reviewsData'] = reviewList

         return res.status(201).send({ status: true, messege: " Created Review Successful", data: bookWithReview })


    } catch (err) {
        return res.status(500).send({ status: false, messege: err.message })
    }
}

//......................for updateReview................
const updateReview =async function (req,res){
    try {
        const bookId= req.params.bookId
        const reviewId= req.params.reviewId
        const data=req.body

        if (!validation.isValidRequestBody(data)) return res.status(400).send({ status: false, messege: "Please enter review data" })
        
        if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, messege: "Not a valid Book id in url" });

        if (!ObjectId.isValid(reviewId)) return res.status(400).send({ status: false, messege: "Not a valid review id in url" });
        // find book
        const findBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!findBook) return res.status(404).send({ status: false, message: "No book found" })
        //find review
        const findreview = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!findreview) return res.status(404).send({ status: false, message: "No review found" })

        const{reviewedBy,rating,review} =data

        // if reviewBy is present
        if (reviewedBy=="") {
            return res.status(400).send({ status: false, message: "reviewedBy cant empty" })
            
         } else if(reviewedBy) {
            
            if (!validation.isValidName(reviewedBy)) return res.status(400).send({ status: false, message: "Reviewer's Name should contain alphabets only." });
        }

        data["reviewedBy"]= reviewedBy;

        //Rating Validation
        if (!validation.isValid(rating)) return res.status(400).send({ status: false, messege: "Rating is required" })
        if (((rating < 1) || (rating > 5)) || (!validation.isValidRating(rating)))
            return res.status(400).send({ status: false, message: "Rating must be  1 to 5 numerical value" });
        data["rating"]=rating;

        // If review is not present
        if (!review) {
            if (!validation.isValid(review)) return res.status(400).send({ status: false, message: "Please Enter any review" });
        }
        data["review"]=review;

        const updatedReview= await reviewModel.findOneAndUpdate({_id:reviewId},data,{new:true}).select({isDeleted:0,createdAt:0,updatedAt:0,__v:0})

        const updatedBookReview= findBook.toObject()
        updatedBookReview["reviewsData"]=updatedReview

        return res.status(200).send({ status: true, messege: " updated Review Successful", data: updatedBookReview })

        
     } catch (err) {
        return res.status(500).send({ status: false, messege: err.message })
        
    }

    
}
const deleteReview = async function(req,res){
    try {
        const bookId= req.params.bookId
        const reviewId= req.params.reviewId
        

        if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, messege: "Not a valid Book id in url" });

        if (!ObjectId.isValid(reviewId)) return res.status(400).send({ status: false, messege: "Not a valid review id in url" });
        // find book
        const findBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!findBook) return res.status(404).send({ status: false, message: "No book found" })
        //find review
        const findreview = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!findreview) return res.status(404).send({ status: false, message: "No review found" })

         await reviewModel.findOneAndUpdate({_id:reviewId},{isDeleted:true})
         await bookModel.findOneAndUpdate({_id:bookId},{$inc:{reviews:-1}})
         return res.status(200).send({ status: true, messege: " Deleted Review Successful" })


        } catch (err) {
        return res.status(500).send({ status: false, messege: err.message })
        
    }
}




module.exports.createReview = createReview
module.exports.updateReview = updateReview
module.exports.deleteReview = deleteReview