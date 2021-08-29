const express = require('express');
require('./db/mongoose')

const userRouter = require('./routers/user')
const checkRouter = require('./routers/check')


const app = express()


app.use(express.json())
app.use(userRouter)
app.use(checkRouter)


module.exports = app