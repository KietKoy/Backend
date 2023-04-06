const express = require('express')
const app = express()
const port = 3000
const userRoute = require('./routes/user')
app.use(express.json())
app.use(express.urlencoded())
app.use('/user', userRoute)
// app.use((req, res, next) => {
//   console.log('Hello');
//   next()
// })

// function validate(req, res, next) {
//   console.log("Im here");
// }
// app.get('/', (req, res, next) => {
//   console.log("123");
//   next()
// })

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.post("/user", (req, res) => {
//   console.log(req.query);
//   console.log(req.params);
//   console.log(req.body);
//   res.status(200).send("OK")
// })

// app.get('/user', (req, res) => {
//   console.log(req.query);
//   console.log(req.params);
//   console.log(req.body);
//   res.send("OK")
// })

// app.get('/user/:id', (req, res) => {
//   console.log(req.query);
//   console.log(req.params);
//   console.log(req.body);
//   res.send("OK")
// })
app.get('/', (req, res) => {
  res.send("Server is running....")
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})