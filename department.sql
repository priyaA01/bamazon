CREATE TABLE bamazon.departments (
    department_id INT NOT NULL UNIQUE AUTO_INCREMENT,
    department_name VARCHAR(20) NOT NULL,
    over_head_costs INT
);

ALTER TABLE bamazon.departments
	ADD PRIMARY KEY (department_name);

SELECT * FROM bamazon.departments order by department_id;

INSERT INTO bamazon.departments (department_name, over_head_costs) VALUES("baby",1000);
INSERT INTO bamazon.departments (department_name, over_head_costs) VALUES("home",2000);
INSERT INTO bamazon.departments (department_name, over_head_costs) VALUES("kitchen",3000);
INSERT INTO bamazon.departments (department_name, over_head_costs) VALUES("books",4000);

select department_id, d.department_name, over_head_costs, p.product_sales
from departments d , products p
where d.department_name = p.department_name group by department_name


