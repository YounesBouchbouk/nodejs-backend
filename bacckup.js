const { Query } = require('mongoose')
const Tour = require('./../models/tourmodels')


exports.deleteTour = async(req , res ) => {
    try {
        const deleted = await Tour.deleteOne({_id : req.params.id})
        if(deleted.deletedCount == 0 ) throw("Not Found")
        res.status(200).json({
            status : "Deleted succssefuly" , 
            data : {
                deleted
            }
        })
        
    } catch (error) {
        res.status(200).json({
            status : "Failed !" , 
            message : 
            error
            
        })
    }
}

exports.updateTour = async (req , res) => {
    try {
        console.log(req.body);
        const selectedtour = await Tour.findById(req.params.id)
        console.log(selectedtour);
        selectedtour.name = req.body.name
        console.log(selectedtour);
        
        await selectedtour.save()
        res.status(200).json({
            status : "successe" , 
            data : selectedtour
        })
        
    } catch (error) {
        res.status(400).json({
            status:"failed! ",
            message : error
        })
    }
}

exports.selectTour = async (req , res ) => {
    console.log(req.params.id);
    console.log("Hola");
    try {
        const selctedtoor = await Tour.findById(req.params.id)
        res.status(200).json({
            status : "successe",
            data : selctedtoor
        })
        
    } catch (error) {
        res.status(404).json({
            status : "Failed !",
            message : {
                error 
            }
        })
    }
    
}

exports.addtour = async (req , res) => {
    console.log(req.body);
    try {
        const newtour = await Tour.create(req.body) 
           console.log(newtour);
           res.status(201).json({
               status : "succussesfully",
               data : {
            status : "Done" , 
            message : newtour
        }
    })
} catch (error) {
    res.status(404).json({
        status : "fialed",
        message : error
    })
}


}

//middlware that full the query when the lik lik http;//.../api/tours/top5-cheap
exports.aliastopcheap = (req , res , next) => {
    req.query.sort = 'ratingsAverage,price'
    req.query.limite ='5'
    next()
}


exports.getAllTour = async (req , res )  => {
    try {
        const excludeparams = ['page' , 'sort' , 'limite' , 'fields']
        const queryObj = {...req.query}

        //delete page , sort , limite from queryobj
        excludeparams.forEach(el => delete queryObj[el])

        // switch from JSON obj to Js obj to change gte or gt ... to $gte , $gt
        let qurystr =JSON.stringify(queryObj)

        //change it with this line of code !!!!!!!
         qurystr =  qurystr.replace(/\b(gte|gt|lt|lte)\b/g , match => `$${match}` )
        
        //now w send JSON obj in query to have result 
        let query =  Tour.find(JSON.parse(qurystr))

        //sort data 
        if(req.query.sort) {
            //if http://.../sort=price,duration by price thene duration ...
            let sortmultiple = req.query.sort.split(',').join(' ')

            // console.log(sortmultiple);  sortmultiple = 'price duration'
            query = query.sort(sortmultiple)   

        }else {
            //sort by default par date
            query = query.sort('-CreatedAt')   

        }


        //limiting data 
        if(req.query.fields){
            //link https://..../fields=name,price,duration
            let strlimite = req.query.fields.split(',').join(' ')
            // console.log(strlimite); strlimite = name price duration
            query = query.select(strlimite)   // select('duration , price , name ...')
        }

        console.log(req.query);
        //Pagination 
        if(req.query.limite){

            const page = req.query.page * 1 || 1 
            const limite = req.query.limite *1 || 1
            console.log(page , limite);
    
            const skipe = (page - 1 ) * limite;
            console.log(skipe);
    
            query = query.skip(skipe).limit(limite)
    
            if(req.query.page){
                const numTour = await Tour.countDocuments()
                console.log(numTour);
                 if(numTour <= skipe) throw  Error('Page not Found')
            }
        }

        const alltours = await query
        
        res.status(200).json({
            status : "successe",
            lenght : alltours.length,
            data : 
            alltours 
            
        })
        
    } catch (error) {
        res.status(404).json({
            status : "Failed !",
            message : {
                error 
            }
        })
    }
}

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