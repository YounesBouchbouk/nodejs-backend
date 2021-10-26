const express = require('express')

//mergeParams:true to get the tourId from the rout 
const routers = express.Router({mergeParams:true})

const reviewcontrollers = require('./../controllers/ReviewCnt')
const autentication = require('./../controllers/authControllers')

routers.route('/').get(autentication.accesautorisation ,reviewcontrollers.getReviews ).post(autentication.accesautorisation , autentication.restrictTo('user'),reviewcontrollers.setTourUserIds ,  reviewcontrollers.addReview)
routers.route('/:id').delete(autentication.accesautorisation , reviewcontrollers.deleteReview).patch(autentication.accesautorisation , reviewcontrollers.updatereview)
                     .get(autentication.accesautorisation , reviewcontrollers.getReviews)
module.exports = routers;