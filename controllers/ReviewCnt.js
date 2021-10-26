const express = require('express')
const catchAsync = require('./../utils/catchAsyncron.js')
const Review = require('./../models/reviewmodel')
const Factory = require('./FactoryHandler')


// exports.getReviews = catchAsync(async (req,res,next) => {

//     let filter = {}
//     if(req.params.tourid ) filter = {tour : req.params.tourid }
//     if(req.params.id ) filter = {_id : req.params.id }
//     console.log(filter);
//     const Reviews = await Review.find(filter)

//     res.status(200).json({
//         message : "Successfuly",
//         result : Reviews.length,
//         Reviews
//     })
// }) 

exports.setTourUserIds = (req, res, next) => {
    // Allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
  };


// exports.addReview = catchAsync(async (req,res,next) => {
//     // if(!req.body.tour) req.body.tour = req.params.tourid
//     // if(!req.body.user) req.body.user = req.user._id
    
//     const NewReview = await Review.create(req.body)
    
//     res.status(200).json({
//         message : "Review Add +" ,
//         NewReview
//     })
// } )

exports.addReview = Factory.createOne(Review)

exports.getReviews = Factory.getAll(Review)
exports.deleteReview= Factory.deleteOne(Review)
exports.updatereview= Factory.updateOne(Review)
