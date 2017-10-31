//required modules
const mysql = require('mysql');
const Table = require('cli-table');
const inquirer = require('inquirer');

const con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  //no password associated with mysql
  password: "",
  database: "bamazon_db"
});

//globals in a call out to scoping
const orderCart = [];
const orderGrandTotal = 0;

//checking the db connection
con.connect((err) => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connection confirmed : ' + con.threadId);
  listOutItems(() => {
    userCartContents();
  });
});

//function lists out items in console
function listOutItems(cb){
  const table = new Table({
    head: ['item_id', 'product_name', 'department_name', 'price', 'quantity_available']
    // quantity_available == stock_quantity;
  });
  //* wildcard get all rows
  con.query('SELECT * FROM products', (err, res) => {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      table.push([res[i].item_db, res[i].product_name, res[i].department_name, '$' + res[i].price.toFixed(2), res[i].stock_quantity]);
    }
    console.log(table.toString());
    //IIFE
    cb();
  });
}

function userCartContents(){
  let items = [];
  con.query('SELECT product_name FROM products', (err, res) =>{
    if (err) throw err;
    //push all product names into the item array
    for (let i = 0; i < res.length; i++) {
      items.push(res[i].product_name)
    }
    //prompt the user to select items from the items array
    inquirer.prompt([
      {
        name: 'choices',
        type: 'checkbox',
        message: 'We have added new products at Bamazon we thought you might be interested in. Once you have made your selections please hit enter to confirm.',
        choices: items
      }
    ]).then((user) => {
      if (user.choices.length === 0) {
        console.log('Psst... you haven\'t selected any items');

        inquirer.prompt([
          {
            name: 'choice',
            type: 'list',
            message: 'Your empty cart, coupled with the fact this app doesn\'t offer free wi-fi or unlimited refills...can\'t help if you were still looking or would like to exit Bamazon?',
            choices: ['Still Looking', 'Exit']
          }
        ]).then((user) => {

          if (user.choices === 'Still Looking') {
            listOutItems(() => {
              userCartContents();
            });
          } else {
            console.log('We\'ll be here working on adding new amazing products and specials while you\'re away. Please be sure to come back and thanks.');
            con.end();
          }
        });
      } else {
        totalItems(user.choices)
      }
    });
  });
}

function totalItems(cartItemsByName) {
  //updating database
  let item = cartItemsByName.shift();
  let itemInventory;
  let itemsListedPrice;
  let itemsDepartment;
  con.query('SELECT stock_quantity, price, department_name FROM products WHERE ?', {
    product_name: item
},
    //function expression
    function(err, res){
      if(err) throw err;
      //set stock, price, and department in a variable
      itemInventory = res[0].stock_quantity;
      itemsListedPrice= res[0].price;
      itemsDepartment = res[0].department_name;
    });
  inquirer.prompt([
    {
      name: 'amount',
      type: 'text',
      message: 'Please indicate ' + item + ' would you like to purchase?',
      ///* Legacy way: with this.async */
      validate: function(str){
        //convert string to number and evaluate against itemInventory in db
        if (parseInt(str) <= itemInventory) {
          //take order
          return true
        } else {
          //insufficient inventory to fulfill order qty notify user/shopper
          console.log('We did not anticipate the demand for this item and only have ' + itemInventory + ' in stock. ');
        }

      }
    }
  ]).then(function(user){
    let amount = user.amount;
    //create an object for the item and push it to the shoppingCart
    orderCart.push({
      item: item,
      amount: amount,
      itemsListedPrice: itemsListedPrice,
      itemInventory: itemInventory,
      itemsDepartment: itemsDepartment,
      orderAmount: itemsListedPrice * amount
    });
    //condition set to run until array is empty
    if (cartItemsByName.length != 0) {
      totalItems(cartItemsByName);
    } else {
      checkout();
    }
  });
}
function checkout () {
  console.log('test');
}

