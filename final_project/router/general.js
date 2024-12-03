const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let myPromise = new Promise(function(myResolve, myReject) {
    // "Producing Code" (May take some time)
    
      op = JSON.stringify(books,null,4);
      if (op.length > 0){
        myResolve(op); // when successful
      }
      else {
        myReject("Error Key value reprository corrupt.");  // when error
      }

    });
    
    // "Consuming Code" (Must wait for a fulfilled Promise)
    myPromise.then(
      function(value) { res.status(200).send(value);/* code if successful */ },
      function(error) { res.status(500).send(error);/* code if some error */ }
    );

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    let myPromise = new Promise(function(myResolve, myReject) {
        // "Producing Code" (May take some time)
        
          const isbn = req.params.isbn;
          op=books[isbn];
          
          if (Object.keys(op).length > 0){
            myResolve(op); // when successful
          }
          else {
            myReject(`Book with ISBN: ${isbn} Not Found!`);  // when error
          }
    
        });
        
        // "Consuming Code" (Must wait for a fulfilled Promise)
        myPromise.then(
          function(value) { res.status(200).send(value);/* code if successful */ },
          function(error) { res.status(404).send(error);/* code if some error */ }
        );
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    let myPromise = new Promise(function(myResolve, myReject) {
        // "Producing Code" (May take some time)
        const author = req.params.author;
        op = {};
        for (const [key, value] of Object.entries(books)) {
            if (value["author"] == author) {
                op[key] = value;
            }
    
        }
          
        if (Object.keys(op).length > 0){
            myResolve(op); // when successful
        }
        else {
            myReject(`Book with Author:${author} Not Found!`);  // when error
        }
    
        });
        
        // "Consuming Code" (Must wait for a fulfilled Promise)
        myPromise.then(
          function(value) { res.status(200).send(JSON.stringify(value,null,4));/* code if successful */ },
          function(error) { res.status(404).send(error);/* code if some error */ }
        );
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let myPromise = new Promise(function(myResolve, myReject) {
        // "Producing Code" (May take some time)
        const title = req.params.title;
        op = {};
        for (const [key, value] of Object.entries(books)) {
            if (value["title"] == title) {
                op[key] = value;
            }
    
        }
          
        if (Object.keys(op).length > 0){
            myResolve(op); // when successful
        }
        else {
            myReject(`Book with Title:${title} Not Found!`);  // when error
        }
    
        });
        
        // "Consuming Code" (Must wait for a fulfilled Promise)
        myPromise.then(
          function(value) { res.status(200).send(JSON.stringify(value,null,4));/* code if successful */ },
          function(error) { res.status(404).send(error);/* code if some error */ }
        );
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  
  if (typeof(books[isbn]["review"]) != "undefined"){
    op = JSON.stringify(books[isbn]["review"],null,4);
    res.send(op);
  }
  else {
    res.send(JSON.stringify("{}",null,4))
  }
});

module.exports.general = public_users;
