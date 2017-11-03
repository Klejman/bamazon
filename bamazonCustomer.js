//required modules
const mysql = require('mysql');
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


//checking the db connection
con.connect(function (error) {
  if (error) {
    console.error('Error connecting: ' + error.stack);
    return;
  }
  console.log('Connection confirmed : ' + con.threadId);
  listOutItems()
});

//function lists out items in console
function listOutItems() {
  //* wildcard get all rows
  con.query('SELECT * FROM products', function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      console.log([res[i].item_db, res[i].product_name, res[i].department_name, '$' + res[i].price.toFixed(2)])
    }
    console.log("Welcome to Bash Amazon better known as Bamazon");
    // console.log(table.toString());
    userCartContents();
  });
}

function userCartContents() {
  let items = [];
  con.query('SELECT product_name FROM products', function (err, res) {
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
    ]).then(function (user) {
      if (user.choices.length === 0) {
        console.log('Psst... you haven\'t selected any items');

        inquirer.prompt([
          {
            name: 'choice',
            type: 'list',
            message: 'Your empty cart, coupled with the fact this app doesn\'t offer free wi-fi or unlimited refills...can\'t help but ask are you were still looking or would like to exit Bamazon?',
            choices: ['Still Looking', 'Exit']
          }
        ]).then(function (user) {

          if (user.choices === 'Still Looking') {
            listOutItems(function () {
              userCartContents();
            });
          } else {
            console.log('We\'ll be here working on adding new amazing products and specials while you\'re away. Please be sure to come back and thanks.');
            con.end();
          }
        });
      } else {
        console.log(user.choices);
        totalItems(user.choices)
      }
    });
  });
}

function totalItems(cartItemsByName) {
  //updating database
  let item = cartItemsByName;
  console.log(`this is item: ${item}`);
  let itemInventory;
  let itemsListedPrice;
  let itemsDepartment;
  con.query('SELECT stock_quantity, price, department_name FROM products WHERE ?', {
      product_name: item,
      // item_id: item
    },
    //function expression
    function (err, res) {
      if (err) throw err;
      //set stock, price, and department in a variable
      itemInventory = res[0].stock_quantity;
      itemsListedPrice = res[0].price;
      itemsDepartment = res[0].department_name;
      // itemInventory = res.stock_quantity;
      console.log(`inventory on this item is : ${itemInventory}`);
      // itemsListedPrice = res.price;
      // itemsDepartment = res.department_name;
    });

  inquirer.prompt([
    {
      name: 'amount',
      type: 'input',
      message: 'Please indicate the number of' + item + ' you would like to purchase?',
      ///* Legacy way: with this.async. not sure how to implement in this instance*/
      // validate: function (input) {
      //   //convert string to number and evaluate against itemInventory in db
      //   if (parseInt(input) <= itemInventory) {
      //     return true;
      //     //take order
      //   } else {
      //     //insufficient inventory to fulfill order qty notify user/shopper
      //     console.log('We did not anticipate the demand for this item and only have ' + itemInventory + ' in inventory. ');
      //     return false;
      //   }
      //
      // }
    }
  ]).then(function (user) {
    let amount = user.amount;
    //create an object for the item and push it to the shoppingCart
    orderCart.push({
      item,
      amount,
      itemsListedPrice,
      itemInventory,
      itemsDepartment,
      orderAmount: itemsListedPrice * amount
    });
    //condition set to run until array is empty
    if (amount <= itemInventory) {
      checkout();
    } else {
      totalItems(cartItemsByName);
    }
  });
}

function checkout() {
  if (orderCart.length != 0) {
    let cartTotal = 0;
    console.log('Ready to checkout?');
    for (let i = 0; i < orderCart.length; i++) {
      let item = orderCart[i].item;
      let qty = orderCart[i].amount;
      let usd = orderCart[i].itemsListedPrice.toFixed(2);
      let orderAmount = orderCart[i].orderAmount.toFixed(2);
      let itemsListedPrice = usd * qty;
      cartTotal += itemsListedPrice;
      // cart summary listed out
      console.log(qty + ' ' + item + '' + '$' + orderAmount);
    }
    // receipt
    console.log('Order Total: $' + cartTotal.toFixed(2));
    inquirer.prompt([
      {
        name: 'checkout',
        type: 'list',
        message: 'Ready to checkout?',
        choices: ['checkout', 'exit']
      }
    ]).then(function (res) {
      if (res[checkout] === 'checkout') {
        updateDbInventory(cartTotal);
      } else {
        con.end();
      }
    });
  }

  function updateDbInventory(orderTotal) {
    let item = orderCart.shift();
    let itemName = item.item;
    let itemsListedPrice = item.itemsListedPrice;
    let userPurchase = item.amount;
    let department = item.itemsDepartment;
    let deptTransactSale = itemsListedPrice * userPurchase;
    //query mysql to get the current total sales for the applicable department
    con.query('SELECT dept_sales_total FROM departments WHERE ?', {
      department_name: department
    }, function (err, res) {
      let salesByDept = res[0].dept_sales_total;
      console.log(salesByDept);
      //update the department's sales_total in the department database
      con.query('UPDATE departments SET ? WHERE ?', [
        {
          dept_sales_total: this.salesByDept += deptTransactSale
        },
        {
          department_name: department
        }], function (err) {
        if (err) throw err;
      });
    });

    con.query('SELECT stock_quantity FROM products WHERE?', {
      product_name: itemName
    }, function (err, res) {
      let currentInventory = res[0].stock_quantity;
      console.log(currentInventory);
      con.query('UPDATE products SET ? WHERE ?', [
        {
          stock_quantity: this.product_name.currentInventory -= userPurchase
        },
        {
          product_name: itemName
        }], function (err) {
        if (err) throw err;
        //if there are still items in the shoppingCart run the function again
        if (orderCart.length != 0) {
          updateDbInventory(orderTotal);
        } else {
          //if no items remain in the shoppingCart alert the user of the total and exit
          orderTotal = orderTotal.toFixed(2);
          console.log('Your total order amount was $' + orderTotal);
          console.log('Thank you for your purchases and hope to see you back real soon!');
          con.end();
        }
      });
    });
  }
}




