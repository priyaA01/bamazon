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
	console.log("\n   ***************************************");
	console.log("\n    WELCOME TO BAMAZON!! ENJOY SHOPPING");
	console.log("\n   ***************************************");
	// function call after the connection is made to display all products
	queryAllProducts();
});

//function to display all of the items available for sale
function queryAllProducts() {
	// query the database for all items from products
	connection.query("SELECT item_id,product_name,price FROM products", function (err, results) {
		if (err) throw err;
		console.log("\n  ");
		//data displayed in table format in the console
		console.table(" AVAILABLE PRODUCT LIST", results);
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
			message: "ARE YOU DONE SHOPPING?",
			name: "confirm",
			default: true
		}]).then(function (res) {
			//end connection or start over
			if (res.confirm) {
				console.log("\n-------------------------------------------------------------");
				console.log("   THANK YOU FOR SHOPPING AT BAMAZON!! Credits : PRIYA\n");
				connection.end();
			} else {
				queryAllProducts();
			}

		});
}

// function which prompts the user asking for what product they want to buy
function cust_view() {
	//query to get available products
	connection.query("SELECT * FROM products", function (err, results) {
		if (err) throw err;
		//prompt to let user place order- asks for product id and quantity
		inquirer
			.prompt([{
					type: "input",
					message: "\nEnter the Product ID you would like to buy:  ",
					name: "productid",
					validate: function (value) {
						if (isNaN(value) === false && value > 0) {
							return value !== "";
						}
						return "PLEASE PROVIDE PRODUCT ID IN NUMBERS";
					}
				},
				{
					type: "input",
					message: "\nEnter the Quantity you would like to buy:  ",
					name: "productquantity",
					validate: function (value) {
						if (isNaN(value) === false && value > 0) {
							return value !== "";
						}
						return "PLEASE PROVIDE QUANTITY IN NUMBERS";
					}
				},
				{
					type: "confirm",
					message: "\nARE YOU SURE? ",
					name: "confirm",
					default: true
				}
			])
			.then(function (answer) {
				if (answer.confirm) {
					// gets the information of the chosen item
					var chosenItem = "";
					for (var i = 0; i < results.length; i++) {
						if (results[i].item_id === parseInt(answer.productid)) {
							chosenItem = results[i];
						}
					}
					//if product not exists
					if (chosenItem === "") {
						console.log("\n****************************************");
						console.log("     PRODUCT NOT AVAILABLE! TRY AGAIN");
						console.log("****************************************\n");
						//allow to shop again 
						cust_view();
					} else {
						//if the chosenItems quantity is more than the user asked quantity
						if (chosenItem.stock_quantity - parseInt(answer.productquantity) < 0) {
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
									console.log("\n  YOUR ORDER PLACED SUCCESSFULLY!!!");
									//it calculates total cost for the user and displays
									var totalCost = parseInt(answer.productquantity) * chosenItem.price;
									console.log("***************************************************");
									console.log("\n  TOTAL COST OF YOUR PURCHASE : " + totalCost + "$");
									console.log("***************************************************");

									//start over function
									start();
								});
						}
						//if the chosenItems quantity is less than the user asked quantity 
						else {
							console.log("\n***************************************************");
							console.log("    INSUFFICIENT QUANTITY!!!");
							console.log("***************************************************");

							//start over function
							start();
						}
					}

				} else {
					//if not sure try again
					cust_view();
				}
			});
	});
}