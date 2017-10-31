drop database if exists bamazon_db;
create database bamazon_db;

use bamazon_db;

create table products(
item_id int(20) auto_increment primary key,
product_name varchar(200) not null,
department_name varchar(50) not null,
-- https://dev.mysql.com/doc/refman/5.5/en/floating-point-types.html--
price float(8,2) not null,
stock_quantity int(10) not null
);


insert into products (product_name, department_name, price, stock_quantity) values ('TopQPS Tri-Spinner Fidget Hand Spinner Toy', 'Toys & Games', 7.99, 10000);
insert into products (product_name, department_name, price, stock_quantity) values ('LEGO Simpsons 71016 the Kwik-E-Mart Building Kit', 'Toys & Games', 199.94, 1000);
insert into products (product_name, department_name, price, stock_quantity) values ('R2-D2 App-Enabled Droid by Sphero', 'Toys & Games', 165.00, 500);
insert into products (product_name, department_name, price, stock_quantity) values ('NEW TickTalk 2 Touch Screen Kids Smart Watch', 'Wearable Technology', 149.99, 100);
insert into products (product_name, department_name, price, stock_quantity) values ('Cuisinart CTG-00-3MS Set of 3 Fine Mesh Stainless Steel Strainers', 'Home', 10.15, 5);
insert into products (product_name, department_name, price, stock_quantity) values ('Keurig® K150P Small/Medium Office Brewer', 'Home & Kitchen', 354.00, 175);
insert into products (product_name, department_name, price, stock_quantity) values ('Perky-Pet Copper Panorama Bird Feeder 312C', 'Outdoor Decor', 16.78, 100);
INSERT INTO products (product_name, department_name, price, stock_quantity) values ('Little Cottage Company Classic Wood Cottage DIY Playhouse Kit', 'Home', 5278.07, 1);
insert into products (product_name, department_name, price, stock_quantity) values ('Champion Power Equipment 100340 5500W 6875 Starting Watts Portable Generator with Wheel Kit ', 'Tools', 978.09, 10);
insert into products (product_name, department_name, price, stock_quantity) values ('LEGO Star Wars Advent Calendar 75184 Building Kit ', 'Toys & Games', 34.76, 400);

create table departments (
    department_id int(20) auto_increment primary key,
    department_name varchar(50) not null,
    over_head_costs float(8, 2) not null,
    sales_total float(8, 2) not null
);

