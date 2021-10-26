const { Query } = require('mongoose')
const AppErreur = require('../utils/appErreur')
const Tour = require('./../models/tourmodels')
const ApiFeature = require('./../utils/APIfeatures')
const catchAsync = require('./../utils/catchAsyncron.js')
const Factory = require('./FactoryHandler')


// exports.deleteTour = catchAsync(async(req , res ,next ) => {
    
//         const deleted = await Tour.deleteOne({_id : req.params.id})
//         console.log("I'm here");
//         // if(deleted.deletedCount === 0 ) throw("Not Found")
//         res.status(200).json({
//             status : "Deleted succssefuly" , 
//             data : {
//                 deleted
//             }
//         })
        
    
// })


// exports.updateTour = catchAsync(async (req , res ,next) => {
    
    //         console.log(req.body);
    //         const selectedtour = await Tour.findOneAndUpdate(req.params.id , req.body  , {
        //             new: true ,
        //             runValidators: true
        //         })
        
        //         if(!selectedtour) next(new AppErreur('No Tour With This Id ' , 404))
        
        //         res.status(200).json({
            //             status : "successe" , 
            //             data : selectedtour
            //         })
            
            
            // })
            
exports.deleteTour= Factory.deleteOne(Tour)
exports.updateTour = Factory.updateOne(Tour)
exports.getAllTour = Factory.getAll(Tour)


exports.selectTour = catchAsync(async (req , res , next ) => {
    console.log(req.params.id);
    console.log("Hola");
  
        const selctedtoor = await Tour.findById(req.params.id).populate('Review')
        console.log("i'm here");
        res.status(200).json({
            status : "successe",
            data : selctedtoor
        })
        
    
})

exports.addtour = catchAsync(async (req , res ,next) => {
    
        const newtour = await Tour.create(req.body) 
           console.log(newtour);
           res.status(201).json({
               status : "succussesfully",
               data : {
            status : "Done" , 
            message : newtour
        }
    })



})


//middlware that full the query when the lik lik http;//.../api/tours/top5-cheap
exports.aliastopcheap = (req , res , next) => {
    req.query.sort = 'ratingsAverage,price'
    req.query.limite ='5'
    next()
}


// exports.getAllTour = catchAsync(async (req , res , next )  => {
  
//         const featureApi = new ApiFeature(Tour.find(),req.query).filter().sort().limitefields().paningtation()
//     console.log('Im here');
//         const alltours = await featureApi.query
        
//         res.status(200).json({
//             status : "successe",
//             lenght : alltours.length,
//             data : 
//             alltours 
            
//         })
        
   
// })


//analyse data with aggregate
exports.dataanalytics = catchAsync(async (req , res ,next )=> {
  
        const analytics = await Tour.aggregate([
            // {$match :{ ratingsAverage : {$gte : 4.5}}},
            {
                $group : {
                    _id : null ,
                    total : {$sum  : 1},
                    maxprice : {$max : '$price'},
                    averagePrice : {$avg : '$price'}
                }
            }
        ])

        res.status(200).json({
            status : "Sucsees ! ",
            message : analytics
        })
   
})

// whene the link had id , we use this middlware to check if there is a tour with that id thenewe
// we call the middlwares in stack if it we didn't found any on we dont go to next but we return so we 
// quite this

// exports.checkId = (req , res , next , val ) => {
//     const id = val * 1

//     const selectedtour = tours.filter(item => item.id === id )[0]
//     if(!selectedtour) {
//         return res.status(404).send("Not Found")
//     }

//     console.log("this comme from param rout id " , val);
//     next()
// }


// exports.checkBody =  (req , res , next) => {
//     if(!req.body.name ||  !req.body.price) {
//        return  res.status(400).send("bad request")
//     }
//     console.log(req.body);
  
//     next()
// }