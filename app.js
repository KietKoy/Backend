const express = require('express')
const app = express()
const port = 3000
require('dotenv').config('')
const userRoute = require('./routes/user')
const authRoute = require('./routes/auth/auth')
app.use(express.json())
app.use(express.urlencoded())

app.use('/user', userRoute)
app.use('/auth', authRoute)
app.get('/', (req, res) => {
  res.send("Server is running....")
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})