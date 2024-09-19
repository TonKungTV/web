const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const hostname = '127.0.0.1';
const cors = require("cors");
const util = require('util')
// const multer = require("multer");
const jwt = require("jsonwebtoken");
var mysql = require('mysql');
const { error } = require('console');

// pool.query = util.promisify(pool.query);

// const [productTypes, setProductTypes] = useState([]);
// const [productTypeId, setProductTypeId] = useState(0);
// const [products, setProducts] = useState([]);

const Product = require("./libs/Product");
const app = express();
const port = 3000;
app.use('/images', express.static('images'));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "my-product"
});

app.get('/', (req, res) => {
    res.send('Hello World by Express!')
});

app.get('/users', (req, res) => {
    pool.query("SELECT * FROM users", function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});



app.post('/add_user', (req, res) => {
    const input = req.body;
    pool.query("INSERT INTO users (user_name, user_pwd, first_name, last_name, email) VALUES (?, ?, ?, ?, ?)",
        [
            input.user_name,
            input.user_pwd,
            input.first_name,
            input.last_name,
            input.email
        ], function (error, results, fields) {
            if (error) throw error;
            res.json(results);
        });
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    pool.query("SELECT * FROM users WHERE user_name = ? AND user_pwd = MD5(?)", [username, password], function (error, results, fields) {
        if (error) {
            res.json({
                result: false,
                message: error.message
            });
        }
        if (results.length) {
            res.json({
                result: true
            });
        } else {
            res.json({
                result: false,
                message: "ไม่พบ Username หรือ Password ไม่ถูกต้อง"
            });
        }
    });
});

app.post("/api/authen_request", (req, res) => {
    const sql = "SELECT * FROM users WHERE MD5(user_name) = ?";
    pool.query(sql, [req.body.username], (error, results) => {
        var response;
        if (error) {
            response = {
                result: false,
                message: error.message
            };
        } else {
            if (results.length) {
                var payload = { username: req.body.username };
                var secretKey = "MySecretKey";
                const authToken = jwt.sign(payload, secretKey);
                console.log("authToken", authToken);
                response = {
                    result: true,
                    data: {
                        auth_token: authToken
                    }
                };
            } else {
                response = {
                    result: false,
                    message: "Username ไม่ถูกต้อง"
                };
            }
        }
        res.json(response);
    });
});

app.post("/api/access_request", (req, res) => {
    const authenSignature = req.body.auth_signature;
    const authToken = req.body.auth_token;

    var decoded;
    try {
        decoded = jwt.verify(authToken, "MySecretKey");
    } catch (err) {
        console.error(err);
        return res.json({ result: false, message: "Token ไม่ถูกต้อง" });
    }

    if (decoded) {
        const query = "SELECT a.user_id, a.user_name, a.first_name, a.last_name, a.email, a.role_id, b.role_name " +
            "FROM users a JOIN roles b ON a.role_id = b.role_id WHERE MD5(CONCAT(user_name, '&', user_pwd)) = ?";
        pool.query(query, [authenSignature], (error, results) => {
            var response;
            if (error) {
                response = {
                    result: false,
                    message: error.message
                };
            } else {
                if (results.length) {
                    var payload = {
                        user_id: results[0].user_id, user_name: results[0].user_name, first_name: results[0].first_name,
                        last_name: results[0].last_name, email: results[0].email,
                        role_id: results[0].role_id, role_name: results[0].role_name
                    };
                    const accessToken = jwt.sign(payload, "MySecretKey");
                    response = { result: true, data: { access_token: accessToken, account_info: payload } };
                } else {
                    response = { result: false, message: "Username หรือ Password ไม่ถูกต้อง" };
                }
            }
            res.json(response);
        });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

let checkAuth = (req, res, next) => {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        token = req.query.token;
    } else {
        token = req.body.token;
    }

    if (token) {
        jwt.verify(token, "MySecretKey", (error, decoded) => {
            if (error) {
                res.send(JSON.stringify({
                    result: false,
                    message: "ไม่ได้เข้าสู่ระบบ"
                }));
            } else {
                req.decoded = jwt.decoded;
                next();
            }
        });
    }
}

app.get('/products',(req, res) => {
    pool.query("SELECT * FROM products", function(error, results, fields){
        if (error) throw error;

        res.json(results);
    });
});

app.get("/api/product_types", checkAuth, (req, res) => {
    const query = "SELECT * FROM product_types";

    pool.query(query, (error, results) => {
        if (error) {
            res.json({
                result: false,
                message: error.message
            })
        } else {
            res.json({
                result: true,
                data: results
            });
        }
    });
});
app.get("/api/products/type/:productTypeId", checkAuth, (req, res) => {
    const productTypeId = req.params.productTypeId;
    const sql = "SELECT a.*, b.product_type_name "
        + "FROM products a "
        + "JOIN product_types b ON a.product_type_id = b.product_type_id";
    if (productTypeId == 0) {
        pool.query(sql, (error, results) => {
            if (error) {
                res.json({
                    result: false,
                    message: error.message
                });
            } else {
                res.json({
                    result: true,
                    data: results
                });
            }
        });
    } else {
        pool.query(sql + " WHERE a.product_type_id = ?", [productTypeId], (error, results) => {
            if (error) {
                res.json({
                    result: false,
                    mesage: error.message
                });
            } else {
                res.json({
                    result: true,
                    data: results
                });
            }
        });
    }
});

app.post("/api/product/add", checkAuth, async (req, res) => {
    const input = req.body;

    try {
        var result = await Product.createProduct(pool,
            input.product_name, input.product_type_id,
            input.price, input.stock);

        res.json({
            result: true
        });
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.post("/api/homepage", checkAuth, async (req, res) => {
    const input = req.body;

    try {
        var result = await Product.createProduct(pool,
            input.product_name, input.product_type_id, input.price, input.stock);

        res.json({
            result: true
        });
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.get('/money', (req, res) => {
    pool.query("SELECT * FROM money", function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});

app.get("/api/money", checkAuth, (req, res) => {
    const sql = "SELECT money FROM money";
    pool.query(sql, (error, results) => {
        if (error) {
            res.json({
                result: false,
                message: error.message
            });
        } else {
            res.json({
                result: true,
                data: results[0].money
            });
        }
    });
});

app.post("/api/money", checkAuth, (req, res) => {
    const newMoneyValue = req.body.money;
    const sql = "UPDATE money SET money = ?";
    pool.query(sql, [newMoneyValue], (error, results) => {
        if (error) {
            res.json({
                result: false,
                message: error.message
            });
        } else {
            res.json({
                result: true,
                message: "อัปเดตค่าเงินสำเร็จ"
            });
        }
    });
});

app.post("/api/addmoney", checkAuth, (req, res) => {
    const amount = req.body.amount;


    pool.query("UPDATE money SET money = money + ?", [amount,], (error, results) => {
        if (error) {
            res.status(500).json({ result: false, message: "Failed to add money" });
        } else {
            res.json({ result: true, message: "Money added successfully" });
        }
    });
});

app.post("/api/buy-product", checkAuth, (req, res) => {
    const productId = req.body.productId;
    const price = req.body.price;
    pool.query("UPDATE money SET money = money - ? WHERE money >= ?", [price, price], (error, results) => {
        if (error) {
            res.status(500).json({ result: false, message: "Failed to buy product" });
        } else if (results.affectedRows === 0) {
            res.status(400).json({ result: false, message: "Insufficient funds" });
        } else {
            pool.query("UPDATE products SET stock = stock - 1 WHERE product_id = ?", [productId], (error, results) => {
                if (error || results.affectedRows === 0) {
                    pool.query("UPDATE money SET money = money + ? WHERE money >= ?", [price, price], (error, results) => {
                        if (error) {
                            res.status(500).json({ result: false, message: "Failed to rollback money" });
                        } else {
                            res.status(500).json({ result: false, message: "Failed to buy product" });
                        }
                    });
                } else {
                    res.json({ result: true, message: "Product bought successfully" });
                }
            });
        }
    });
});




