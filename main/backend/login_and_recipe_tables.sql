CREATE table admin_login(
email varchar(50),
username varchar(50) primary key, 
password varchar(40),
fname varchar(50),
lname varchar(50)
);
create table recipe(
r_title varchar(500),
r_ing varchar(500),
r_desc varchar(700),
r_cuisine varchar(100),
r_cookingt int(5),
r_serving  int(5),
r_author varchar(50),
primary key(r_title, r_author),
foreign key(r_author) references admin_login(username)
);