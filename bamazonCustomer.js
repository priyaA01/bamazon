//npm packages
var mysql = require("mysql");
var inquirer = require("inquirer");
const table = require('console.table');

//connection information for the sql database
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "welcome1",
	database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
	if (err) throw err;
	// function call after the connection is made to display all products
	queryAllProducts();
});

//function to display all of the items available for sale
function queryAllProducts() {
	// query the database for all items from products
	connection.query("SELECT item_id,product_name,price FROM products", function (err, results) {
		if (err) throw err;
		console.log("\n");
		//data displayed in table format in the console
		console.table(results);
		//function call to let user place order
		cust_view();
	});


}

//function to prompt user for more order else end connection
function start() {
	//user prompt to continue or end
	console.log("\n");
	inquirer
		.prompt([{
			type: "confirm",
			message: "Are you done Shopping?",
			name: "confirm",
			default: true
		}]).then(function (res) {
			//end connection or start over
			if (res.confirm) {
				connection.end();
			} else {
				queryAllProducts();
			}

		});
}

// function which prompts the user asking for what product they want to buy
function cust_view() {
	connection.query("SELECT * FROM products", function (err, results) {
		//prompt to let user place order- asks for product id and quantity
		inquirer
			.prompt([{
					type: "input",
					message: "Enter the Product ID you would like to buy:  ",
					name: "productid",
					validate: function (value) {
						if (isNaN(value) === false) {
							return value !== "" ;
						}
						return "Please Provide Product ID in Numbers";
					}
				},
				{
					type: "input",
					message: "Enter the Quantity you would like to buy:  ",
					name: "productquantity",
					validate: function (value) {
						if (isNaN(value) === false ) {
							return value !=="";
						}
						return "Please Provide Quantity in Numbers";
					}
				},
				{
					type: "confirm",
					message: "Are you sure:",
					name: "confirm",
					default: true
				}
			])
			.then(function (answer) {
				if (answer.confirm) {
					// gets the information of the chosen item
					var chosenItem;
					for (var i = 0; i < results.length; i++) {
						if (results[i].item_id === parseInt(answer.productid)) {
							chosenItem = results[i];
						}
					}
					//if the chosenItems quantity is more than the user asked quantity
					if (chosenItem.stock_quantity - parseInt(answer.productquantity) > 0) {
						// update products table - chosenitem's quantity and its product sales 
						connection.query(
							"UPDATE products SET ? WHERE ?", [{
									stock_quantity: chosenItem.stock_quantity - parseInt(answer.productquantity),
									product_sales: chosenItem.product_sales + (chosenItem.price * parseInt(answer.productquantity))
								},
								{
									item_id: chosenItem.item_id
								}
							],
							function (error) {
								if (error) throw err;
								console.log("\nYour Order Placed Successfully!!!");
								//it calculates total cost for the user and displays
								var totalCost = parseInt(answer.productquantity) * chosenItem.price;
								console.log("\nTotal Cost of your Purchase : " + totalCost + "$");
								//start over function
								start();
							}
						);

					}
					//if the chosenItems quantity is less than the user asked quantity 
					else {
						console.log("\nInsufficient quantity!");
						//start over function
						start();
					}
				}  else {
					//start over
					start();
				}
			});
	});
}