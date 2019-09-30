var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    start();
  });

  function start() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      console.table(res)
      inquirer
      .prompt({
          name: "buySomething",
          type: "list",
          message: "Would you like to enter the store? [YES] or [NO]",
          choices: ["YES", "NO", "EXIT"]
      })
      .then(function(answer){
          if(answer.buySomething === "YES"){
              openStore()
          }else{
              connection.end()
          }
      })
    });
  }

  function openStore(){
      
  }
  