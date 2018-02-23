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
	//function to display prompts for manager to choose from
	start();
});

//prompt with menu options for manager to choose from
function start() {

	inquirer
		.prompt([{
				type: "list",
				message: "Which would you like to do?",
				choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
				name: "menuchoice"
			},
			{
				type: "confirm",
				message: "Do You want to continue:",
				name: "confirm",
				default: true
			}
		])
		.then(function (response) {
			//if the choice is confirmed, relavant function call is made
			if (response.confirm) {
				if (response.menuchoice === "View Products for Sale") {
					availableProducts();
				} else if (response.menuchoice === "View Low Inventory") {
					lowInventory();
				} else if (response.menuchoice === "Add to Inventory") {
					addQuantity();
				} else if (response.menuchoice === "Add New Product") {
					addProduct();
				}
			}
			else{
				connection.end();
			}

		});
}

//function to view all products
function availableProducts() {
	// query the database for all items from products
	connection.query("SELECT item_id,product_name,price,stock_quantity FROM products", function (err, res) {
		if (err) throw err;
		console.log("\n");
		//data displayed in table format in the console
		console.table(res);
		//function call to display menu options
		start();
	});

}

//function to view low inventory
function lowInventory() {
	//query the database for all items with low inventory from products
	connection.query("SELECT item_id,product_name,price,stock_quantity FROM products where stock_quantity < 5", function (err, res) {
		if (err) throw err;
		console.log("\n");
		//data displayed in table format in the console
		console.table(res);
		//function call to display menu options 
		start();
	});

}

//function to add product quantity
function addQuantity() {
	//query the database for all items 
	connection.query("SELECT * FROM products", function (err, results) {
		if (err) throw err;
		inquirer
			.prompt([
				{
					type: "rawlist",
					choices: function() {
		            var choiceArray = [];
		            for (var i = 0; i < results.length; i++) {
		              choiceArray.push(results[i].item_id);
		            }
		            return choiceArray;
		            },
					message: "Choose the Product ID you would like to add stock:  ",
					name: "productid"
				},
				{
					type: "input",
					message: "Enter the Quantity you would like to add:  ",
					name: "productquantity",
					validate: function (value) {
						if (isNaN(value) === false ) {
							return value !=="";
						}
						return "Please Provide Valid Quantity";
					}
				},
				{
					type: "confirm",
					message: "Are you sure:",
					name: "confirm",
					default: true
				}
			]).then(function (answer) {
				if (answer.confirm) {
					var chosenItem;
					for (var i = 0; i < results.length; i++) {
						if (results[i].item_id === parseInt(answer.productid)) {
							chosenItem = results[i];
						}
					}
					connection.query(
						"UPDATE products SET ? WHERE ?", [{
								stock_quantity: chosenItem.stock_quantity + parseInt(answer.productquantity)
							},
							{
								item_id: answer.productid
							}
						],
						function (error) {
							if (error) throw err;
							console.log("\n Product Quantity Added successfully!");
							start();
						});
				}
				else
				{
					addQuantity();
				}

			});
	});
}

function addProduct() {
	console.log("Adding new product...\n");

	inquirer
		.prompt([{
				type: "input",
				message: "Enter the Product Name of the new product:  ",
				name: "productname",
				validate: function (value) {
					if (isNaN(value)) {
						return value !=="";
					}
					return "Please Provide Product Name";
				}
			},
			{
				type: "input",
				message: "Enter the Quantity for the new product:  ",
				name: "productquantity",
				validate: function (value) {
					if (isNaN(value) === false ) {
						return value !=="";
					}
					return "Please Provide Quantity in Numbers";
				}
			},
			{
				type: "input",
				message: "Enter the Base Price for the new product:  ",
				name: "productprice",
				validate: function (value) {
					if (isNaN(value) === false ) {
						return value !=="";
					}
					return "Please Provide Price in Numbers";
				}
			},
			{
				type: "confirm",
				message: "Are you sure:",
				name: "confirm",
				default: true
			}
		]).then(function (ans) {
			if (ans.confirm) {
				connection.query("INSERT INTO products SET ?", {
						product_name: ans.productname,
						price: ans.productquantity,
						stock_quantity: ans.productprice
					},
					function (err, res) {
						console.log("\nProduct Added Successfully!\n");
						start();
					});
			}
			else{
				addProduct();
			}
		});

}