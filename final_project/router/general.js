const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.send(JSON.stringify(books, null, 4));  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.send(books[isbn])  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const bookKeys = Object.keys(books);
  const sauthor = req.params.author;
  
  bookKeys.forEach(book =>{       
    if(books[book].author == sauthor){
        res.send(books[book]);
    }
  }) 
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const bookKeys = Object.keys(books);
    const sTitle = req.params.title;
    
    bookKeys.forEach(book =>{       
      if(books[book].title == sTitle){
          res.send(books[book]);
      }
    }) 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
       
    if(books[isbn]){
        res.send(books[isbn].reviews);
    }
 
});

module.exports.general = public_users;
