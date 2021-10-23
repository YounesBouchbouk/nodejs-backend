const mongosse = require('mongoose')
const slugify = require('slugify')
const tourShema = new mongosse.Schema({
    name : {
        type : String,
        require : [true , "must a name"] ,
        unique : true,
        trim : true

    },
    slugy : String , 
    duration : {
        type : Number,
        require : [true , "must have duration"]
    },
    maxGroupSize : {
        type : Number,
        require : [true , "needed"],
        default : 5
    },
    difficulty : {
        type : String,
        require : [true , "price have to be"]
    },
    ratingsAverage : {
        type : Number , 
        require : [true , "Must ha ratingsAverage"]
    } , 
    ratingsQuantity  : {
        type : Number , 
        require : [true , "Must ha ratingsQuantity"]
    },
    price : {
        type : Number,
        require : [true , "price have to be"]
    },
    summary : {
        type : String,
        require : [true , "must have sumary"]
    },
    description : {
        type : String,
        require : [true , "must have description"]
    },
    imageCover : {
        type : String,
        require : [true , "image cover needed"]
    },
    images : {
        type : [String],
    },
    startDates : {
        type : [Date],
        require : [true , "price have to be"],
    } , 
    CreatedAt : {
        type : Date,
        default : Date.now()

    },
    secrettour : false 

},{
    toJSON : {virtuals : true},
    toObject : {virtuals:true}
})

//shema virtual colums we can't do query whit them
// tourShema.virtual('durationWeek').get(function(){
//     return this.duration / 7
// })


tourShema.virtual("Review"  , {
    ref : "Review",
    foreignField : 'tour',
    localField : '_id'
})

//pre middlware this middlware execute before any save and create , .post execute after it can take doc s params 
tourShema.pre('save' , function(next) {
    console.log("this is from miiddlware");
    this.slug = slugify(this.name , {lower : true})
    next()
})

//Query middlware
// tourShema.pre(/^find/ , function(next) {  // use /^find/ to use this middlware in all qury startwhith find (findON , FindById)
//     this.find({secrettour :{$ne : true}})
//     this.startDates =  Data.now()
//     next()
// })

// tourShema.post(/^find/ , function(docs, next) {
//     console.log(`this query the  ` , Date.now() - this.startDates);
//     next()
// })

//aggrigation middlware that execute if we use any aggrigation 
tourShema.pre('aggregate' , function(next) {
    //this.papilines is an array hse all objet that we passed in aggrigation
    this.pipeline.unshift({$match : {secrettour :{$ne : true}}})
    next()
})
const Tour = mongosse.model('Tour', tourShema)


module.exports = Tour