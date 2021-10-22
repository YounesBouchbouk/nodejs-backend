const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const AppErreur = require('../utils/appErreur')
const crypto = require('crypto')
const userSchema = new mongoose.Schema({
    name  : {
        type : String , 
        require : [true , 'A user must have his own name ']
    },
    email  : {
        type : String , 
        require : [true , 'user must have a unique email'],
        unique : true,
        lowercase : true,
        validate : [validator.isEmail    , 'Email format is incorect ' ]
    },
    role : {
        type : String,
        enum : ['user' , 'admin' , 'guide' , 'lead-guide' ],
        default : "user"
    },
    photo  : {
        type : String , 
        require : [true , 'Please set your image']
    },
    password  : {
        type : String , 
        require : [true , 'user must have a password '],
        minlength : 8 ,
        select : false
    }, 
    
    passwordConfirm : {
        type : String , 
        required : [true , 'Please confirmae your password'],
        validate : {
            validator : function(el) {return el === this.password  }      }
    },
    isPAsswordChanged  :{ type : Date , select : true },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
},{
    toJSON : {virtual : true},
    toObject : {virtual:true}
})

userSchema.pre('save' , async function(next){
    //if password was not changed we angnore this 
    if(!this.isModified('password')) return next()
    try {
        //start crypting the password
        this.password = await bcrypt.hash(this.password , 12) 

        //delete the passwordConfirm field
        this.passwordConfirm = undefined
    } catch (error) {
        console.log(error);
    }
    next()
})

userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
  
    this.isPAsswordChanged = Date.now() - 1000;
    next();
  });

  
  userSchema.pre(/^find/, function(next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
  });

  

userSchema.methods.comparepasswords = async (currentpassword , password) =>{
    console.log(currentpassword , password);
    const check = await bcrypt.compare(password,currentpassword)
    
    console.log(check);

    return check

}

// chack if password has changed after changing the token

userSchema.methods.isPasshasChanged = function(decodeait){ 
    console.log(this);

    const changetTime = parseInt(this.isPAsswordChanged.getTime(), 10) / 1000
    console.log(changetTime , decodeait );

    if(changetTime  > decodeait  ) return true

    
    return false
    

}



userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    // console.log({ resetToken }, this.passwordResetToken);
  
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
  };
  

// userSchema.pre(/^find/ , async function(next){
//     try {
        
        
//     } catch (error) {
        
//     }
// })

const User = mongoose.model('User', userSchema)


module.exports = User