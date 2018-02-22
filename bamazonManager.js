var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "welcome1",
	database: "bamazon"
});

connection.connect(function (err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId);
	start();
});

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
				message: "Are you sure:",
				name: "confirm",
				default: true
			}
		])
		.then(function (response) {
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

		});
}


function availableProducts() {
	connection.query("SELECT * FROM products where stock_quantity > 0", function (err, res) {
		if (err) throw err;
		console.log("Id   |   Product    |     Price    | Quantity");
		console.log("-----------------------------------");
		for (var i = 0; i < res.length; i++) {
			console.log(res[i].item_id + "   " + res[i].product_name + "   " + res[i].price + "   " + res[i].stock_quantity);
		}
		console.log("-----------------------------------");

		start();
	});

}

function lowInventory() {
	connection.query("SELECT * FROM products where stock_quantity <= 5", function (err, res) {
		if (err) throw err;
		console.log("Id   |   Product    |     Price    | Quantity");
		console.log("-----------------------------------");
		for (var i = 0; i < res.length; i++) {
			console.log(res[i].item_id + "   " + res[i].product_name + "   " + res[i].price + "   " + res[i].stock_quantity);
		}
		console.log("-----------------------------------");

		start();
	});

}


function addQuantity() {
	connection.query("SELECT * FROM products", function (err, results) {
		if (err) throw err;
		inquirer
			.prompt([{
					type: "input",
					message: "Enter the ID of the product you would like to add stock:  ",
					name: "productid"
				},
				{
					type: "input",
					message: "Enter the Quantity you would like to add:  ",
					name: "productquantity"
				},
				{
					type: "confirm",
					message: "Are you sure:",
					name: "confirm",
					default: true
				}
			]).then(function (answer) {
				if (answer.confirm === true) {
					var chosenItem;
					for (var i = 0; i < results.length; i++) {
						if (results[i].item_id === parseInt(answer.productid)) {
							chosenItem = results[i];
						}
						//console.log(chosenItem);
					}
					console.log("prod id " + chosenItem.item_id);
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
							console.log("Quantity Added successfully!");
							start();
						});
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
				name: "productname"
			},
			{
				type: "input",
				message: "Enter the Quantity for the new product:  ",
				name: "productquantity"
			},
			{
				type: "input",
				message: "Enter the base Price for the new product:  ",
				name: "productprice"
			},
			{
				type: "confirm",
				message: "Are you sure:",
				name: "confirm",
				default: true
			}
		]).then(function (ans) {
			if (ans.confirm === true) {
				connection.query("INSERT INTO products SET ?", {
						product_name: ans.productname,
						price: ans.productquantity,
						stock_quantity: ans.productprice
					},
					function (err, res) {
						console.log(res.affectedRows + " Product inserted!\n");
						start();
					});
			}
		});

}