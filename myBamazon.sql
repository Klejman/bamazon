DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
item_id int(20) auto_increment primary key,
product_name varchar(200) not null,
department_name varchar(50) not null,
-- https://dev.mysql.com/doc/refman/5.5/en/floating-point-types.html--
price float(8,2) not null,
stock_quantity int(10) not null
);


INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('TopQPS Tri-Spinner Fidget Hand Spinner Toy', 'Toys & Games', 7.99, 10000);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('LEGO Simpsons 71016 the Kwik-E-Mart Building Kit', 'Toys & Games', 199.94, 1000);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('R2-D2 App-Enabled Droid by Sphero', 'Toys & Games', 165.00, 500);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('NEW TickTalk 2 Touch Screen Kids Smart Watch', 'Wearable Technology', 149.99, 100);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Cuisinart CTG-00-3MS Set of 3 Fine Mesh Stainless Steel Strainers', 'Home', 10.15, 5);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Keurig® K150P Small/Medium Office Brewer', 'Home & Kitchen', 354.00, 175);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Perky-Pet Copper Panorama Bird Feeder 312C', 'Outdoor Decor', 16.78, 100);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Little Cottage Company Classic Wood Cottage DIY Playhouse Kit', 'Home', 5278.07, 1);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Champion Power Equipment 100340 5500W 6875 Starting Watts Portable Generator with Wheel Kit ', 'Tools', 978.09, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('LEGO Star Wars Advent Calendar 75184 Building Kit ', 'Toys & Games', 34.76, 400);
