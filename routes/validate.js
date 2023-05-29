const Joi = require('joi');
const schema = Joi.object({
    username: Joi.string()
        .min(3)
        .alphanum(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    age: Joi.number()
        .integer()
        .min(1),
    name: Joi.string()
        .min(2),
    gender: Joi.boolean()
})
async function validate(req, res, next) {
    try {
        const value = await schema.validateAsync(req.body);
        next()
    } catch (error) {
        return res.status(404).json({"message": error.message})
    }
}
//Connection database
// function validate(req, res, next) {
//     const name = req.body.name
//     const age = req.body.age
//     if (age < 0) {
//         return res.status(404).json({ "message": "Age is err" })
//     }
//     else if (!/^[a-zA-Z ]+$/.test(name)) {
//         return res.status(404).json({ "message": "Name is err" })
//     }
//     next()
// }
module.exports = { validate };
