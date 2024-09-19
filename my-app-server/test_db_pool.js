var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'my-product'
});

var name = 'TEST';
var email = "TEST@gamil.com";

pool.query(
    'SELECT * FROM users WHERE first_name LIKE ? AND email = ?', ['%'+name+'%',email],
    function (error,results,fields){
    if(error) throw error;

    console.log(results);
});

pool.query(
    'SELECT * FROM products WHERE place_Name = ?', ['Sword'],
    function (error,results,fields){
    if(error) throw error;

    console.log(results);
});