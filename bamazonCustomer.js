//node modules
const mysql = require('mysql');
const displayTable = require('cli-table');
const inquirer = require('inquirer');

const con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon_db"
});

//globals in a call out to scoping
const yourCart = [];
const totalCost = 0;

con.connect(function(err) {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connection confirmed : ' + con.threadId);
  listOutItems(function(){
    userCartContents();
  });
});

//function lists out items in console
function listOutItems(cb){
  const table = new Table({
    head: ['item_id', 'product_name', 'department_name', 'price', 'quantity_available']
    // quantity_available = stock_quantity;
  });
  //* wildcard get all rows
  con.query('SELECT * FROM products', function(err, res){
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      table.push([res[i].item_db, res[i].product_name, res[i].department_name, '$' + res[i].price.toFixed(2), res[i].stock_quantity]);
    }
    console.log(table.toString());
    cb();
  });
}

function userCartContents(){
  let items = [];
  con.query('SELECT product_name FROM products', function(err, res){
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
    ]).then(function(user) {
      if (user.choices.length === 0) {
        console.log('Looks like you forgot to something! Psst... You\'ve not selected any items');

inquirer.prompt([
  {

  }
])


