const express = require('express')
const app = express()
const port = 3000
const userRoute = require('./routes/user')

app.use(express.json())
app.use(express.urlencoded())

app.use('/user', userRoute)

app.get('/', (req, res) => {
  res.send("Server is running....")
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})