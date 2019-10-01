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
    }

  function openStore(){
      connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err;

        inquirer
        .prompt([
          {
            name: "choice",
            type: "rawlist",
            choices: function() {
              var choiceArray = [];
              for (var i = 0; i < res.length; i++){
                choiceArray.push(res[i].product_name);
              }
              return choiceArray;
            },
            message: " What would you like to buy?"
          },
          {
            name: "item",
            type: "input",
            message: "how many would you like to buy?"
          }
        ])
        .then(function(answer){
          var pickedItem
          for (var i =0; i < res.length; i++){
            if(results[i].product_name === answer.choice){
              pickedItem = res[i];
            }
          }

          if(pickedItem.item > parseInt(answer.stock_quantity)){
            connection.query(
              "UPDATE products SET ? WHERE?",
              [
                {
                  stock_quantity: answer.item
                }
              ],
              function(err){
                if(err) throw err;
                console.log("your purchase was successful!");
                console.table(res)
                start();
              }
            )
          }
          else{
            console.log("not enough in stock try again")
            start()
          }
        })
      })

  }
  