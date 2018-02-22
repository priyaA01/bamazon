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
				choices: ["View Product Sales by Department", "Create New Department"],
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
				if (response.menuchoice === "View Product Sales by Department") {
					productSales();
				} else if (response.menuchoice === "Create New Department") {
					addDepartment();
				} 
			}

		});
}

function productSales() {
	connection.query("SELECT * FROM departments", function (err, res) {
		for (var i = 0; i < res.length; i++) {
			console.log(res[i].item_id + "    |   " + res[i].product_name + "     |   " + res[i].price);
		}
		console.table(['department_id','department_name','over_head_costs','product_sales','total_profit'],values);
		
		start();
	});

}

function addDepartment()
{
	console.log("Adding new department...\n");

	inquirer
		.prompt([{
				type: "input",
				message: "Enter the department Name:  ",
				name: "deptname"
			},
			{
				type: "input",
				message: "Enter the over_head_costs for the department:  ",
				name: "deptcosts"
			},
			{
				type: "confirm",
				message: "Are you sure:",
				name: "confirm",
				default: true
			}
		]).then(function (ans) {
			if (ans.confirm === true) {
				connection.query("INSERT INTO departments SET ?", {
						department_name: ans.deptname,
						over_head_costs: ans.deptcosts,
					},
					function (err, res) {
						console.log(res.affectedRows + " Product inserted!\n");
						start();
					});
			}
		});

}