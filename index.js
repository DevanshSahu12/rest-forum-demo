const { faker } = require('@faker-js/faker');
const mysql=require('mysql2');
const express=require('express');
const methodOverride=require("method-override");
const path=require("path");

const app=express();
const port=8080;

app.use(express.urlencoded({extended:true})); //use post

app.set("view engine", "ejs"); //use views folder to render .ejs
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "/public"))); //use css and js stuff

app.use(methodOverride('_method'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'webd',
    password: 'mysql7410'
});

app.get("/", (req, res)=>{
    try{
        let q=`SELECT COUNT(*) FROM user`;
        connection.query(q, (err, result)=>{
            if(err) throw err;
            let count=result[0]["COUNT(*)"]
            res.render("index.ejs", {count});
        });
    }catch(err){
        res.send("DB error");
    }
});

app.get("/users", (req,res)=>{
    try{
        let q=`SELECT * FROM user`;
        connection.query(q, (err, result)=>{
            if(err) throw(err);
            res.render("users.ejs", {result});
        })
    }catch(err){
        res.send("DB error");
    }
});

app.get("/users/:id/edit", (req, res)=>{
    let {id}=req.params;
    let q=`SELECT * FROM user WHERE id='${id}'`;
    try{
        connection.query(q, (err, result)=>{
            if(err) throw err;
            let user=result[0];
            res.render("edit.ejs", {user});
        })
    }catch(err){
        res.send("DB error");
    }
});

app.patch("/users/:id", (req, res)=>{
    let {id}=req.params;
    let {password: formPassword, username: formUsername}=req.body;
    let q=`SELECT password FROM user WHERE id='${id}'`;
    try{
        connection.query(q, (err, result)=>{
            if(err) throw err;
            let pword=result[0]["password"];
            if(pword!=formPassword){
                res.send("Wrong Password");
            }else{
                try{
                    connection.query(`UPDATE user SET username='${formUsername}' WHERE id='${id}'`, (err, result)=>{
                        if(err) throw err;
                        res.redirect("/users");
                    });
                }catch(err){
                    res.send("DB error");
                }
            }
        })
    }catch(err){
        res.send("DB error");
    }
});

// let getRandomUser = () =>{
//     return [
//       faker.string.uuid(),
//       faker.internet.userName(),
//       faker.internet.email(),
//       faker.internet.password()
//     ];
// }

// let q="INSERT INTO user (id, username, email, password) VALUES ?";
// let data=[];
// for(let i=0; i<100; i++){
//     data.push(getRandomUser());
// }

// try{
//     connection.query(q, [data], (err, result)=> {
//         if(err) throw err;
//         console.log(result);
//     })
// } catch(err){
//     console.log(err);
// }

app.listen(port, ()=>{
    console.log(`Listening to port: ${port}`);
});

// connection.end();