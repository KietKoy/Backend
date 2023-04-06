const express = require('express');
const validate = require('./validate');
const user_router = express.Router();
let users = [
    {
        "id": 0,
        "name": "Truong Tuan Kiet",
        "gender": true,
        "age": 20
    },
    {
        "id": 1,
        "name": "Van Thi Phuong Thao",
        "gender": false,
        "age": 20
    }
]

user_router.get('/', (req, res) => {
    res.status(200).json(users);
})

user_router.get('/:id', (req, res) => {
    const id = req.params.id;
    let result = users.filter(user => user.id == id)
    res.status(200).json(result);
})

user_router.put('/:id', validate,  (req, res) => {
    const id = req.params.id;
    const user = users.find(user => user.id === parseInt(id))
    if (!user) {
        res.status(404).send("Not Found");
    }
    user.name = req.body.name;
    user.age = req.body.age;
    user.gender = req.body.gender;
    res.status(204).send("Update successful")
})

user_router.post('/', validate, (req, res) => {

    const user = {
        "id": users.length,
        ...req.body
    }
    users.push(user)
    res.status(201).json(user)
})

user_router.delete('/:id', (req, res) => {
    const index = users.findIndex(user => user.id === parseInt(id));
    if (index === -1) {
        res.status(404).send("User not found");
        return;
    }
    users.splice(index, 1);
    res.status(204).send("Delete successful");
})
module.exports = user_router;
