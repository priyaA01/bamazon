CREATE DATABASE bamazon;

-- DROP TABLE bamazon.products;

CREATE TABLE bamazon.products (
    item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
    product_name VARCHAR(20),
    department_name VARCHAR(20),
    price DECIMAL(10 , 2 ),
    stock_quantity INT
);

INSERT INTO bamazon.products (product_name, department_name, price,stock_quantity) VALUES("soap","baby",3.00,30);
INSERT INTO bamazon.products (product_name, department_name, price,stock_quantity) VALUES("diaper","baby",15.00,60);
INSERT INTO bamazon.products (product_name, department_name, price,stock_quantity) VALUES("swings","baby",82.25,10);
INSERT INTO bamazon.products (product_name, department_name, price,stock_quantity) VALUES("clocks","home",10.00,25);
INSERT INTO bamazon.products (product_name, department_name, price,stock_quantity) VALUES("rugs","home",35.62,72);
INSERT INTO bamazon.products (product_name, department_name, price,stock_quantity) VALUES("instant pot","kitchen",99.95,5);
INSERT INTO bamazon.products (product_name, department_name, price,stock_quantity) VALUES("blender","kitchen",69.95,15);
INSERT INTO bamazon.products (product_name, department_name, price,stock_quantity) VALUES("coffee maker","kitchen",19.99,20);
INSERT INTO bamazon.products (product_name, department_name, price,stock_quantity) VALUES("wonder","books",10.19,55);
INSERT INTO bamazon.products (product_name, department_name, price,stock_quantity) VALUES("harry potter","books",28.82,45);
