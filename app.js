const express = require('express')
const morgan = require('morgan')
const toursRouting = require('./routers/toursRouter')
const usersRouting = require('./routers/usersRouter')
const appError = require('./utils/appErreur')
const errorcontoulers = require('./controllers/errorCnt')
const app = express()

app.use(express.json())
 
console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'))
}
// create a Middlware 
app.use ((req , res , next ) =>{
    req.requestime = "this come from middlware"
    // console.log(req.headers);
    next()
})

app.use('/api/v1/tours' , toursRouting)
app.use('/api/v1/users' , usersRouting)

app.all('*' , (req , res ,next )=>{

    next(new appError(`Failed ! Page note found ${req.originalUrl}`,404))

} )

//global erruer handiling mddlware 

app.use(errorcontoulers)

module.exports = app


// app.delete('/api/v1/tour/:id' ,deleteTour)
// app.patch('/api/v1/tour/:id' , updateTour)
// app.get('/api/v1/tour/:id' ,selectTour )
// app.post('/api/v1/tours' , addtour)
// app.get('/api/v1/tours' , getAllTour)

// Old methode with app 

// app.route('/api/v1/tours').get(getAllTour).post(addtour)
// app.route('/api/v1/tour/:id') .get(selectTour).delete(deleteTour).patch(updateTour)
// app.route('/api/v1/users').get(getusers).post(adduser)