const connection = require('./connection');
connection.query("SELECT * FROM users", (err, result) => {
    console.log(result);
    console.log(err);
})
// connection.query("create table user(id INT AUTO_INCREMENT PRIMARY KEY, fullname nvarchar(255) NOT NULL,gender tinyint(1), age INT CHECK (age > 0));", (err, result) => {
//     console.log(err);
// })
// const user = [
//     {
//         "name" : "Truong Tuan Kiet",
//         "gender": 0,
//         "age": 10
//     },
//     {
//         "name" : "Phuong Thao",
//         "gender": 1,
//         "age": 20
//     },
// ]
// user.forEach(user => {
//     connection.query(`insert into user(fullname, gender, age) values (?,?,?)`, [user.name, user.gender, user.age], (err, result) => {
//         console.log(err);
//         console.log(result);
//     });
// })


//lấy all dữ liệu 
// connection.query('select student.fullname, course.nameCourse FROM student LEFT JOIN student_course ON student.id = student_course.id_student LEFT JOIN course ON student_course.id_course = course.id WHERE ', (err, result) => {
//     console.log(result);
//     console.log(err);
// })

//lấy tất cả tên học sinh đăng ký khoá JAVA biết khoá JAVA có id = 1
// connection.query('select * from student INNER JOIN (SELECT * FROM student_course where id_course = 1) as newtable ON student.id = newtable.id_student', (err, result) => {
//     console.log(result);
//     console.log(err);
// })

//lấy tất cả khoá học của Tuấn Kiệt biết id của Tuấn Kiệt là 1
// connection.query('select course.nameCourse from course INNER JOIN (SELECT * FROM student_course where student_course.id_student = 1) as newtable ON course.id = newtable.id_course', (err, result) => {
//     console.log(result);
//     console.log(err);
// })

// connection.query('select student.fullname from student INNER JOIN(Select * from student_course where id_course = 1 ORDER BY register_date ASC LIMIT 3) AS newtable ON student.id = newtable.id_student', (err, result) => {
//     console.log(result);
//     console.log(err);
// })

// connection.query('select course.nameCourse, COUNT(student_course.id_student) as student_count from student_course INNER JOIN course ON student_course.id_course = course.id GROUP BY course.id', (err, result) => {
//     console.log(result);
//     console.log(err);
// })


//process.env
//
// console.log(process.env.DB_USER);