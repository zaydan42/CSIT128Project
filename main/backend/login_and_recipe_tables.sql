CREATE DATABASE yumshare;
USE yumshare;

CREATE TABLE admin_login (
  email VARCHAR(50) NOT NULL,
  username VARCHAR(50) PRIMARY KEY NOT NULL,
  password VARCHAR(60) NOT NULL,
  fname VARCHAR(50) NOT NULL,
  lname VARCHAR(50) NOT NULL
);

CREATE TABLE recipe(
r_title VARCHAR(500),
r_ing VARCHAR(500),
r_desc VARCHAR(700),
r_cuisine VARCHAR(100),
r_cookingt INT(5),
r_serving  INT(5),
r_author VARCHAR(50),
PRIMARY KEY(r_title, r_author),
FOREIGN KEY(r_author) REFERENCES admin_login(username)
);







