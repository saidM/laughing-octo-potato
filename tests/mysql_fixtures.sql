drop view if exists active_clients;
drop table if exists settings;
drop table if exists orders;
drop table if exists clients;

create table clients (
  id integer auto_increment not null,
  name text not null,
  email text not null,
  password text not null,
  active boolean not null,
  primary key (id)
); 

create table orders (
  id integer auto_increment not null,
  client_id integer not null,
  date date not null,
  amount float not null,
  primary key (id),
  foreign key (client_id) references clients(id)
);

create table settings (
  key2 text not null,
  value2 text not null
);

create view active_clients as
select name, email
from clients
where active is true;

insert into clients (name, email, password, active) values ('John', 'john@gmail.com', 'azerty', true);
insert into clients (name, email, password, active) values ('Adam', 'adam@gmail.com', 'qwerty', true);
insert into clients (name, email, password, active) values ('Spencer', 'spencer@gmail.com', 'foo', false);

insert into orders (client_id, date, amount) values (1, STR_TO_DATE('18/02/2019 11:15:45','%d/%m/%Y %H:%i:%s'), '99.50');
insert into orders (client_id, date, amount) values (2, STR_TO_DATE('18/02/2019 11:15:45','%d/%m/%Y %H:%i:%s'), '10.25');
insert into orders (client_id, date, amount) values (2, STR_TO_DATE('18/02/2019 11:15:45','%d/%m/%Y %H:%i:%s'), '0.99');

insert into settings (key2, value2) values ('currency', 'usd');
insert into settings (key2, value2) values ('locale', 'en');
