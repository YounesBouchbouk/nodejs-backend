const express = require('express')


const routers = express.Router()

const tourscontrollers = require('./../controllers/toursCnt')
const autentication = require('./../controllers/authControllers')

// routers.param('id' , tourscontrollers.checkId)
routers.route('/top-5-cheap-tours')
    .get(tourscontrollers.aliastopcheap , tourscontrollers.getAllTour)

routers.route('/analitics')
    .get(tourscontrollers.dataanalytics)

routers.route('/')
    .get(autentication.accesautorisation,tourscontrollers.getAllTour)
    .post(tourscontrollers.addtour)
routers.route('/:id').get(tourscontrollers.selectTour)
    .delete(autentication.accesautorisation , autentication.restrictTo('admin' , 'lead-guide') ,tourscontrollers.deleteTour)
    .patch(tourscontrollers.updateTour)

module.exports = routers;