const connection = require('./connection');
connection.query("create table user(id INT AUTO_INCREMENT PRIMARY KEY, fullname nvarchar(255) NOT NULL,gender tinyint(1), age INT CHECK (age > 0));", (err, result) => {
    console.log(err);
})
const user = [
    {
        "name" : "Truong Tuan Kiet",
        "gender": 0,
        "age": 10
    },
    {
        "name" : "Phuong Thao",
        "gender": 1,
        "age": 20
    },
]
user.forEach(user => {
    connection.query(`insert into user(fullname, gender, age) values (?,?,?)`, [user.name, user.gender, user.age], (err, result) => {
        console.log(err);
        console.log(result);
    });
})
