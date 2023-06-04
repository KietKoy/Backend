const express = require('express');
const { verifyToken, getUserIdByToken } = require('../helpers/JwtHelper');
const { validate } = require('./validate');
const usersRouter = express.Router();
const knexConnection = require('../database/knexConnection')
usersRouter.post('/create', verifyToken, validate, getUserIdByToken, (req, res, next) => {
    const createBy = req.createBy;
    const {
        username,
        password,
        email,
        age,
        name,
        gender
    } = req.body;
    knexConnection.transaction(async (trx) => {
        try {
            const existingUser = await trx('users')
                .where('username', username)
                .first();

            if (existingUser) {
                return res.status(400).json({ message: 'Username is already taken' });
            }

            const { salt, hashedPassword } = hashPassword(password);

            await trx('users')
                .insert({
                    username,
                    password: hashedPassword,
                    email,
                    age,
                    name,
                    gender,
                    salt,
                    createBy: createBy,
                    createAt: Date.now()
                });

            return res.status(201).json({ message: 'Register successful' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    })
        .then(() => {
            knex.destroy();
        })
        .catch((error) => {
            console.error(error);
            knex.destroy();
            return res.status(500).json({ message: 'Internal server error' });
        });
}
);
usersRouter.delete('/:id', verifyToken, (req, res, next) => {
    const id = req.params.id;
    knexConnection('users')
        .where({ id })
        .del()
        .then((result) => {
            if (result === 0) {
                res.status(404).send("Can't delete data");
            } else {
                res.status(204).send('Delete successful');
            }
        })
        .catch((err) => {
            res.status(500).send("Can't delete data");
        });

})
usersRouter.put('/:id', verifyToken, validate, (req, res) => {
    const id = req.params.id;
    const { fullname, gender, age } = req.body;
    knexConnection('users')
        .where({ id })
        .update({ fullname, gender, age })
        .then((result) => {
            if (result === 0) {
                res.status(404).send("Can't update data");
            } else {
                res.status(204).send('Update successful');
            }
        })
        .catch((err) => {
            res.status(500).send("Can't update data");
        });
})
usersRouter.get('/search/:id', verifyToken, function (req, res) {
    const id = req.params.id;
    knexConnection('user')
        .where(id)
        .then((result) => {
            if (result === 0) {
                res.status(404).send("User not found");
            } else {
                res.status(200).json(result);
            }
        })
        .catch((error) => {
            res.status(500).send("err");
        })
})
usersRouter.get('/pagination', verifyToken, async (req, res, next) => {
    const limit = 10;
    const page = req.query.page;
    const offset = (page - 1) * limit;
    knexConnection('users')
        .select('*')
        .orderBy('id')
        .limit(perPage)
        .offset(offset)
        .then(users => {
            res.json(users);
        })
        .catch(error => {
            res.status(500).json({ message: 'Server error' })
        });
    }
)
module.exports = usersRouter;