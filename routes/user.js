const express = require('express');
const {validate, validateLogin} = require('./validate');
const user_router = express.Router();
const connection = require('../database/connection');

user_router.get('/', (req, res) => {
    const query = "SELECT * FROM users";
    connection.query(query, (err, result) => {
        if (err) {
            return res.status(500).send("Can't get data");
        } else {
            return res.status(200).json(result);
        }
    });
})
user_router.get('/:id', (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM users WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).send("Can't get data");
        } else {
            return res.status(200).json(result);
        }
    });
})

user_router.put('/:id', validate, (req, res) => {
    const id = req.params.id;
    //destructuring
    const {fullname, gender, age} = req.body;
    const query = 'UPDATE users SET fullname = ?, gender = ?, age = ? WHERE id = ?';
    connection.query(query, [fullname, gender, age, id], (err, result) => {
        if (err) {
            return res.status(500).send("Can't update data");
        }
        else {
            return res.status(204).send("Update successful");
        }
    })
})

user_router.post('/', validate, (req, res) => {
    const {fullname, gender, age} = req.body;
    const query = 'INSERT INTO users (fullname, gender, age) VALUES(?, ?, ?)';
    connection.query(query, [fullname, gender, age], (err, result) => {
        if (err) {
            return res.status(500).send("Can't post data");
        }
        else {
            return res.status(201).send("Inserted successfully");
        }
    })
})

user_router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM users WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).send("Can't delete data");
        }
        else {
            res.status(204).send("Delete successful");
        }
    });
})
module.exports = user_router;
