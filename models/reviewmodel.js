const mongoos = require('mongoose')

const ReviewSchema = new mongoos.Schema({
    review : {
        type : String ,
        mix : 10,
        required : [true , "This champ is required"]
    },
    rating : {
        type : Number,
        required : [true , "rating is require"]

    },
    CreatedAt : {
        type : Date,
        default : Date.now
    } , 
    tour : {
        type : mongoos.Schema.ObjectId,
        ref : "Tour",
        required : [true , "Review must belong to a Tour"]
    },
    user : {
        type : mongoos.Schema.ObjectId,
        ref : "User",
        required : [true  , "review must belong to user"]
    }
},{
    toJSON : {virtual : true},
    toObject : {virtual:true}
})

ReviewSchema.pre(/^find/ , function(next) {
    this.populate({
        path : "user",
        select:'_id name'
    }).populate({
        path : "tour",
        select : "_id name description"
    })
    next()
})

const Review = mongoos.model('Review', ReviewSchema)


module.exports = Review