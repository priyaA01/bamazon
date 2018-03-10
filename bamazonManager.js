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
	console.log("\n    WELCOME TO BAMAZON!! MANAGER PORTAL");
	console.log("\n   ***************************************");
	//function to display prompts for manager to choose from menu options
	start();
});

//prompt with menu options for manager to choose from
function start() {
	inquirer
		.prompt([{
				type: "list",
				message: "\nWhich would you like to do?",
				choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
				name: "menuchoice"
			},
			{
				type: "confirm",
				message: "\nDO YOU WANT TO CONTINUE?",
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
				else if (response.menuchoice === "Exit")
				{
					console.log("\n-------------------------------------------------------------");
					console.log("   THANK YOU FOR YOUR SERVICE AT BAMAZON!! Credits : PRIYA\n");
					//to end manager view 
					connection.end();
				}
			} else {
				start();
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
		console.table(" AVAILABLE PRODUCT LIST", res);
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
		console.table(" LOW INVENTORY LIST", res);
		//function call to display menu options 
		start();
	});

}

//function to add product quantity
function addQuantity() {
	//query the database for all items 
	connection.query("SELECT * FROM products", function (err, results) {
		if (err) throw err;

		//prompt with available products and specify new quantity
		inquirer
			.prompt([{
					type: "list",
					message: "\nChoose the Product you would like to add stock:  ",
					choices: function () {
						var choiceArray = [];
						for (var i = 0; i < results.length; i++) {
							//choose from available products
							choiceArray.push(results[i].product_name);
						}
						return choiceArray;
					},
					name: "productname"
				},
				{
					type: "input",
					message: "\nEnter the Quantity you would like to add:  ",
					name: "productquantity",
					validate: function (value) {
						//quantity has to be positive numbers
						if (isNaN(value) === false && value > 0) {
							return value !== "";
						}
						return "Please Provide Valid Quantity";
					}
				},
				{
					type: "confirm",
					message: "\nAre you sure:",
					name: "confirm",
					default: true
				}
			]).then(function (answer) {
				if (answer.confirm) {
					// gets the information of the chosen item
					var chosenItem;
					for (var i = 0; i < results.length; i++) {
						if (results[i].product_name === answer.productname) {
							chosenItem = results[i];
						}
					}
					//query to update chosen product quantity added to new stocks
					connection.query(
						"UPDATE products SET ? WHERE ?", [{
								stock_quantity: chosenItem.stock_quantity + parseInt(answer.productquantity)
							},
							{
								item_id: chosenItem.item_id
							}
						],
						function (error) {
							if (error) throw err;
							console.log("\n****************************************");
							console.log("  PRODUCT QUANTITY ADDED SUCCESSFULLY!");
							console.log("****************************************\n");
							//start over again
							start();
						});
				} else {
					//allow add quantity again
					addQuantity();
				}

			});
	});
}

//function to add new product
function addProduct() {
	//query to get available departments - can only add products in existing department
	connection.query("SELECT * FROM departments", function (err, results) {
		if (err) throw err;
		//prompt to get new prodcut details
		inquirer
			.prompt([{
					type: "input",
					message: "\nEnter the Product Name of the new product:  ",
					name: "productname",
					validate: function (value) {
						//name cannot be numbers or empty
						if (isNaN(value)) {
							return value !== "";
						}
						return "Please Provide Valid Name";
					}
				},
				{
					type: "list",
					choices: function () {
						var choiceArray = [];
						for (var i = 0; i < results.length; i++) {
							//choose from available departments
							choiceArray.push(results[i].department_name);
						}
						return choiceArray;
					},
					message: "\nChoose the Department for the new product:  ",
					name: "department"
				},
				{
					type: "input",
					message: "\nEnter Quantity for the new product:  ",
					name: "productquantity",
					validate: function (value) {
						//quantity has to be numbers 
						if (isNaN(value) === false && value > 0) {
							return value !== "";
						}
						return "Please Provide Quantity in Numbers";
					}
				},
				{
					type: "input",
					message: "\nEnter the Base Price for the new product:  ",
					name: "productprice",
					validate: function (value) {
						//price has to be in numbers
						if (isNaN(value) === false && value > 0) {
							return value !== "";
						}
						return "Please Provide Price in Numbers";
					}
				},
				{
					type: "confirm",
					message: "\nDO YOU WANT TO ADD THIS NEW PRODUCT?",
					name: "confirm",
					default: true
				}
			]).then(function (ans) {
				//once details of the new product is confirmed
				if (ans.confirm) {
				//check if the product already exists in products
				connection.query("SELECT * FROM products", function (err, res) {
				if (err) throw err;
					var chosenItem = "";
					for (var i = 0; i < res.length; i++) {
						if (res[i].product_name === (ans.productname).toLowerCase()
						 && res[i].department_name === ans.department)
						{
							chosenItem = res[i];
						}
					}
					//if product already exists
					if (chosenItem !="") {
						console.log("\n*******************************************************");
						console.log("     PRODUCT ALREADY EXISTS IN THAT DEPARTMENT! TRY AGAIN");
						console.log("**********************************************************\n");
						//allow to add again 
						addProduct();
					} 
					else{
						//query to add to table new product
						connection.query("INSERT INTO products SET ?", {
							product_name: ans.productname,
							department_name: ans.department,
							price: ans.productprice,
							stock_quantity: ans.productquantity
						},
						function (err, res) {
							if (err) throw err;
							console.log("\n****************************************");
							console.log("     PRODUCT ADDED SUCCESSFULLY!");
							console.log("****************************************\n");

							//start over
							start();
						});
					}
				});
					
				} else {
					//if not sure allow to add again 
					addProduct();
				}
			});
	});
}