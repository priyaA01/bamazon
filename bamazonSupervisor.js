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
	console.log("\n    WELCOME TO BAMAZON!! SUPERVISOR PORTAL");
	console.log("\n   ***************************************");
	//function to display prompts for supervisor to choose from menu options
	start();
});

//prompt with menu options for supervisor to choose from
function start() {
	inquirer
		.prompt([{
				type: "list",
				message: "\nWhich would you like to do?",
				choices: ["View Product Sales by Department", "Create New Department", "Exit"],
				name: "menuchoice"
			},
			{
				type: "confirm",
				message: "\nDO YOU WANT TO PROCEED ? ",
				name: "confirm",
				default: true
			}
		])
		.then(function (response) {
			//if the choice is confirmed, relavant function call is made
			if (response.confirm) {
				if (response.menuchoice === "View Product Sales by Department") {
					productSales();
				} else if (response.menuchoice === "Create New Department") {
					addDepartment();
				}
				else if (response.menuchoice === "Exit"){
					console.log("\n-------------------------------------------------------------");
					console.log("   THANK YOU FOR YOUR SERVICE AT BAMAZON!! Credits : PRIYA\n");
					//to end supervisor view 
					connection.end();
				}
			} else {
				start();
			}

		});
}

//function to view product_sales and total_profit
function productSales() {
	//query the database for product sales from all departments frmo db and calculate total profit to be all displayed to the user
	connection.query("SELECT d.*,SUM(product_sales) AS product_sales ,SUM(product_sales) - d.over_head_costs  AS total_profit FROM departments d INNER JOIN products p WHERE  d.department_name = p.department_name GROUP BY p.department_name order by d.department_id",
		function (err, res) {
			if (err) throw err;
			console.log("\n");
			//data displayed in table format in the console
			console.table("  PRODUCT SALES", res);
			//function call to display menu options 
			start();

		});
}

//function to add new department
function addDepartment() {
	//query to get available departments - can add product in existing department
	connection.query("SELECT department_name FROM departments", function (err, results) {
		if (err) throw err;
		//prompt to get new department details
		inquirer
			.prompt([{
					type: "input",
					message: "\nEnter the department Name:  ",
					name: "deptname",
					validate: function (value) {
						//name cannot be numbers or empty
						if (isNaN(value)) {
							return value !== "";
						}
						return "Please Provide Valid Name";
					}
				},
				{
					type: "input",
					message: "\nEnter the over_head_costs for the department:  ",
					name: "deptcosts",
					validate: function (value) {
						//costs has to be numbers 
						if (isNaN(value) === false && value > 0) {
							return value !== "";
						}
						return "Please Provide Costs in Numbers";
					}
				},
				{
					type: "confirm",
					message: "\nDO YOU WANT TO ADD THIS NEW DEPARTMENT ?",
					name: "confirm",
					default: true
				}
			]).then(function (ans) {
				if (ans.confirm) {
					//once details of the new department is confirmed
					//chk if the department already exists
					var chosenItem = "";
					for (var i = 0; i < results.length; i++) {
						if ((results[i].department_name).toLowerCase() === (ans.deptname).toLowerCase()) {
							chosenItem = results[i];
						}
					}
					//if department already exists
					if (chosenItem !="") {
						console.log("\n****************************************");
						console.log("     DEPARTMENT ALREADY EXISTS! TRY AGAIN");
						console.log("****************************************\n");
						//allow to add again 
						addDepartment();
					} else {
						//query to add new department
						connection.query("INSERT INTO departments SET ?", 
							{
								department_name: ans.deptname,
								over_head_costs: ans.deptcosts
							},
							function (err, res) {
								if (err) throw err;
								console.log("\n****************************************");
								console.log("     DEPARTMENT ADDED SUCCESSFULLY!");
								console.log("****************************************\n");

								//start over
								start();
							});
					}

				} else {
					//if not sure allow to add again 
					addDepartment();
				}
			});
	});

}