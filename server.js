const dotenv = require('dotenv')
const mongosse = require('mongoose')

dotenv.config({
    path : "./config.env"
})

const DB = process.env.DATABASE.replace('<PASSWORD>' , process.env.DATABASE_PASSWORD)

mongosse.connect(DB,{
       useNewUrlParser: true,
        useUnifiedTopology: true,
} , () => {
    console.log("Connected successfuly with db");
})


const port = process.env.PORT
const app = require('./app')


app.listen(port , () => {
    console.log("server start ");
})