const ApiFeature = require('./../utils/APIfeatures')
const catchAsync = require('./../utils/catchAsyncron.js')

exports.deleteOne = Model => catchAsync(async(req , res ,next ) => {
    
    const Doc = await Model.deleteOne({_id : req.params.id})
    console.log("I'm here");
    // if(deleted.deletedCount === 0 ) throw("Not Found")
    res.status(200).json({
        status : "Deleted succssefuly" , 
        data : {
            Doc
        }
    })
    

})


exports.updateOne = Model => catchAsync(async (req , res ,next) => {
   console.log("I'm gon update");
   console.log(req.params.id );
   console.log(req.body);
   
    
    const Doc = await Model.findOneAndUpdate(req.params.id , req.body  , {
        new: true ,
        runValidators: true
    })

    // const Doc = await Model.findById(req.params.id)

    console.log(Doc);
   
    if(!Doc) next(new AppErreur('No Doc With This Id ' , 404))
    
    res.status(200).json({
        status : "successe" , 
        data : null
    })
    

})

exports.getAll = Model =>  catchAsync(async (req , res , next )  => {

    let filter = {}
    if(req.params.tourid ) filter = {tour : req.params.tourid }
    if(req.params.id ) filter = {_id : req.params.id }
  
    const featureApi = new ApiFeature(Model.find(filter),req.query).filter().sort().limitefields().paningtation()
console.log('Im here');
    const doc = await featureApi.query
    
    res.status(200).json({
        status : "successe",
        lenght : doc.length,
        data : 
        doc 
        
    })
    

})



exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });


  exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });