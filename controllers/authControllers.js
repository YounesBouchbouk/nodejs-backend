const User = require('./../models/userModel')
const {promisify} = require('util');
const catchAsync = require('./../utils/catchAsyncron.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const AppError = require("./../utils/appErreur");
const { nextTick } = require('process');
const sendEmail = require("./../utils/email")
const crypto = require("crypto")

const creetoken = (id) =>{
    return jwt.sign({id } ,process.env.TOKEN_SECRET, {
        expiresIn : process.env.TOKEN_TIMER
    })
}


const createSendToken = (user, statusCode, res) => {
    const token = creetoken(user._id);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  
    res.cookie('jwt', token, cookieOptions);
  
    // Remove password from output
    user.password = undefined;
  
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  };

exports.signup = catchAsync(async (req,res,next) => {
    console.log(req.body);
    // const newuser = await User.create({
    //     name : req.body.name,
    //     password : req.body.password , 
    //     passwordConfirm : req.body.passwordConfirm,
    //     email : req.body.email
    // })
    const newuser = await User.create(req.body)

    createSendToken(newuser,201,res)

    // const token = creetoken(newuser._id)

    // res.status(201).json( {
    //     status: "Succusses",
    //     token,
    //     data : {newuser}
    // })
})



exports.signin = catchAsync(async (req,res,next) => {
    const {email , password } = req.body


        if(!email || !password) return next()

            const issetuser = await User.findOne({email : email}).select('+password')

            
        if( issetuser && (await issetuser.comparepasswords(issetuser.password , password))) {

            // const token =  creetoken(issetuser._id)
            
            // return res.status(200).json({
            //     token ,
            //     status : 'we have found the user'
            // })   
            createSendToken(issetuser,200,res)
     

        }else {
            
            return res.status(400).json({
                status : 'Email or password are incorrect'
            })           
        }
        
    }  )

exports.accesautorisation= catchAsync(async (req,res,next) => {
    let token ; 
    console.log(req.headers.authorization);
    // 1) check if there is a token in req.headers
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
        // console.log(token);
        
    }
    if(!token) {
        return next(new AppErreur("U must login befoure get access to this path" , 401))
    }
    // 2) check if this token is valid 
    const decode = await promisify(jwt.verify)(token , process.env.TOKEN_SECRET)

    // console.log(decode);


    // 3) if user still existe : 
    const correntuser = await User.findById(decode.id)
    if(!correntuser) return next( new AppError('User with this token  dint existe please try to login again' , 401))
    // console.log(correntuser);
   // if(correntuser.isPasshasChanged(decode.iat)) return next(new AppErreur('User has change the password please re-login' , 401))

    req.user = correntuser;
    console.log(req.user);
    next()
})


exports.restrictTo = (...roles) => {
    return (req,res,next) => {

     if(!roles.includes(req.user.role)) return  next(new AppError("You are not allowed for this action " , 403))
     next()
    }


}


exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError('There is no user with email address.', 404));
    }
  
    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    console.log(resetToken);
    await user.save({ validateBeforeSave: false });
  
    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    console.log(resetURL);
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message
      });
  
      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
  
      return next(
        new AppError('There was an error sending the email. Try again later!'),
        500
      );
    }
  });
  exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
  
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
  
    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
  
    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
  });
  
  exports.updatePassword = catchAsync(async (req, res, next) => {
    // console.log(req.user);
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');
    // console.log(user.password);
    // 2) Check if POSTed current password is correct
    if (!(await user.comparepasswords(user.password , req.body.passwordCurrent))) {
      return next(new AppError('Your current password is wrong.', 401));
    }
  
    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    console.log(user);
    await user.save();
    // User.findByIdAndUpdate will NOT work as intended!
  
    // 4) Log user in, send JWT
    createSendToken(user, 200, res);
  });
