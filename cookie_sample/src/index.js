require('dotenv').config({path:__dirname + '/config/.env'})
const express = require('express')
const cookieParser = require('cookie-parser')
require('./db/mongoose')
const userRouter= require('./router/user')


const app = express()
const port = process.env.PORT || 3000


app.use(express.json())
app.use(cookieParser())
app.use(userRouter)


app.listen(port, ()=>{
    console.log('server is up on the port'+port)
})