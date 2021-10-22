const express = require('express')
const routers = express.Router()
const userscontrollers = require('./../controllers/userscnt')
const authControllers = require('./../controllers/authControllers')

routers.post('/signUp' , authControllers.signup)
routers.post('/signin' , authControllers.signin)

routers.post('/forgotPassword', authControllers.forgotPassword);
routers.patch('/resetPassword/:token', authControllers.resetPassword);

routers.patch(
  '/updateMyPassword',
  authControllers.accesautorisation,
  authControllers.updatePassword
);



routers.route('/').get(userscontrollers.getAllUsers)






module.exports = routers