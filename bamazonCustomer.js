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
	queryAllProducts();
});

function queryAllProducts() {
	connection.query("SELECT * FROM products", function (err, res) {
		console.log("Id   |   Product    |     Price");
		console.log("-----------------------------------");
		for (var i = 0; i < res.length; i++) {
			console.log(res[i].item_id + "    |   " + res[i].product_name + "     |   " + res[i].price);
		}
		console.log("-----------------------------------");
		cust_view();
	});

	//connection.end();
}

function start() {
	console.log("Customer View over");
	//queryAllProducts();
	connection.end();

}

// function which prompts the user asking for what product they want to buy
function cust_view() {
	connection.query("SELECT * FROM products", function (err, results) {
		if (err) throw err;
		inquirer
			.prompt([{
					type: "input",
					message: "Enter the ID of the product you would like to buy:  ",
					name: "productid"
				},
				{
					type: "input",
					message: "Enter the Quantity you would like to buy:  ",
					name: "productquantity"
				},
				{
					type: "confirm",
					message: "Are you sure:",
					name: "confirm",
					default: true
				}
			])
			.then(function (answer) {
				//console.log("results " +results[0]);
				if (answer.confirm === true) {
					var chosenItem;
					for (var i = 0; i < results.length; i++) {
						if (results[i].item_id === parseInt(answer.productid)) {
							chosenItem = results[i];
						}
						//console.log(chosenItem);
					}
					console.log(chosenItem.stock_quantity - parseInt(answer.productquantity));
					console.log(answer.productquantity);
					if (chosenItem.stock_quantity - parseInt(answer.productquantity) > 0) {
						connection.query(
							"UPDATE products SET ? WHERE ?", [{
									stock_quantity: chosenItem.stock_quantity - parseInt(answer.productquantity)
								},
								{
									item_id: chosenItem.item_id
								}
							],
							function (error) {
								if (error) throw err;
								console.log("Quantity Updated successfully!");
								var totalCost = parseInt(answer.productquantity) * chosenItem.price;
								console.log("Total Cost of your Purchase : " + totalCost);
								start();
							}
						);
					} else {
						// quantity wasn't high enough
						console.log("Insufficient quantity!");
						start();
					}
				}
			});

	});
}