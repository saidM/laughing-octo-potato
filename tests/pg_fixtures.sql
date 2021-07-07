drop view if exists active_clients;
drop table if exists settings;
drop table if exists orders;
drop table if exists clients;

create table clients (
  id serial primary key not null,
  name text not null,
  email text not null,
  password text not null,
  active boolean not null
); 

create table orders (
  id serial primary key not null,
  client_id integer references clients(id) not null,
  date timestamp not null,
  amount float not null
);

create table settings (
  key text primary key not null,
  value text not null
);

create view active_clients as
select name, email
from clients
where active is true;

insert into clients (name, email, password, active) values ('John', 'john@gmail.com', 'azerty', true);
insert into clients (name, email, password, active) values ('Adam', 'adam@gmail.com', 'qwerty', true);
insert into clients (name, email, password, active) values ('Spencer', 'spencer@gmail.com', 'foo', false);

insert into orders (client_id, date, amount) values (1, '2021-01-02T10:00Z', '99.50');
insert into orders (client_id, date, amount) values (2, '2021-01-03T10:00Z', '10.25');
insert into orders (client_id, date, amount) values (2, '2021-01-04T10:00Z', '0.99');

insert into settings (key, value) values ('currency', 'usd');
insert into settings (key, value) values ('locale', 'en');
