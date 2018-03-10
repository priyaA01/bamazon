SELECT SUM(product_sales) AS total_sales FROM bamazon.products GROUP BY department_name;

USE bamazon;
SELECT d.*, SUM(product_sales) AS product_sales ,
SUM(product_sales) - d.over_head_costs  AS total_profit
FROM departments d INNER JOIN products p WHERE  d.department_name = p.department_name
GROUP BY p.department_name
ORDER BY d.department_id;

