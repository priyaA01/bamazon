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

	connection.query("SELECT d.*,SUM(product_sales) AS product_sales ,SUM(product_sales) - d.over_head_costs  AS total_profit FROM departments d INNER JOIN products p WHERE  d.department_name = p.department_name GROUP BY p.department_name order by d.department_id",
		function (err, res) {
			console.table(res);

			start();
		});

}

function addDepartment() {
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